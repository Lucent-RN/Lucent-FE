// @generated from LucentMeet/src/features/calendar/domain/models/scheduling-preference.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { hhmmToMinutes, zonedParts } from '../../utils/time';

export interface SchedulingPreferenceProps {
  preferenceId: string;
  /** ISO weekdays, 1 = Monday … 7 = Sunday */
  workingDays: number[];
  workStartTime: string; // 'HH:MM[:SS]'
  workEndTime: string;
  bufferMinutesAfterMeeting: number;
  defaultReminderMinutes: number;
}

export class SchedulingPreference {
  readonly preferenceId: string;
  readonly workingDays: number[];
  readonly workStartTime: string;
  readonly workEndTime: string;
  readonly bufferMinutesAfterMeeting: number;
  readonly defaultReminderMinutes: number;

  constructor(p: SchedulingPreferenceProps) {
    this.preferenceId = p.preferenceId;
    this.workingDays = p.workingDays;
    this.workStartTime = p.workStartTime;
    this.workEndTime = p.workEndTime;
    this.bufferMinutesAfterMeeting = p.bufferMinutesAfterMeeting;
    this.defaultReminderMinutes = p.defaultReminderMinutes;
  }

  static defaults(): SchedulingPreference {
    return new SchedulingPreference({
      preferenceId: 'default',
      workingDays: [1, 2, 3, 4, 5],
      workStartTime: '09:00',
      workEndTime: '18:00',
      bufferMinutesAfterMeeting: 0,
      defaultReminderMinutes: 10,
    });
  }

  /** Same evaluation as the SQL WorkingHoursGuard: in the user's timezone. */
  isWithinWorkingHours(start: Date, end: Date, timeZone: string): boolean {
    const s = zonedParts(start, timeZone);
    const e = zonedParts(end, timeZone);
    if (!this.workingDays.includes(s.isoWeekday)) return false;
    if (s.year !== e.year || s.month !== e.month || s.day !== e.day)
      return false;
    const from = hhmmToMinutes(this.workStartTime);
    const to = hhmmToMinutes(this.workEndTime);
    const sm = s.hour * 60 + s.minute;
    const em = e.hour * 60 + e.minute;
    return sm >= from && sm <= to && em <= to;
  }
}
