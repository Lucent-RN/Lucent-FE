// @generated from LucentMeet/src/features/calendar/domain/ports/schedule-observer.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { CalendarEvent, User } from '../models';

/** Observer (OOP-Modeling.md §4.2.3). */
export interface IScheduleObserver {
  onScheduleChanged(user: User, events: CalendarEvent[]): void | Promise<void>;
}
