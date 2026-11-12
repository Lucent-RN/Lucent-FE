// @generated from LucentMeet/src/features/calendar/domain/models/reminder.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { MS_MINUTE } from '../../utils/time';

export class Reminder {
  constructor(
    readonly reminderId: string,
    readonly eventId: string,
    readonly minutesBeforeStart: number,
    readonly triggerAt: Date,
    readonly isDelivered: boolean,
  ) {}

  /** Absolute instant — timezone independent, so it survives travel. */
  static calculateTriggerTime(eventStart: Date, minutesBefore: number): Date {
    return new Date(eventStart.getTime() - minutesBefore * MS_MINUTE);
  }

  isPending(now: Date = new Date()): boolean {
    return !this.isDelivered && this.triggerAt.getTime() > now.getTime();
  }
}
