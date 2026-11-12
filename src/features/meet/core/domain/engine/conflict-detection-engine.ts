// @generated from LucentMeet/src/features/calendar/domain/engine/conflict-detection-engine.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { CalendarEvent, User } from '../models';
import type { IScheduleObserver } from '../ports/schedule-observer';
import type {
  ISchedulingRuleStrategy,
  DetectedConflict,
  RuleContext,
} from './rule-strategy';
import {
  BufferTimeViolationStrategy,
  DirectOverlapStrategy,
  WorkingHoursGuardStrategy,
} from './strategies';

/**
 * Client-side ConflictDetectionEngine. The database is authoritative (it
 * persists conflicts and drives CONFLICTED state); this engine mirrors the same
 * rules so the UI can
 *   - preview a draft event *before* it is saved,
 *   - keep showing conflict badges for cached events while offline.
 */
export class ConflictDetectionEngine implements IScheduleObserver {
  private lastResult: DetectedConflict[] = [];

  constructor(
    private readonly strategies: ISchedulingRuleStrategy[] = [
      new DirectOverlapStrategy(),
      new BufferTimeViolationStrategy(),
      new WorkingHoursGuardStrategy(),
    ],
  ) {}

  detectAllConflicts(
    events: CalendarEvent[],
    ctx: RuleContext,
  ): DetectedConflict[] {
    const seen = new Set<string>();
    const out: DetectedConflict[] = [];
    for (const strategy of this.strategies) {
      for (const c of strategy.validate(events, ctx)) {
        if (!seen.has(c.signature)) {
          seen.add(c.signature);
          out.push(c);
        }
      }
    }
    return out;
  }

  /** What would adding `draft` to `existing` cause? Only conflicts involving the draft. */
  previewFor(
    draft: CalendarEvent,
    existing: CalendarEvent[],
    ctx: RuleContext,
  ): DetectedConflict[] {
    const others = existing.filter(e => e.eventId !== draft.eventId);
    return this.detectAllConflicts([...others, draft], ctx).filter(c =>
      c.eventIds.includes(draft.eventId),
    );
  }

  onScheduleChanged(user: User, events: CalendarEvent[]): void {
    this.lastResult = this.detectAllConflicts(events, {
      preference: user.preference,
      timeZone: user.currentTimezone,
    });
  }

  get latest(): DetectedConflict[] {
    return this.lastResult;
  }
}
