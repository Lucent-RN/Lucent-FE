// @generated from LucentMeet/src/features/calendar/domain/models/schedule-conflict.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type { ConflictType } from './types';

export class ScheduleConflict {
  constructor(
    readonly conflictId: string,
    readonly type: ConflictType,
    /** First id is the PRIMARY event. */
    readonly eventIds: string[],
    readonly detectedAt: Date,
    readonly isResolved: boolean = false,
  ) {}

  markAsResolved(): ScheduleConflict {
    return new ScheduleConflict(
      this.conflictId,
      this.type,
      this.eventIds,
      this.detectedAt,
      true,
    );
  }

  involves(eventId: string): boolean {
    return this.eventIds.includes(eventId);
  }

  /** Working-hours is an informational label, not a blocking clash. */
  get isBlocking(): boolean {
    return this.type !== 'OUTSIDE_WORKING_HOURS';
  }
}
