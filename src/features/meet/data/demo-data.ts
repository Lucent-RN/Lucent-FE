import {
  CalendarEvent,
  CalendarSource,
  ConnectedAccount,
  SchedulingPreference,
  type AvailabilityStatus
} from '../core/domain';

/** Sample workspace shown in demo mode (no sign-in): 3 accounts across Google + Apple, a few clashes. */
export function buildDemoData(now = new Date()) {
  const day = (offset: number, h: number, m = 0) => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + offset,
      h,
      m,
      0,
      0
    );
    return d;
  };
  const accounts = [
    new ConnectedAccount(
      'acc-work',
      'GOOGLE',
      'you@company.com',
      'OK',
      now,
      null
    ),
    new ConnectedAccount('acc-me', 'GOOGLE', 'you@gmail.com', 'OK', now, null),
    new ConnectedAccount('acc-ios', 'APPLE', 'iCloud', 'OK', now, null)
  ];
  const sources = [
    new CalendarSource(
      'cal-work',
      'acc-work',
      'GOOGLE',
      'w',
      'Work',
      '#4285F4',
      true,
      false
    ),
    new CalendarSource(
      'cal-team',
      'acc-work',
      'GOOGLE',
      't',
      'Team',
      '#10B981',
      true,
      false
    ),
    new CalendarSource(
      'cal-me',
      'acc-me',
      'GOOGLE',
      'm',
      'Personal',
      '#F59E0B',
      true,
      false
    ),
    new CalendarSource(
      'cal-ios',
      'acc-ios',
      'APPLE',
      'i',
      'Home',
      '#A855F7',
      true,
      false
    )
  ];

  let n = 0;
  const ev = (
    calendarId: string,
    title: string,
    s: Date,
    e: Date,
    extra: Partial<{
      location: string;
      allDay: boolean;
      status: AvailabilityStatus;
    }> = {}
  ) =>
    new CalendarEvent({
      eventId: `demo-${++n}`,
      calendarId,
      externalEventId: `demo-${n}`,
      title,
      location: extra.location ?? null,
      startTime: s,
      endTime: e,
      isAllDay: extra.allDay ?? false,
      status: extra.status ?? 'BUSY',
      lifecycleState: 'SYNCED'
    });

  const events = [
    ev('cal-work', 'Daily stand-up', day(0, 9, 30), day(0, 9, 45), {
      location: 'Meet'
    }),
    ev('cal-work', 'Design review', day(0, 10, 0), day(0, 11, 0), {
      location: 'Room 4'
    }),
    ev('cal-team', 'Sprint planning', day(0, 10, 30), day(0, 11, 30)),
    ev('cal-me', 'Lunch with Linh', day(0, 12, 0), day(0, 13, 0), {
      location: 'Pho 24'
    }),
    ev('cal-work', '1:1 with manager', day(0, 14, 0), day(0, 14, 30)),
    ev('cal-ios', 'Gym', day(0, 18, 30), day(0, 19, 30)),
    ev('cal-work', 'Roadmap sync', day(1, 9, 0), day(1, 10, 0)),
    ev('cal-team', 'Retro', day(1, 15, 0), day(1, 16, 0)),
    ev('cal-me', 'Dentist', day(1, 17, 0), day(1, 17, 45), {
      location: 'Smile Clinic'
    }),
    ev('cal-work', 'Customer call', day(2, 10, 0), day(2, 11, 0)),
    ev('cal-ios', 'Family dinner', day(2, 19, 0), day(2, 21, 0)),
    ev('cal-work', 'Quarterly planning', day(3, 9, 0), day(3, 12, 0)),
    ev('cal-team', 'Hiring sync', day(3, 11, 0), day(3, 11, 30)),
    ev('cal-me', 'Weekend trip', day(4, 0, 0), day(6, 0, 0), { allDay: true }),
    ev('cal-work', 'Demo day prep', day(5, 14, 0), day(5, 16, 0)),
    ev('cal-work', 'Architecture review', day(7, 10, 0), day(7, 11, 30)),
    ev('cal-ios', 'Piano lesson', day(7, 18, 0), day(7, 19, 0)),
    ev('cal-team', 'All-hands', day(8, 16, 0), day(8, 17, 0)),
    ev('cal-me', 'Birthday: Minh', day(9, 0, 0), day(10, 0, 0), {
      allDay: true
    }),
    ev('cal-work', 'Offsite', day(10, 9, 0), day(10, 17, 0)),
    ev('cal-work', 'Planning poker', day(-1, 11, 0), day(-1, 12, 0)),
    ev('cal-me', 'Yoga', day(-2, 7, 0), day(-2, 8, 0))
  ];

  const preference = new SchedulingPreference({
    preferenceId: 'demo-pref',
    workingDays: [1, 2, 3, 4, 5],
    workStartTime: '09:00',
    workEndTime: '18:00',
    bufferMinutesAfterMeeting: 10,
    defaultReminderMinutes: 10
  });

  return {
    user: {
      id: 'demo',
      fullName: 'Demo User',
      email: 'demo@lucent.app',
      timeZone: 'UTC'
    },
    accounts,
    sources,
    events,
    preference
  };
}
