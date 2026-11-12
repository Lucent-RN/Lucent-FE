// @generated from LucentMeet/src/features/calendar/domain/models/user.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { CalendarSource } from './calendar-source';
import type { SchedulingPreference } from './scheduling-preference';

export class User {
  constructor(
    readonly userId: string,
    readonly fullName: string,
    readonly email: string,
    readonly currentTimezone: string,
    readonly preference: SchedulingPreference,
    readonly calendars: CalendarSource[] = [],
  ) {}

  updateTimezone(newZone: string): User {
    return new User(
      this.userId,
      this.fullName,
      this.email,
      newZone,
      this.preference,
      this.calendars,
    );
  }

  getActiveCalendars(): CalendarSource[] {
    return this.calendars.filter(c => c.isVisible);
  }
}
