// @generated from LucentMeet/src/shared/utils/time.ts — DO NOT EDIT. Run `yarn meet:sync`.
/** Small, dependency-free date helpers. All timezone maths goes through Intl. */

export const MS_MINUTE = 60_000;
export const MS_DAY = 86_400_000;

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  isoWeekday: number;
}

const WEEKDAYS: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

/** Wall-clock components of `date` as seen in `timeZone`. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = formatterFor(timeZone).formatToParts(date);
  } catch {
    parts = formatterFor('UTC').formatToParts(date);
  }
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '0';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')) % 24,
    minute: Number(get('minute')),
    isoWeekday: WEEKDAYS[get('weekday')] ?? 1,
  };
}

export const startOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number): Date =>
  new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + n,
    d.getHours(),
    d.getMinutes(),
  );

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const startOfWeek = (d: Date, startOnMonday = true): Date => {
  const day = d.getDay();
  const diff = startOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  return startOfDay(addDays(d, diff));
};

export const startOfMonth = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Rounds to the nearest `step` minutes (default 15). */
export function roundToStep(d: Date, step = 15): Date {
  const ms = step * MS_MINUTE;
  return new Date(Math.round(d.getTime() / ms) * ms);
}

export const formatTime = (d: Date): string =>
  d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const formatDayHeader = (d: Date): string =>
  d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export const formatMonthTitle = (d: Date): string =>
  d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const minutesToHHMM = (mins: number): string => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** 'HH:MM' or 'HH:MM:SS' → minutes since midnight. */
export const hhmmToMinutes = (s: string): number => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + (m || 0);
};

export const deviceTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};
