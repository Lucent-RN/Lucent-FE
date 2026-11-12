import type { CalendarEvent, CalendarSource } from '../../core/domain';

export interface ViewProps {
  events: CalendarEvent[];
  sourceOf: (e: CalendarEvent) => CalendarSource | undefined;
  /** Events involved in a blocking conflict. */
  conflictedIds: Set<string>;
  onEventClick: (e: CalendarEvent) => void;
}
