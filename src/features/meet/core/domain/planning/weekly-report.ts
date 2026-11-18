// @generated from LucentMeet/src/features/calendar/domain/planning/weekly-report.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { addDays, dayKey, MS_MINUTE, startOfWeek } from '../../utils/time';
import type { CalendarEvent } from '../models/calendar-event';
import type { SchedulingPreference } from '../models/scheduling-preference';
import type { ScheduleConflict } from '../models/schedule-conflict';
import { hhmmToMinutes } from '../../utils/time';

/** A day counts as overloaded when meetings fill more than this share of the working day. */
export const OVERLOAD_RATIO = 0.75;

export interface DayLoad {
  date: Date;
  key: string;
  isWorkingDay: boolean;
  meetings: number;
  /** Union of meeting time (overlaps counted once), in minutes. */
  busyMinutes: number;
  /** Working-hours minutes still free. */
  freeMinutes: number;
  overloaded: boolean;
}

export interface WeeklyReport {
  weekStart: Date;
  days: DayLoad[];
  totalMeetings: number;
  totalBusyMinutes: number;
  totalFreeMinutes: number;
  busiestDay: DayLoad | null;
  overloadedDays: number;
  openConflicts: number;
  /** Longest uninterrupted free stretch inside working hours that week, in minutes. */
  longestFocusMinutes: number;
}

const merge = (iv: Array<[number, number]>) => {
  const s = [...iv].sort((a, b) => a[0] - b[0]);
  const out: Array<[number, number]> = [];
  for (const [a, b] of s) {
    const last = out[out.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
};

/** Week of `anchor` (Monday start), in the device's local calendar. */
export function buildWeeklyReport(opts: {
  events: CalendarEvent[];
  conflicts: ScheduleConflict[];
  preference: SchedulingPreference;
  anchor: Date;
}): WeeklyReport {
  const { events, conflicts, preference } = opts;
  const weekStart = startOfWeek(opts.anchor, true);
  const weekEnd = addDays(weekStart, 7);
  const workStart = hhmmToMinutes(preference.workStartTime);
  const workEnd = hhmmToMinutes(preference.workEndTime);

  const real = events.filter(e => e.status !== 'FREE' && !e.isAllDay && e.lifecycleState !== 'CANCELLED');
  const inWeek = new Set<string>();
  const days: DayLoad[] = [];
  let longest = 0;

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const next = addDays(date, 1);
    const isoDay = i + 1;
    const isWorkingDay = preference.workingDays.includes(isoDay);
    const dayEvents = real.filter(e => e.startTime < next && e.endTime > date);
    dayEvents.forEach(e => inWeek.add(e.eventId));

    const winStart = date.getTime() + workStart * MS_MINUTE;
    const winEnd = date.getTime() + workEnd * MS_MINUTE;
    const merged = merge(
      dayEvents
        .map(e => [Math.max(e.startTime.getTime(), winStart), Math.min(e.endTime.getTime(), winEnd)] as [number, number])
        .filter(([a, b]) => b > a),
    );
    const busy = merged.reduce((n, [a, b]) => n + (b - a), 0) / MS_MINUTE;
    const capacity = isWorkingDay ? Math.max(0, workEnd - workStart) : 0;
    const free = isWorkingDay ? Math.max(0, capacity - busy) : 0;

    if (isWorkingDay) {
      let cursor = winStart;
      for (const [a, b] of merged) {
        longest = Math.max(longest, (a - cursor) / MS_MINUTE);
        cursor = Math.max(cursor, b);
      }
      longest = Math.max(longest, (winEnd - cursor) / MS_MINUTE);
    }
    days.push({
      date,
      key: dayKey(date),
      isWorkingDay,
      meetings: dayEvents.length,
      busyMinutes: Math.round(busy),
      freeMinutes: Math.round(free),
      overloaded: isWorkingDay && capacity > 0 && busy / capacity > OVERLOAD_RATIO,
    });
  }

  const eventById = new Map(events.map(e => [e.eventId, e]));
  const openConflicts = conflicts.filter(
    c =>
      c.isBlocking &&
      !c.isResolved &&
      c.eventIds.some(id => {
        const e = eventById.get(id);
        return e && e.startTime < weekEnd && e.endTime > weekStart;
      }),
  ).length;

  const busiest = days.reduce<DayLoad | null>((m, d) => (d.busyMinutes > (m?.busyMinutes ?? 0) ? d : m), null);
  return {
    weekStart,
    days,
    totalMeetings: inWeek.size,
    totalBusyMinutes: days.reduce((n, d) => n + d.busyMinutes, 0),
    totalFreeMinutes: days.reduce((n, d) => n + d.freeMinutes, 0),
    busiestDay: busiest && busiest.busyMinutes > 0 ? busiest : null,
    overloadedDays: days.filter(d => d.overloaded).length,
    openConflicts,
    longestFocusMinutes: Math.round(longest),
  };
}
