// @generated from LucentMeet/src/features/calendar/domain/models/calendar-event.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { MS_MINUTE } from '../../utils/time';
import { Reminder } from './reminder';
import type { AvailabilityStatus, EventLifecycleState } from './types';

export class InvalidEventIntervalError extends Error {
  constructor() {
    super('Event end time must be after its start time');
    this.name = 'InvalidEventIntervalError';
  }
}

export interface CalendarEventProps {
  eventId: string;
  calendarId: string;
  externalEventId: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  status: AvailabilityStatus;
  lifecycleState: EventLifecycleState;
  conferenceUrl?: string | null;
}

/**
 * CalendarEvent — Information Expert for everything derivable from its own
 * interval. Invariant (Rule 1): endTime > startTime.
 */
export class CalendarEvent {
  readonly eventId: string;
  readonly calendarId: string;
  readonly externalEventId: string;
  readonly title: string;
  readonly description: string | null;
  readonly location: string | null;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly isAllDay: boolean;
  readonly status: AvailabilityStatus;
  readonly lifecycleState: EventLifecycleState;
  readonly conferenceUrl: string | null;

  constructor(p: CalendarEventProps) {
    if (!(p.endTime.getTime() > p.startTime.getTime())) {
      throw new InvalidEventIntervalError();
    }
    this.eventId = p.eventId;
    this.calendarId = p.calendarId;
    this.externalEventId = p.externalEventId;
    this.title = p.title;
    this.description = p.description ?? null;
    this.location = p.location ?? null;
    this.startTime = p.startTime;
    this.endTime = p.endTime;
    this.isAllDay = p.isAllDay;
    this.status = p.status;
    this.lifecycleState = p.lifecycleState;
    this.conferenceUrl = p.conferenceUrl ?? null;
  }

  /** Rule 2: max(start) < min(end). Touching intervals do not overlap. */
  isOverlapping(other: CalendarEvent): boolean {
    return (
      Math.max(this.startTime.getTime(), other.startTime.getTime()) <
      Math.min(this.endTime.getTime(), other.endTime.getTime())
    );
  }

  getDurationMinutes(): number {
    return Math.round(
      (this.endTime.getTime() - this.startTime.getTime()) / MS_MINUTE,
    );
  }

  addReminder(minutesBefore: number): Reminder {
    return new Reminder(
      `local-${this.eventId}-${minutesBefore}`,
      this.eventId,
      minutesBefore,
      Reminder.calculateTriggerTime(this.startTime, minutesBefore),
      false,
    );
  }

  /** Whether this event takes part in conflict detection at all. */
  get isBlocking(): boolean {
    return (
      this.status === 'BUSY' &&
      this.lifecycleState !== 'CANCELLED' &&
      this.lifecycleState !== 'DRAFT'
    );
  }

  get isLive(): boolean {
    return (
      this.lifecycleState !== 'CANCELLED' && this.lifecycleState !== 'DRAFT'
    );
  }

  with(patch: Partial<CalendarEventProps>): CalendarEvent {
    return new CalendarEvent({ ...this, ...patch });
  }
}
