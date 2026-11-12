// @generated from LucentMeet/src/features/calendar/domain/models/calendar-source.ts — DO NOT EDIT. Run `yarn meet:sync`.
import { CalendarEvent, type CalendarEventProps } from './calendar-event';
import type { ProviderType } from './types';

export class CalendarSource {
  constructor(
    readonly calendarId: string,
    readonly accountId: string,
    readonly provider: ProviderType,
    readonly externalCalendarId: string,
    readonly calendarName: string,
    readonly colorHex: string,
    readonly isVisible: boolean,
    readonly isReadOnly: boolean,
  ) {}

  /** Creator: the source that owns events instantiates them. */
  createEvent(
    dto: Omit<CalendarEventProps, 'calendarId' | 'lifecycleState' | 'eventId'> &
      Partial<Pick<CalendarEventProps, 'eventId' | 'lifecycleState'>>,
  ): CalendarEvent {
    return new CalendarEvent({
      ...dto,
      eventId: dto.eventId ?? `draft-${Date.now()}`,
      calendarId: this.calendarId,
      lifecycleState: dto.lifecycleState ?? 'DRAFT',
    });
  }

  get isWritable(): boolean {
    return !this.isReadOnly;
  }
}
