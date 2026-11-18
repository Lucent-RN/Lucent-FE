// @generated from LucentMeet/src/features/calendar/domain/planning/focus-blocks.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { hhmmToMinutes, zonedParts } from '../../utils/time';

/** A daily protected window ("deep work") applied on `days` (ISO weekdays, 1 = Monday). */
export interface FocusBlock {
  enabled: boolean;
  days: number[];
  start: string; // 'HH:MM'
  end: string; // 'HH:MM'
}

export const DEFAULT_FOCUS_BLOCK: FocusBlock = {
  enabled: false,
  days: [1, 2, 3, 4, 5],
  start: '09:00',
  end: '11:00',
};

/** True when [start, end) touches the focus window on the (zoned) day the interval starts. */
export function overlapsFocusBlock(
  start: Date,
  end: Date,
  block: FocusBlock | null | undefined,
  timeZone: string,
): boolean {
  if (!block?.enabled) return false;
  const s = zonedParts(start, timeZone);
  const e = zonedParts(end, timeZone);
  const sameDay = s.year === e.year && s.month === e.month && s.day === e.day;
  const from = hhmmToMinutes(block.start);
  const to = hhmmToMinutes(block.end);
  const sm = s.hour * 60 + s.minute;
  // An interval that runs past midnight reaches the end of its first day.
  const em = sameDay ? e.hour * 60 + e.minute : 24 * 60;
  return block.days.includes(s.isoWeekday) && sm < to && em > from;
}
