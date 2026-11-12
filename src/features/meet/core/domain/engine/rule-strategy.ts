// @generated from LucentMeet/src/features/calendar/domain/engine/rule-strategy.ts — DO NOT EDIT. Run `yarn meet:sync`.
import type {
  CalendarEvent,
  ConflictType,
  SchedulingPreference,
} from '../models';

export interface DetectedConflict {
  type: ConflictType;
  /** First entry is the primary event. */
  eventIds: string[];
  /** Stable identity, same scheme as the SQL `signature`. */
  signature: string;
}

export interface RuleContext {
  preference: SchedulingPreference;
  timeZone: string;
}

/** ISchedulingRuleStrategy — Polymorphism instead of an if/else ladder. */
export interface ISchedulingRuleStrategy {
  validate(events: CalendarEvent[], ctx: RuleContext): DetectedConflict[];
}

export const signatureOf = (type: ConflictType, ids: string[]): string =>
  `${type}:${[...ids].sort().join(',')}`;
