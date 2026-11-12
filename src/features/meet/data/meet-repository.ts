import { getSupabaseBrowser } from '@/lib/supabase/client';
import {
  ACCOUNT_COLUMNS,
  CONFLICT_COLUMNS,
  EVENT_COLUMNS,
  PREFERENCE_COLUMNS,
  SOURCE_COLUMNS,
  toAccount,
  toConflict,
  toEvent,
  toPreference,
  toSource,
  type AccountRow,
  type ConflictRow,
  type EventRow,
  type PreferenceRow,
  type SourceRow
} from '../core/data/rows';
import type {
  CalendarEvent,
  CalendarSource,
  ConnectedAccount,
  ScheduleConflict,
  SchedulingPreference
} from '../core/domain';
import type { DateRange } from '../core/domain/ports/calendar-provider-adapter';

const PAGE = 1000; // PostgREST default max_rows

export interface ProfileRow {
  user_id: string;
  full_name: string;
  email: string;
  current_timezone: string;
}

export type PreferencePatch = Partial<{
  working_days: number[];
  work_start_time: string;
  work_end_time: string;
  buffer_minutes_after_meeting: number;
  default_reminder_minutes: number;
}>;

const fail = (context: string, error: { message: string }): never => {
  throw new Error(`${context}: ${error.message}`);
};

/** Thin, typed gateway to Supabase — the same queries as the mobile app. RLS scopes every one to the caller. */
export const meetRepository = {
  /** The signed-in user's profile; created on demand if the signup trigger missed it. */
  async fetchProfile(): Promise<ProfileRow> {
    const sb = getSupabaseBrowser();
    const query = () =>
      sb
        .from('users')
        .select('user_id,full_name,email,current_timezone')
        .maybeSingle();
    let { data, error } = await query();
    if (error) fail('fetchProfile', error);
    if (!data) {
      const { error: healError } = await sb.rpc('ensure_my_profile');
      if (healError) fail('ensureProfile', healError);
      ({ data, error } = await query());
      if (error) fail('fetchProfile', error);
    }
    if (!data) throw new Error('Profile could not be created');
    return data as ProfileRow;
  },

  async fetchPreference(): Promise<SchedulingPreference> {
    const { data, error } = await getSupabaseBrowser()
      .from('scheduling_preferences')
      .select(PREFERENCE_COLUMNS)
      .single();
    if (error) fail('fetchPreference', error);
    return toPreference(data as PreferenceRow);
  },

  async updatePreference(
    patch: PreferencePatch
  ): Promise<SchedulingPreference> {
    const { data, error } = await getSupabaseBrowser()
      .from('scheduling_preferences')
      .update(patch)
      .not('preference_id', 'is', null) // RLS limits this to the caller's single row
      .select(PREFERENCE_COLUMNS)
      .single();
    if (error) fail('updatePreference', error);
    return toPreference(data as PreferenceRow);
  },

  async fetchAccounts(): Promise<ConnectedAccount[]> {
    const { data, error } = await getSupabaseBrowser()
      .from('connected_accounts')
      .select(ACCOUNT_COLUMNS);
    if (error) fail('fetchAccounts', error);
    return ((data ?? []) as AccountRow[]).map(toAccount);
  },

  async fetchSources(): Promise<CalendarSource[]> {
    const { data, error } = await getSupabaseBrowser()
      .from('calendar_sources')
      .select(SOURCE_COLUMNS)
      .order('calendar_name');
    if (error) fail('fetchSources', error);
    return ((data ?? []) as unknown as SourceRow[]).map(toSource);
  },

  async setSourceVisibility(
    calendarId: string,
    isVisible: boolean
  ): Promise<void> {
    const { error } = await getSupabaseBrowser()
      .from('calendar_sources')
      .update({ is_visible: isVisible })
      .eq('calendar_id', calendarId);
    if (error) fail('setSourceVisibility', error);
  },

  async fetchEvents(range: DateRange): Promise<CalendarEvent[]> {
    const sb = getSupabaseBrowser();
    const out: CalendarEvent[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await sb
        .from('calendar_events')
        .select(EVENT_COLUMNS)
        .neq('lifecycle_state', 'CANCELLED')
        .lt('start_time', range.to.toISOString())
        .gt('end_time', range.from.toISOString())
        .order('start_time')
        .order('event_id')
        .range(from, from + PAGE - 1);
      if (error) fail('fetchEvents', error);
      const rows = (data ?? []) as EventRow[];
      out.push(...rows.map(toEvent));
      if (rows.length < PAGE) break;
    }
    return out;
  },

  async fetchOpenConflicts(): Promise<ScheduleConflict[]> {
    const { data, error } = await getSupabaseBrowser()
      .from('schedule_conflicts')
      .select(CONFLICT_COLUMNS)
      .eq('is_resolved', false);
    if (error) fail('fetchOpenConflicts', error);
    return ((data ?? []) as unknown as ConflictRow[]).map(toConflict);
  },

  async resolveConflict(conflictId: string): Promise<void> {
    const { error } = await getSupabaseBrowser().rpc('resolve_conflict', {
      p_conflict_id: conflictId
    });
    if (error) fail('resolveConflict', error);
  }
};
