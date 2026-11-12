'use client';

import { useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import {
  CalendarEvent,
  ConflictDetectionEngine,
  ScheduleConflict,
  SchedulingPreference,
  type CalendarSource,
  type ConnectedAccount,
  type NewEventInput,
  type PushResult
} from '../core/domain';
import { startOfDay, addDays } from '../core/utils/time';
import { buildDemoData } from '../data/demo-data';
import { meetApi } from '../data/meet-api';
import { meetRepository, type PreferencePatch } from '../data/meet-repository';

export interface MeetUser {
  id: string;
  fullName: string;
  email: string;
  timeZone: string;
}

export interface MeetValue {
  /** `demo` = sample data, nothing is saved (no Supabase configured, or `?demo=1`). */
  mode: 'live' | 'demo';
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  user: MeetUser | null;
  /** Events of visible calendars only. */
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  sources: CalendarSource[];
  accounts: ConnectedAccount[];
  conflicts: ScheduleConflict[];
  preference: SchedulingPreference;
  engine: ConflictDetectionEngine;
  isSyncing: boolean;
  sourceOf(event: CalendarEvent): CalendarSource | undefined;
  conflictsOf(eventId: string): ScheduleConflict[];
  /** Apple (EventKit) calendars are written on the phone; the web can only read them. */
  canWrite(source: CalendarSource | undefined): boolean;
  refresh(): Promise<void>;
  syncNow(): Promise<void>;
  createEvent(input: NewEventInput): Promise<PushResult>;
  updateEvent(
    eventId: string,
    patch: Partial<NewEventInput>
  ): Promise<PushResult>;
  deleteEvent(eventId: string): Promise<void>;
  resolveConflict(conflictId: string): Promise<void>;
  setCalendarVisible(calendarId: string, visible: boolean): Promise<void>;
  updatePreference(patch: PreferencePatch): Promise<void>;
  disconnectAccount(accountId: string): Promise<void>;
  /** Keeps `?demo=1` when navigating inside the Meet area. */
  href(path: string): string;
}

const MeetContext = createContext<MeetValue | null>(null);

const WINDOW_BACK_DAYS = 30;
const WINDOW_AHEAD_DAYS = 180;
const TABLES = [
  'calendar_events',
  'schedule_conflicts',
  'calendar_sources',
  'connected_accounts'
];
const browserZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

export function MeetProvider({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const demo = !isSupabaseConfigured || params.get('demo') === '1';

  const [engine] = useState(() => new ConflictDetectionEngine());
  const [status, setStatus] = useState<MeetValue['status']>('loading');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<MeetUser | null>(null);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [sources, setSources] = useState<CalendarSource[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [serverConflicts, setServerConflicts] = useState<ScheduleConflict[]>(
    []
  );
  const [preference, setPreference] = useState<SchedulingPreference>(
    SchedulingPreference.defaults()
  );
  const [isSyncing, setSyncing] = useState(false);
  const demoSeq = useRef(0);

  // ---- loading ---------------------------------------------------------------
  const refresh = useCallback(async () => {
    if (demo) return;
    try {
      const now = new Date();
      const range = {
        from: startOfDay(addDays(now, -WINDOW_BACK_DAYS)),
        to: startOfDay(addDays(now, WINDOW_AHEAD_DAYS))
      };
      const [profile, pref, srcs, accs, evs, conflicts] = await Promise.all([
        meetRepository.fetchProfile(),
        meetRepository.fetchPreference(),
        meetRepository.fetchSources(),
        meetRepository.fetchAccounts(),
        meetRepository.fetchEvents(range),
        meetRepository.fetchOpenConflicts()
      ]);
      setUser({
        id: profile.user_id,
        fullName: profile.full_name,
        email: profile.email,
        timeZone: profile.current_timezone
      });
      setPreference(pref);
      setSources(srcs);
      setAccounts(accs);
      setAllEvents(evs);
      setServerConflicts(conflicts);
      setError(null);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your schedule');
      setStatus('error');
    }
  }, [demo]);

  useEffect(() => {
    if (!demo) {
      const id = setTimeout(() => void refresh(), 0);
      return () => clearTimeout(id);
    }
    // Demo data depends on "now", so it is built on the client after mount (never during SSR).
    const id = setTimeout(() => {
      const d = buildDemoData();
      setUser({ ...d.user, timeZone: browserZone() });
      setAllEvents(d.events);
      setSources(d.sources);
      setAccounts(d.accounts);
      setPreference(d.preference);
      setStatus('ready');
    }, 0);
    return () => clearTimeout(id);
  }, [demo, refresh]);

  // Realtime: sync results, conflicts and account status land live (same as the phone).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (demo || !user) return;
    const sb = getSupabaseBrowser();
    let channel = sb.channel(`meet:${user.id}`);
    for (const table of TABLES) {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => void refresh(), 800);
        }
      );
    }
    channel.subscribe();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      void sb.removeChannel(channel);
    };
  }, [demo, user, refresh]);

  // ---- derived ---------------------------------------------------------------
  const sourceById = useMemo(
    () => new Map(sources.map((s) => [s.calendarId, s])),
    [sources]
  );
  const events = useMemo(
    () =>
      allEvents.filter(
        (e) => sourceById.get(e.calendarId)?.isVisible !== false
      ),
    [allEvents, sourceById]
  );
  const conflicts = useMemo(() => {
    if (!demo) return serverConflicts;
    return engine
      .detectAllConflicts(events, {
        preference,
        timeZone: user?.timeZone ?? browserZone()
      })
      .map(
        (c) =>
          new ScheduleConflict(
            `local:${c.signature}`,
            c.type,
            c.eventIds,
            new Date()
          )
      );
  }, [demo, serverConflicts, engine, events, preference, user]);
  const byEvent = useMemo(() => {
    const m = new Map<string, ScheduleConflict[]>();
    for (const c of conflicts)
      for (const id of c.eventIds) m.set(id, [...(m.get(id) ?? []), c]);
    return m;
  }, [conflicts]);

  // ---- actions ---------------------------------------------------------------
  const guard = async <T,>(fn: () => Promise<T>): Promise<T> => {
    const r = await fn();
    await refresh();
    return r;
  };

  const value: MeetValue = {
    mode: demo ? 'demo' : 'live',
    status,
    error,
    user,
    events,
    allEvents,
    sources,
    accounts,
    conflicts,
    preference,
    engine,
    isSyncing,
    sourceOf: (e) => sourceById.get(e.calendarId),
    conflictsOf: (id) => byEvent.get(id) ?? [],
    canWrite: (s) => !!s && s.provider === 'GOOGLE' && s.isWritable,
    refresh,
    href: (path) =>
      demo && isSupabaseConfigured
        ? `${path}${path.includes('?') ? '&' : '?'}demo=1`
        : path,

    async syncNow() {
      if (demo) return;
      setSyncing(true);
      try {
        await meetApi.syncNow();
        await refresh();
      } finally {
        setSyncing(false);
      }
    },
    async createEvent(input) {
      if (demo) {
        const id = `demo-new-${++demoSeq.current}`;
        setAllEvents((list) => [
          ...list,
          new CalendarEvent({
            eventId: id,
            calendarId: input.calendarId,
            externalEventId: id,
            title: input.title,
            description: input.description,
            location: input.location,
            startTime: input.startTime,
            endTime: input.endTime,
            isAllDay: input.isAllDay ?? false,
            status: input.status ?? 'BUSY',
            lifecycleState: 'SYNCED'
          })
        ]);
        return { eventId: id, conflictTypes: [] };
      }
      return guard(() => meetApi.createEvent(input));
    },
    async updateEvent(eventId, patch) {
      if (demo) {
        setAllEvents((list) =>
          list.map((e) =>
            e.eventId !== eventId
              ? e
              : new CalendarEvent({
                  eventId: e.eventId,
                  calendarId: e.calendarId,
                  externalEventId: e.externalEventId,
                  title: patch.title ?? e.title,
                  description: patch.description ?? e.description,
                  location: patch.location ?? e.location,
                  startTime: patch.startTime ?? e.startTime,
                  endTime: patch.endTime ?? e.endTime,
                  isAllDay: patch.isAllDay ?? e.isAllDay,
                  status: patch.status ?? e.status,
                  lifecycleState: e.lifecycleState
                })
          )
        );
        return { eventId, conflictTypes: [] };
      }
      return guard(() => meetApi.updateEvent(eventId, patch));
    },
    async deleteEvent(eventId) {
      if (demo) {
        setAllEvents((list) => list.filter((e) => e.eventId !== eventId));
        return;
      }
      await guard(() => meetApi.deleteEvent(eventId));
    },
    async resolveConflict(conflictId) {
      if (demo) return;
      await guard(() => meetRepository.resolveConflict(conflictId));
    },
    async setCalendarVisible(calendarId, visible) {
      setSources((list) =>
        list.map((s) =>
          s.calendarId !== calendarId
            ? s
            : new (s.constructor as typeof CalendarSource)(
                s.calendarId,
                s.accountId,
                s.provider,
                s.externalCalendarId,
                s.calendarName,
                s.colorHex,
                visible,
                s.isReadOnly
              )
        )
      );
      if (!demo) await meetRepository.setSourceVisibility(calendarId, visible);
    },
    async updatePreference(patch) {
      if (demo) {
        const p = preference;
        setPreference(
          new SchedulingPreference({
            preferenceId: p.preferenceId,
            workingDays: patch.working_days ?? p.workingDays,
            workStartTime: patch.work_start_time ?? p.workStartTime,
            workEndTime: patch.work_end_time ?? p.workEndTime,
            bufferMinutesAfterMeeting:
              patch.buffer_minutes_after_meeting ?? p.bufferMinutesAfterMeeting,
            defaultReminderMinutes:
              patch.default_reminder_minutes ?? p.defaultReminderMinutes
          })
        );
        return;
      }
      setPreference(await meetRepository.updatePreference(patch));
    },
    async disconnectAccount(accountId) {
      if (demo) {
        setAccounts((l) => l.filter((a) => a.accountId !== accountId));
        setSources((l) => l.filter((s) => s.accountId !== accountId));
        return;
      }
      await guard(() => meetApi.disconnectAccount(accountId));
    }
  };

  return <MeetContext.Provider value={value}>{children}</MeetContext.Provider>;
}

export function useMeet(): MeetValue {
  const ctx = useContext(MeetContext);
  if (!ctx) throw new Error('useMeet must be used inside <MeetProvider>');
  return ctx;
}
