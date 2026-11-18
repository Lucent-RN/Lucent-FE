import type { Interruption, Session } from './types';

export type FilterTime = 'week' | 'month' | 'year';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Monday-based week start. */
export const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

export interface Range {
  from: Date;
  to: Date; // exclusive
}

export function rangeFor(filter: FilterTime, anchor: Date): Range {
  if (filter === 'week') {
    const from = startOfWeek(anchor);
    return { from, to: addDays(from, 7) };
  }
  if (filter === 'month') {
    return {
      from: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
      to: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1)
    };
  }
  return { from: new Date(anchor.getFullYear(), 0, 1), to: new Date(anchor.getFullYear() + 1, 0, 1) };
}

/** Move the anchor one step (week / month / year) back or forward. */
export function shiftAnchor(filter: FilterTime, anchor: Date, dir: -1 | 1): Date {
  if (filter === 'week') return addDays(anchor, 7 * dir);
  if (filter === 'month') return new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1);
  return new Date(anchor.getFullYear() + dir, 0, 1);
}

export interface ChartPoint {
  key: string;
  label: string;
  /** Focus minutes (completed sessions only). */
  minutes: number;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function buildChart(sessions: Session[], filter: FilterTime, anchor: Date): ChartPoint[] {
  const { from, to } = rangeFor(filter, anchor);
  const done = sessions.filter(
    (s) => s.status === 'focus' && s.isCompleted && s.createdAt >= from.getTime() && s.createdAt < to.getTime()
  );
  if (filter === 'year') {
    const buckets = Array<number>(12).fill(0);
    for (const s of done) buckets[new Date(s.createdAt).getMonth()] += s.duration / 60;
    return buckets.map((m, i) => ({ key: String(i), label: MONTHS[i], minutes: Math.round(m) }));
  }
  const days = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  const byDay = new Map<string, number>();
  for (const s of done) byDay.set(dayKey(new Date(s.createdAt)), (byDay.get(dayKey(new Date(s.createdAt))) ?? 0) + s.duration / 60);
  return Array.from({ length: days }, (_, i) => {
    const d = addDays(from, i);
    return {
      key: dayKey(d),
      label: filter === 'week' ? WEEKDAYS[i] : String(d.getDate()),
      minutes: Math.round(byDay.get(dayKey(d)) ?? 0)
    };
  });
}

export interface Totals {
  focusStarted: number;
  focusCompleted: number;
  focusSeconds: number;
  breakStarted: number;
  breakCompleted: number;
  breakSeconds: number;
  interruptions: number;
}

export function totalsFor(sessions: Session[], interruptions: Interruption[], range: Range): Totals {
  const inRange = sessions.filter((s) => s.createdAt >= range.from.getTime() && s.createdAt < range.to.getTime());
  const ids = new Set(inRange.map((s) => s.id));
  const t: Totals = {
    focusStarted: 0,
    focusCompleted: 0,
    focusSeconds: 0,
    breakStarted: 0,
    breakCompleted: 0,
    breakSeconds: 0,
    interruptions: interruptions.filter((i) => ids.has(i.sessionId)).length
  };
  for (const s of inRange) {
    if (s.status === 'focus') {
      t.focusStarted++;
      if (s.isCompleted) {
        t.focusCompleted++;
        t.focusSeconds += s.duration;
      }
    } else {
      t.breakStarted++;
      if (s.isCompleted) {
        t.breakCompleted++;
        t.breakSeconds += s.duration;
      }
    }
  }
  return t;
}

export interface Streaks {
  current: number;
  longest: number;
  /** Days with at least one completed focus session. */
  activeDays: string[];
}

/** A day counts when at least one focus session was completed. The current streak survives until the end of today. */
export function computeStreaks(sessions: Session[], today: Date = new Date()): Streaks {
  const days = new Set<string>();
  for (const s of sessions) if (s.status === 'focus' && s.isCompleted) days.add(dayKey(new Date(s.createdAt)));
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of sorted) {
    const d = startOfDay(new Date(`${k}T00:00:00`));
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86_400_000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  let cursor = startOfDay(today);
  if (!days.has(dayKey(cursor))) cursor = addDays(cursor, -1); // today may not be done yet
  while (days.has(dayKey(cursor))) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, longest, activeDays: sorted };
}
