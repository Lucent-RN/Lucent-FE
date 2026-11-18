// @generated from LucentMeet/src/features/calendar/domain/planning/reschedule.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { MS_DAY, MS_MINUTE } from '../../utils/time';
import type { CalendarEvent } from '../models/calendar-event';
import type { SchedulingPreference } from '../models/scheduling-preference';
import { type FocusBlock, overlapsFocusBlock } from './focus-blocks';

const STEP = 15 * MS_MINUTE;
const MIN_SPACING = 60 * MS_MINUTE;

export interface RescheduleOptions {
  event: CalendarEvent;
  /** Every event that can block the new slot (the moved event itself is ignored). */
  events: CalendarEvent[];
  preference: SchedulingPreference;
  timeZone: string;
  now?: Date;
  focusBlock?: FocusBlock | null;
  limit?: number;
  searchDays?: number;
}

export interface RescheduleSlot {
  start: Date;
  end: Date;
}

/**
 * "Where could this event go instead?" Same duration, no overlap, respects the buffer, working hours
 * and focus time. Closest to the original start first. Suggestions only; the user confirms.
 */
export function suggestRescheduleSlots(o: RescheduleOptions): RescheduleSlot[] {
  const { event, events, preference, timeZone, focusBlock } = o;
  const now = o.now ?? new Date();
  const limit = o.limit ?? 3;
  const duration = event.endTime.getTime() - event.startTime.getTime();
  const buffer = Math.max(0, preference.bufferMinutesAfterMeeting) * MS_MINUTE;
  const origin = event.startTime.getTime();

  const busy = events.filter(
    e => e.eventId !== event.eventId && e.status !== 'FREE' && !e.isAllDay && e.lifecycleState !== 'CANCELLED',
  );
  const earliest = Math.ceil((now.getTime() + 30 * MS_MINUTE) / STEP) * STEP;
  const latest = Math.max(earliest, origin) + (o.searchDays ?? 7) * MS_DAY;
  // Look both sides of the original time, but never in the past.
  const from = Math.max(earliest, Math.floor((origin - (o.searchDays ?? 7) * MS_DAY) / STEP) * STEP);

  const candidates: RescheduleSlot[] = [];
  for (let t = from; t + duration <= latest && candidates.length < 400; t += STEP) {
    const start = new Date(t);
    const end = new Date(t + duration);
    if (t === Math.floor(origin / STEP) * STEP && t === origin) continue; // not the same slot
    const clash = busy.some(
      e => e.startTime.getTime() - buffer < end.getTime() && e.endTime.getTime() + buffer > t,
    );
    if (clash) continue;
    if (!preference.isWithinWorkingHours(start, end, timeZone)) continue;
    if (overlapsFocusBlock(start, end, focusBlock, timeZone)) continue;
    candidates.push({ start, end });
  }

  candidates.sort((a, b) => Math.abs(a.start.getTime() - origin) - Math.abs(b.start.getTime() - origin));
  const picked: RescheduleSlot[] = [];
  for (const c of candidates) {
    if (picked.length >= limit) break;
    if (picked.every(p => Math.abs(p.start.getTime() - c.start.getTime()) >= MIN_SPACING)) picked.push(c);
  }
  return picked.sort((a, b) => a.start.getTime() - b.start.getTime());
}
