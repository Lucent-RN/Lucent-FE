// @generated from LucentMeet/src/features/calendar/presentation/components/layout-day-events.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { MS_DAY } from '../utils/time';
import type { CalendarEvent } from '../domain';

export interface PositionedEvent {
  event: CalendarEvent;
  /** minutes from 00:00 of `day` */
  topMin: number;
  heightMin: number;
  column: number;
  columns: number;
}

/**
 * Lays out the timed events of one day side by side: overlapping events share
 * the width in columns (classic calendar column packing).
 */
export function layoutDayEvents(
  events: CalendarEvent[],
  day: Date,
  minHeightMin = 20,
): PositionedEvent[] {
  const dayStart = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
  ).getTime();
  const dayEnd = dayStart + MS_DAY;

  const clipped = events
    .filter(
      e =>
        !e.isAllDay &&
        e.startTime.getTime() < dayEnd &&
        e.endTime.getTime() > dayStart,
    )
    .map(e => {
      const s = Math.max(e.startTime.getTime(), dayStart);
      const en = Math.min(e.endTime.getTime(), dayEnd);
      return { event: e, s, e: en };
    })
    .sort((a, b) => a.s - b.s || b.e - a.e);

  const out: PositionedEvent[] = [];
  let cluster: Array<{ item: (typeof clipped)[number]; column: number }> = [];
  let columnEnds: number[] = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    for (const { item, column } of cluster) {
      out.push({
        event: item.event,
        topMin: (item.s - dayStart) / 60_000,
        heightMin: Math.max((item.e - item.s) / 60_000, minHeightMin),
        column,
        columns: columnEnds.length,
      });
    }
    cluster = [];
    columnEnds = [];
    clusterEnd = -Infinity;
  };

  for (const item of clipped) {
    if (item.s >= clusterEnd) flush();
    let col = columnEnds.findIndex(end => end <= item.s);
    if (col === -1) {
      col = columnEnds.length;
      columnEnds.push(item.e);
    } else {
      columnEnds[col] = item.e;
    }
    cluster.push({ item, column: col });
    clusterEnd = Math.max(clusterEnd, item.e);
  }
  flush();
  return out;
}
