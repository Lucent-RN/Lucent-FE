// @generated from LucentMeet/src/features/ai-assistant/data/tool-executor.ts — DO NOT EDIT. Run `yarn meet:sync`.
import {
  CalendarEvent,
  type CalendarSource,
  type ConflictDetectionEngine,
  type SchedulingPreference,
} from '../domain';
import { MS_DAY, MS_MINUTE, zonedParts } from '../utils/time';
import type { ProposalDraft } from './types';

export interface ToolEnv {
  /** Events of visible calendars (what the user sees). */
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  sources: CalendarSource[];
  preference: SchedulingPreference;
  timeZone: string;
  engine: ConflictDetectionEngine;
  now: Date;
}

export interface ToolOutcome {
  content: string;
  isError?: boolean;
  proposal?: ProposalDraft;
}

const MAX_LISTED = 60;
const MAX_SEARCH_DAYS = 14;
const STEP = 15 * MS_MINUTE;

const pad = (n: number) => String(n).padStart(2, '0');

/** ISO 8601 in the user's timezone *with* offset, so the model never converts. */
export function toLocalISO(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  const offset = Math.round(
    (asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000,
  );
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

const fail = (message: string): ToolOutcome => ({
  content: JSON.stringify({ error: message }),
  isError: true,
});
const ok = (data: unknown, proposal?: ProposalDraft): ToolOutcome => ({
  content: JSON.stringify(data),
  proposal,
});

const asDate = (v: unknown): Date | null => {
  if (typeof v !== 'string') return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
const asString = (v: unknown, max = 255): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

const compact = (e: CalendarEvent, env: ToolEnv) => ({
  id: e.eventId,
  title: e.title,
  start: e.isAllDay ? undefined : toLocalISO(e.startTime, env.timeZone),
  end: e.isAllDay ? undefined : toLocalISO(e.endTime, env.timeZone),
  date: e.isAllDay
    ? toLocalISO(e.startTime, env.timeZone).slice(0, 10)
    : undefined,
  all_day: e.isAllDay || undefined,
  status: e.status === 'BUSY' ? undefined : e.status,
  location: e.location ?? undefined,
  calendar: env.sources.find(s => s.calendarId === e.calendarId)?.calendarName,
});

function listEvents(input: Record<string, unknown>, env: ToolEnv) {
  const from = asDate(input.from);
  const to = asDate(input.to);
  if (!from || !to || to <= from)
    return fail('from/to must be valid ISO dates with to > from');
  const hits = env.events
    .filter(e => e.endTime > from && e.startTime < to)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return ok({
    count: hits.length,
    truncated: hits.length > MAX_LISTED || undefined,
    events: hits.slice(0, MAX_LISTED).map(e => compact(e, env)),
  });
}

function findFreeSlots(input: Record<string, unknown>, env: ToolEnv) {
  const reqFrom = asDate(input.from);
  const reqTo = asDate(input.to);
  const minutes = Number(input.duration_minutes);
  if (!reqFrom || !reqTo || reqTo <= reqFrom)
    return fail('from/to must be valid ISO dates with to > from');
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 480)
    return fail('duration_minutes must be 5–480');
  const limit = Math.min(Math.max(Math.floor(Number(input.limit) || 5), 1), 8);

  const from = new Date(Math.max(reqFrom.getTime(), env.now.getTime()));
  const to = new Date(
    Math.min(reqTo.getTime(), from.getTime() + MAX_SEARCH_DAYS * MS_DAY),
  );
  const duration = minutes * MS_MINUTE;
  const buffer = env.preference.bufferMinutesAfterMeeting * MS_MINUTE;
  const busy = env.events
    .filter(e => e.status !== 'FREE' && !e.isAllDay)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const slots: Array<{ start: string; end: string }> = [];
  let t = Math.ceil(from.getTime() / STEP) * STEP;
  while (t + duration <= to.getTime() && slots.length < limit) {
    const start = new Date(t);
    const end = new Date(t + duration);
    const clash = busy.find(
      e =>
        e.startTime.getTime() < end.getTime() + buffer &&
        e.endTime.getTime() + buffer > t,
    );
    if (clash) {
      // Jump past the blocker instead of crawling 15 minutes at a time.
      t = Math.max(
        t + STEP,
        Math.ceil((clash.endTime.getTime() + buffer) / STEP) * STEP,
      );
    } else if (!env.preference.isWithinWorkingHours(start, end, env.timeZone)) {
      t += STEP;
    } else {
      slots.push({
        start: toLocalISO(start, env.timeZone),
        end: toLocalISO(end, env.timeZone),
      });
      t += duration;
    }
  }
  return ok({
    duration_minutes: minutes,
    slots,
    note: slots.length
      ? undefined
      : 'No free slot in this window within working hours',
  });
}

function conflictsFor(
  start: Date,
  end: Date,
  ignoreId: string | undefined,
  env: ToolEnv,
) {
  const draft = new CalendarEvent({
    eventId: ignoreId ?? 'draft',
    calendarId: env.sources[0]?.calendarId ?? '',
    externalEventId: '',
    title: 'draft',
    startTime: start,
    endTime: end,
    isAllDay: false,
    status: 'BUSY',
    lifecycleState: 'SYNCED',
  });
  return env.engine.previewFor(draft, env.events, {
    preference: env.preference,
    timeZone: env.timeZone,
  });
}

function checkConflicts(input: Record<string, unknown>, env: ToolEnv) {
  const start = asDate(input.start);
  const end = asDate(input.end);
  if (!start || !end || end <= start)
    return fail('start/end must be valid ISO dates with end > start');
  const found = conflictsFor(
    start,
    end,
    asString(input.ignore_event_id, 100),
    env,
  );
  return ok({
    free: found.length === 0,
    conflicts: found.map(c => ({
      type: c.type,
      with: c.eventIds
        .map(id => env.events.find(e => e.eventId === id))
        .filter(
          e =>
            e &&
            e.eventId !== (asString(input.ignore_event_id, 100) ?? 'draft'),
        )
        .map(
          e =>
            e && {
              title: e.title,
              start: toLocalISO(e.startTime, env.timeZone),
            },
        ),
    })),
  });
}

function proposeCreate(input: Record<string, unknown>, env: ToolEnv) {
  const title = asString(input.title);
  const start = asDate(input.start);
  const end = asDate(input.end);
  if (!title) return fail('title is required');
  if (!start || !end || end <= start)
    return fail('start/end must be valid ISO dates with end > start');
  const writable = env.sources.filter(s => s.isWritable);
  const wanted = asString(input.calendar_id, 100);
  const source = writable.find(s => s.calendarId === wanted) ?? writable[0];
  if (!source) return fail('No writable calendar is connected');
  const warnings = conflictsFor(start, end, undefined, env).map(c => c.type);
  return ok(
    {
      status: 'proposed_awaiting_user_confirmation',
      calendar: source.calendarName,
      warnings,
    },
    {
      kind: 'create',
      title,
      start,
      end,
      allDay: input.all_day === true,
      location: asString(input.location, 500),
      calendarId: source.calendarId,
      calendarName: source.calendarName,
      warnings,
    },
  );
}

function proposeUpdate(input: Record<string, unknown>, env: ToolEnv) {
  const id = asString(input.event_id, 100);
  const event = env.allEvents.find(e => e.eventId === id);
  if (!event) return fail('Unknown event_id; call list_events first');
  const start =
    input.start !== undefined ? asDate(input.start) : event.startTime;
  const end = input.end !== undefined ? asDate(input.end) : event.endTime;
  if (!start || !end || end <= start)
    return fail('start/end must be valid ISO dates with end > start');
  const warnings = conflictsFor(start, end, event.eventId, env).map(
    c => c.type,
  );
  return ok(
    { status: 'proposed_awaiting_user_confirmation', warnings },
    {
      kind: 'update',
      eventId: event.eventId,
      title: asString(input.title) ?? event.title,
      start,
      end,
      allDay: event.isAllDay,
      location: asString(input.location, 500) ?? event.location ?? undefined,
      calendarId: event.calendarId,
      calendarName: env.sources.find(s => s.calendarId === event.calendarId)
        ?.calendarName,
      before: {
        title: event.title,
        start: event.startTime,
        end: event.endTime,
      },
      warnings,
    },
  );
}

function proposeDelete(input: Record<string, unknown>, env: ToolEnv) {
  const id = asString(input.event_id, 100);
  const event = env.allEvents.find(e => e.eventId === id);
  if (!event) return fail('Unknown event_id; call list_events first');
  return ok(
    { status: 'proposed_awaiting_user_confirmation' },
    {
      kind: 'delete',
      eventId: event.eventId,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.isAllDay,
      calendarId: event.calendarId,
      calendarName: env.sources.find(s => s.calendarId === event.calendarId)
        ?.calendarName,
      before: {
        title: event.title,
        start: event.startTime,
        end: event.endTime,
      },
      warnings: [],
    },
  );
}

/** Runs one model-requested tool. Never throws: failures go back to the model. */
export function executeTool(
  name: string,
  input: Record<string, unknown>,
  env: ToolEnv,
): ToolOutcome {
  try {
    switch (name) {
      case 'list_events':
        return listEvents(input, env);
      case 'find_free_slots':
        return findFreeSlots(input, env);
      case 'check_conflicts':
        return checkConflicts(input, env);
      case 'propose_create_event':
        return proposeCreate(input, env);
      case 'propose_update_event':
        return proposeUpdate(input, env);
      case 'propose_delete_event':
        return proposeDelete(input, env);
      default:
        return fail(`Unknown tool ${name}`);
    }
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Tool failed');
  }
}

/** Short status line shown while a tool runs. */
export const TOOL_ACTIVITY: Record<string, string> = {
  list_events: 'checking',
  find_free_slots: 'finding',
  check_conflicts: 'conflicts',
  propose_create_event: 'drafting',
  propose_update_event: 'drafting',
  propose_delete_event: 'drafting',
};
