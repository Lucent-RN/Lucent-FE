// @generated from LucentMeet/src/features/calendar/domain/ports/calendar-provider-adapter.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { ProviderType } from '../models';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface NewEventInput {
  calendarId: string;
  /** Provider-side calendar id; required by on-device providers (EventKit). */
  externalCalendarId?: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  status?: 'BUSY' | 'FREE' | 'TENTATIVE';
}

export interface SyncSummary {
  provider: ProviderType;
  calendars: number;
  upserted: number;
  cancelled: number;
}

export interface PushResult {
  eventId: string;
  /** Conflicts the backend detected for the saved event (may be empty). */
  conflictTypes: string[];
}

export type AuthOutcome =
  | { status: 'granted'; accountEmail: string }
  | { status: 'denied' }
  | { status: 'cancelled' };

/**
 * ICalendarProviderAdapter on the device side.
 * Low Coupling: ScheduleSyncController only knows this interface.
 *  - GoogleCalendarAdapter delegates to Supabase Edge Functions (tokens never reach the app).
 *  - AppleCalendarAdapter bridges EventKit and uploads a normalised snapshot.
 */
export interface ICalendarProviderAdapter {
  readonly provider: ProviderType;
  authenticate(): Promise<AuthOutcome>;
  fetchEvents(range: DateRange): Promise<SyncSummary>;
  pushEvent(input: NewEventInput): Promise<PushResult>;
  updateEvent(
    eventId: string,
    patch: Partial<NewEventInput>,
  ): Promise<PushResult>;
  deleteEvent(eventId: string): Promise<void>;
  revokeAccess(accountId: string): Promise<boolean>;
}
