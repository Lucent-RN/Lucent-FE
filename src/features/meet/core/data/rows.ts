// @generated from LucentMeet/src/features/calendar/data/rows.ts — DO NOT EDIT. Run `yarn meet:sync`.
/** Raw PostgREST row shapes (snake_case) + mappers to domain objects. */
import {
  CalendarEvent,
  CalendarSource,
  ConnectedAccount,
  Reminder,
  ScheduleConflict,
  SchedulingPreference,
  type AvailabilityStatus,
  type ConflictType,
  type EventLifecycleState,
  type ProviderType,
  type SyncStatus,
} from '../domain';

export interface EventRow {
  event_id: string;
  calendar_id: string;
  external_event_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: AvailabilityStatus;
  lifecycle_state: EventLifecycleState;
  conference_url: string | null;
}
export const EVENT_COLUMNS =
  'event_id,calendar_id,external_event_id,title,description,location,start_time,end_time,is_all_day,status,lifecycle_state,conference_url';

export const toEvent = (r: EventRow): CalendarEvent =>
  new CalendarEvent({
    eventId: r.event_id,
    calendarId: r.calendar_id,
    externalEventId: r.external_event_id,
    title: r.title,
    description: r.description,
    location: r.location,
    startTime: new Date(r.start_time),
    endTime: new Date(r.end_time),
    isAllDay: r.is_all_day,
    status: r.status,
    lifecycleState: r.lifecycle_state,
    conferenceUrl: r.conference_url,
  });

export interface SourceRow {
  calendar_id: string;
  account_id: string;
  external_calendar_id: string;
  calendar_name: string;
  color_hex: string;
  is_visible: boolean;
  is_read_only: boolean;
  connected_accounts:
    { provider: ProviderType } | { provider: ProviderType }[] | null;
}
export const SOURCE_COLUMNS =
  'calendar_id,account_id,external_calendar_id,calendar_name,color_hex,is_visible,is_read_only,connected_accounts(provider)';

export const toSource = (r: SourceRow): CalendarSource => {
  const acc = Array.isArray(r.connected_accounts)
    ? r.connected_accounts[0]
    : r.connected_accounts;
  return new CalendarSource(
    r.calendar_id,
    r.account_id,
    acc?.provider ?? 'GOOGLE',
    r.external_calendar_id,
    r.calendar_name,
    r.color_hex,
    r.is_visible,
    r.is_read_only,
  );
};

export interface AccountRow {
  account_id: string;
  provider: ProviderType;
  account_email: string;
  sync_status: SyncStatus;
  last_synced_at: string | null;
  token_expiry: string | null;
  last_error: string | null;
}
/** Explicit list: token columns are not selectable by clients. */
export const ACCOUNT_COLUMNS =
  'account_id,provider,account_email,sync_status,last_synced_at,token_expiry,last_error';

export const toAccount = (r: AccountRow): ConnectedAccount =>
  new ConnectedAccount(
    r.account_id,
    r.provider,
    r.account_email,
    r.sync_status,
    r.last_synced_at ? new Date(r.last_synced_at) : null,
    r.token_expiry ? new Date(r.token_expiry) : null,
    r.last_error,
  );

export interface ConflictRow {
  conflict_id: string;
  conflict_type: ConflictType;
  detected_at: string;
  is_resolved: boolean;
  conflict_events: Array<{
    event_id: string;
    role_in_conflict: 'PRIMARY_EVENT' | 'OVERLAPPING_EVENT';
  }>;
}
export const CONFLICT_COLUMNS =
  'conflict_id,conflict_type,detected_at,is_resolved,conflict_events(event_id,role_in_conflict)';

export const toConflict = (r: ConflictRow): ScheduleConflict => {
  const ordered = [...r.conflict_events].sort(
    (a, b) =>
      Number(b.role_in_conflict === 'PRIMARY_EVENT') -
      Number(a.role_in_conflict === 'PRIMARY_EVENT'),
  );
  return new ScheduleConflict(
    r.conflict_id,
    r.conflict_type,
    ordered.map(e => e.event_id),
    new Date(r.detected_at),
    r.is_resolved,
  );
};

export interface PreferenceRow {
  preference_id: string;
  working_days: number[];
  work_start_time: string;
  work_end_time: string;
  buffer_minutes_after_meeting: number;
  default_reminder_minutes: number;
}
export const PREFERENCE_COLUMNS =
  'preference_id,working_days,work_start_time,work_end_time,buffer_minutes_after_meeting,default_reminder_minutes';

export const toPreference = (r: PreferenceRow): SchedulingPreference =>
  new SchedulingPreference({
    preferenceId: r.preference_id,
    workingDays: r.working_days,
    workStartTime: r.work_start_time.slice(0, 5),
    workEndTime: r.work_end_time.slice(0, 5),
    bufferMinutesAfterMeeting: r.buffer_minutes_after_meeting,
    defaultReminderMinutes: r.default_reminder_minutes,
  });

export interface ReminderRow {
  reminder_id: string;
  event_id: string;
  minutes_before_start: number;
  trigger_at: string;
  is_delivered: boolean;
}
export const REMINDER_COLUMNS =
  'reminder_id,event_id,minutes_before_start,trigger_at,is_delivered';

export const toReminder = (r: ReminderRow): Reminder =>
  new Reminder(
    r.reminder_id,
    r.event_id,
    r.minutes_before_start,
    new Date(r.trigger_at),
    r.is_delivered,
  );
