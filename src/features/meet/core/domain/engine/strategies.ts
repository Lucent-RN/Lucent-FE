// @generated from LucentMeet/src/features/calendar/domain/engine/strategies.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { MS_MINUTE } from '../../utils/time';
import type { CalendarEvent } from '../models';
import {
  signatureOf,
  type DetectedConflict,
  type ISchedulingRuleStrategy,
  type RuleContext,
} from './rule-strategy';

const byStart = (a: CalendarEvent, b: CalendarEvent) =>
  a.startTime.getTime() - b.startTime.getTime() ||
  a.eventId.localeCompare(b.eventId);

/** Rule 2. All-day events only count when explicitly BUSY (status already carries that). */
export class DirectOverlapStrategy implements ISchedulingRuleStrategy {
  validate(events: CalendarEvent[]): DetectedConflict[] {
    const busy = events.filter(e => e.isBlocking).sort(byStart);
    const out: DetectedConflict[] = [];
    for (let i = 0; i < busy.length; i++) {
      for (let j = i + 1; j < busy.length; j++) {
        // sorted by start: once busy[j] starts at/after busy[i] ends, no later one can overlap it
        if (busy[j].startTime.getTime() >= busy[i].endTime.getTime()) break;
        if (busy[i].isOverlapping(busy[j])) {
          const ids = [busy[i].eventId, busy[j].eventId];
          out.push({
            type: 'DIRECT_OVERLAP',
            eventIds: ids,
            signature: signatureOf('DIRECT_OVERLAP', ids),
          });
        }
      }
    }
    return out;
  }
}

/** Rule 3: 0 <= next.start - this.end < B. */
export class BufferTimeViolationStrategy implements ISchedulingRuleStrategy {
  validate(
    events: CalendarEvent[],
    { preference }: RuleContext,
  ): DetectedConflict[] {
    const buffer = preference.bufferMinutesAfterMeeting;
    if (buffer <= 0) return [];
    const timed = events.filter(e => e.isBlocking && !e.isAllDay).sort(byStart);
    const out: DetectedConflict[] = [];
    for (const e1 of timed) {
      const next = timed.find(
        x =>
          x.eventId !== e1.eventId &&
          x.startTime.getTime() >= e1.endTime.getTime(),
      );
      if (!next) continue;
      const gap = next.startTime.getTime() - e1.endTime.getTime();
      if (gap >= 0 && gap < buffer * MS_MINUTE) {
        const ids = [e1.eventId, next.eventId];
        out.push({
          type: 'BUFFER_VIOLATION',
          eventIds: ids,
          signature: signatureOf('BUFFER_VIOLATION', ids),
        });
      }
    }
    return out;
  }
}

/** Tags timed events that fall outside the user's working window. */
export class WorkingHoursGuardStrategy implements ISchedulingRuleStrategy {
  validate(
    events: CalendarEvent[],
    { preference, timeZone }: RuleContext,
  ): DetectedConflict[] {
    return events
      .filter(e => e.isLive && !e.isAllDay)
      .filter(
        e => !preference.isWithinWorkingHours(e.startTime, e.endTime, timeZone),
      )
      .map(e => ({
        type: 'OUTSIDE_WORKING_HOURS' as const,
        eventIds: [e.eventId],
        signature: signatureOf('OUTSIDE_WORKING_HOURS', [e.eventId]),
      }));
  }
}
