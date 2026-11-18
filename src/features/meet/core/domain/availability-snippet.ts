// @generated from LucentMeet/src/features/calendar/domain/availability-snippet.ts — DO NOT EDIT. Run `yarn meet:sync`.
import {
  addDays,
  dayKey,
  MS_MINUTE,
  startOfDay,
  startOfWeek,
  zonedParts,
} from '../utils/time';
import type { CalendarEvent } from './models/calendar-event';
import type { SchedulingPreference } from './models/scheduling-preference';

export type SnippetDuration = 15 | 30 | 45 | 60;
export type SnippetRange = 'next3Days' | 'thisWeek' | 'nextWeek';
export type SnippetTone = 'professional' | 'casual';

export const SNIPPET_DURATIONS: SnippetDuration[] = [15, 30, 45, 60];
export const SNIPPET_RANGES: SnippetRange[] = [
  'next3Days',
  'thisWeek',
  'nextWeek',
];
export const SNIPPET_TONES: SnippetTone[] = ['professional', 'casual'];

export interface AvailableSlot {
  id: string;
  start: Date;
  end: Date;
}

export interface DiscoverSlotsOptions {
  events: CalendarEvent[];
  preference: SchedulingPreference;
  timeZone: string;
  now?: Date;
  durationMinutes: SnippetDuration;
  range: SnippetRange;
  maxSlots?: number;
  maxPerDay?: number;
  minNoticeMinutes?: number;
}

export interface FormatSnippetOptions {
  slots: AvailableSlot[];
  durationMinutes: SnippetDuration;
  tone: SnippetTone;
  language?: string;
  timeZone?: string;
}

const STEP_MS = 15 * MS_MINUTE;
const MIN_GAP_SAME_DAY_MS = 60 * MS_MINUTE;

export function computeRangeWindow(
  range: SnippetRange,
  now: Date,
): { from: Date; to: Date } {
  const todayStart = startOfDay(now);

  if (range === 'next3Days') {
    return {
      from: now,
      to: addDays(todayStart, 4),
    };
  }

  const currentWeekMonday = startOfWeek(now, true);

  if (range === 'thisWeek') {
    const endOfThisWeek = addDays(currentWeekMonday, 7);
    // If near the end of the week (< 24h left), look ahead 5 days so user always gets options
    if (endOfThisWeek.getTime() - now.getTime() < 24 * 60 * MS_MINUTE) {
      return {
        from: now,
        to: addDays(todayStart, 5),
      };
    }
    return {
      from: now,
      to: endOfThisWeek,
    };
  }

  // nextWeek
  const nextWeekMonday = addDays(currentWeekMonday, 7);
  return {
    from: nextWeekMonday,
    to: addDays(nextWeekMonday, 7),
  };
}

/**
 * Scans the user's calendar events and working hours preference to find
 * conflict-free time slots distributed across days.
 */
export function discoverAvailableSlots(
  options: DiscoverSlotsOptions,
): AvailableSlot[] {
  const {
    events,
    preference,
    timeZone,
    now = new Date(),
    durationMinutes,
    range,
    maxSlots = 5,
    maxPerDay = 2,
    minNoticeMinutes = 30,
  } = options;

  const window = computeRangeWindow(range, now);
  const earliestStart = new Date(
    Math.max(window.from.getTime(), now.getTime() + minNoticeMinutes * MS_MINUTE),
  );
  const to = window.to;

  if (earliestStart >= to) {
    return [];
  }

  const durationMs = durationMinutes * MS_MINUTE;
  const bufferMs = Math.max(0, preference.bufferMinutesAfterMeeting) * MS_MINUTE;

  const busyEvents = events
    .filter(e => e.status !== 'FREE' && !e.isAllDay)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const allCandidates: AvailableSlot[] = [];
  let cursor = Math.ceil(earliestStart.getTime() / STEP_MS) * STEP_MS;

  // Collect valid slots up to a reasonable cap
  const candidateCap = maxSlots * 8;
  while (cursor + durationMs <= to.getTime() && allCandidates.length < candidateCap) {
    const start = new Date(cursor);
    const end = new Date(cursor + durationMs);

    const clash = busyEvents.find(
      e =>
        e.startTime.getTime() - bufferMs < end.getTime() &&
        e.endTime.getTime() + bufferMs > cursor,
    );

    if (clash) {
      cursor = Math.max(
        cursor + STEP_MS,
        Math.ceil((clash.endTime.getTime() + bufferMs) / STEP_MS) * STEP_MS,
      );
    } else if (!preference.isWithinWorkingHours(start, end, timeZone)) {
      cursor += STEP_MS;
    } else {
      allCandidates.push({
        id: `${start.getTime()}-${end.getTime()}`,
        start,
        end,
      });
      // Advance by at least duration + buffer so candidates don't overlap each other
      cursor += Math.max(durationMs + bufferMs, STEP_MS);
    }
  }

  if (allCandidates.length === 0) {
    return [];
  }

  // First pass: pick up to `maxPerDay` well-spaced slots per day for natural variety
  const selected: AvailableSlot[] = [];
  const selectedIds = new Set<string>();
  const perDayPicked = new Map<string, AvailableSlot[]>();

  for (const slot of allCandidates) {
    if (selected.length >= maxSlots) break;
    const parts = zonedParts(slot.start, timeZone);
    const key = `${parts.year}-${parts.month}-${parts.day}`;
    const existingForDay = perDayPicked.get(key) ?? [];

    if (existingForDay.length >= maxPerDay) {
      continue;
    }

    const lastPicked = existingForDay[existingForDay.length - 1];
    if (
      lastPicked &&
      slot.start.getTime() - lastPicked.end.getTime() < MIN_GAP_SAME_DAY_MS
    ) {
      continue;
    }

    existingForDay.push(slot);
    perDayPicked.set(key, existingForDay);
    selected.push(slot);
    selectedIds.add(slot.id);
  }

  // Second pass: if we still need more slots to reach `maxSlots`, fill from remaining candidates
  if (selected.length < maxSlots) {
    for (const slot of allCandidates) {
      if (selected.length >= maxSlots) break;
      if (!selectedIds.has(slot.id)) {
        selected.push(slot);
        selectedIds.add(slot.id);
      }
    }
  }

  return selected.sort((a, b) => a.start.getTime() - b.start.getTime());
}

const VI_WEEKDAYS: Record<number, string> = {
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
  7: 'Chủ Nhật',
};

const EN_WEEKDAYS: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

const EN_MONTHS: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatSlotLine(
  slot: AvailableSlot,
  language: string,
  timeZone: string,
): string {
  const s = zonedParts(slot.start, timeZone);
  const e = zonedParts(slot.end, timeZone);
  const timeRange = `${pad2(s.hour)}:${pad2(s.minute)} – ${pad2(e.hour)}:${pad2(e.minute)}`;

  const isVi = language.toLowerCase().startsWith('vi');
  if (isVi) {
    const weekday = VI_WEEKDAYS[s.isoWeekday] ?? '';
    return `• ${weekday} (${pad2(s.day)}/${pad2(s.month)}): ${timeRange}`;
  }

  const weekday = EN_WEEKDAYS[s.isoWeekday] ?? '';
  const month = EN_MONTHS[s.month] ?? '';
  return `• ${weekday}, ${month} ${s.day}: ${timeRange}`;
}

/**
 * Generates a ready-to-send availability message in the user's chosen tone and language.
 */
export function formatAvailabilitySnippet(
  options: FormatSnippetOptions,
): string {
  const {
    slots,
    durationMinutes,
    tone,
    language = 'en',
    timeZone = 'UTC',
  } = options;

  const isVi = language.toLowerCase().startsWith('vi');

  if (slots.length === 0) {
    return isVi
      ? 'Hiện tại mình chưa tìm thấy khung giờ trống phù hợp trong khoảng thời gian này.'
      : 'No available time slots found in the selected time range.';
  }

  const lines = slots.map(s => formatSlotLine(s, language, timeZone)).join('\n');

  if (isVi) {
    if (tone === 'professional') {
      return [
        `Chào anh/chị, mình vừa kiểm tra lịch và có thể sắp xếp cuộc hẹn (${durationMinutes} phút) vào các khung giờ sau:`,
        '',
        lines,
        '',
        'Anh/chị xem khung giờ nào thuận tiện nhất thì phản hồi giúp mình nhé!',
      ].join('\n');
    }
    return [
      `Chào bạn, mình vừa check lịch thì có thể gặp bạn (${durationMinutes} phút) vào các khung giờ sau nhé:`,
      '',
      lines,
      '',
      'Khung giờ nào tiện cho bạn nhất thì báo mình nha!',
    ].join('\n');
  }

  if (tone === 'professional') {
    return [
      `Hi, I checked my schedule and I'm available for a ${durationMinutes}-minute meeting at the following times:`,
      '',
      lines,
      '',
      'Please let me know which time works best for you!',
    ].join('\n');
  }

  return [
    `Hey! Here are a few times I'm free for a ${durationMinutes}-min catch-up:`,
    '',
    lines,
    '',
    'Let me know which slot works best for you!',
  ].join('\n');
}

export { dayKey };

