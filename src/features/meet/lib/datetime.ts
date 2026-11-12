const pad = (n: number) => String(n).padStart(2, '0');

/** `<input type="datetime-local">` / `type="date"` value for a Date, in the browser's zone. */
export function toInputValue(d: Date, dateOnly = false): string {
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return dateOnly
    ? date
    : `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Inverse of toInputValue; returns null for an empty/invalid value. */
export function fromInputValue(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v.length === 10 ? `${v}T00:00` : v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const timeLabel = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const rangeLabel = (
  s: Date,
  e: Date,
  allDay: boolean,
  allDayText: string
) => (allDay ? allDayText : `${timeLabel(s)} – ${timeLabel(e)}`);

export const dayLabel = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

export const FALLBACK_COLOR = '#06B6D4';

/** Translucent tint of a calendar colour (hex #RRGGBB) for event backgrounds. */
export const tint = (hex: string, alpha = 0.16) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
