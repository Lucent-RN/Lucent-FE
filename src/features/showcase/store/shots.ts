import type { ComponentType } from 'react';
import {
  FocusScreen,
  LockScreen,
  MeetAssistantScreen,
  MeetCalendarScreen,
  MeetConflictScreen,
  TimerScreen
} from '../screens';
import {
  LucentSettingsScreen,
  MeetReportScreen,
  MeetSlotsScreen,
  MeetSuggestScreen,
  StatsScreen,
  TasksScreen
} from './phone-screens';
import {
  AssistantTablet,
  CalendarTablet,
  ConflictTablet,
  FocusTablet,
  LucentSettingsTablet,
  ReportTablet,
  StatsTablet,
  TimerTablet
} from './tablet-screens';

export type StoreProduct = 'lucent' | 'meet';
export type StoreTheme = 'space' | 'light' | 'aurora';

export interface ShotSpec {
  key: string;
  title: string;
  text: string;
  theme: StoreTheme;
  /** true → the phone screen itself is dark (cosmic), so the frame is drawn dark. */
  darkScreen?: boolean;
  tilt?: boolean;
  Phone: ComponentType;
  Tablet: ComponentType;
  /** Floating callouts: [text, x%, y%] on the canvas. */
  chips?: Array<[string, number, number]>;
}

/** Store copy is English (the stores' default listing); localise by adding a locale map here. */
export const SHOTS: Record<StoreProduct, ShotSpec[]> = {
  lucent: [
    { key: 'orbit', title: 'Set the orbit', text: 'One planet, one task, one clear session.', theme: 'space', Phone: TimerScreen, Tablet: TimerTablet },
    { key: 'focus', title: 'Enter focus', text: 'A cosmic space that protects your attention.', theme: 'space', darkScreen: true, tilt: true, Phone: FocusScreen, Tablet: FocusTablet },
    { key: 'stats', title: 'See your progress', text: 'Your focus time, charted at a glance.', theme: 'aurora', Phone: StatsScreen, Tablet: StatsTablet },
    { key: 'tasks', title: 'Plan every task', text: 'Tag it, size it, tick it off.', theme: 'light', tilt: true, Phone: TasksScreen, Tablet: TimerTablet },
    { key: 'lock', title: 'Never lose track', text: 'Your session lives on the lock screen.', theme: 'space', darkScreen: true, Phone: LockScreen, Tablet: FocusTablet },
    { key: 'settings', title: 'Make it yours', text: 'Light, dark or system. Four languages.', theme: 'aurora', Phone: LucentSettingsScreen, Tablet: LucentSettingsTablet }
  ],
  meet: [
    { key: 'agenda', title: 'Today at a glance', text: 'Every calendar, colour-coded.', theme: 'light', Phone: MeetCalendarScreen, Tablet: CalendarTablet },
    { key: 'conflict', title: 'Conflicts, before you save', text: 'Overlaps, tight gaps and out-of-hours events are flagged.', theme: 'aurora', tilt: true, Phone: MeetConflictScreen, Tablet: ConflictTablet },
    { key: 'suggest', title: 'A better time, one tap', text: 'Suggested slots that dodge the clash.', theme: 'light', Phone: MeetSuggestScreen, Tablet: ConflictTablet },
    { key: 'slots', title: 'Share your free time', text: 'Ready-to-send availability in seconds.', theme: 'aurora', Phone: MeetSlotsScreen, Tablet: CalendarTablet },
    { key: 'report', title: 'Know your week', text: 'Meeting hours, busy days and free focus time.', theme: 'light', tilt: true, Phone: MeetReportScreen, Tablet: ReportTablet },
    { key: 'assistant', title: 'Ask, then confirm', text: 'Nothing changes until you say so.', theme: 'aurora', Phone: MeetAssistantScreen, Tablet: AssistantTablet }
  ]
};

export const storeShotCount = (p: StoreProduct) => SHOTS[p].length;

export type StoreDevice = 'iphone' | 'android' | 'ipad' | 'tablet';
export const DEVICES: Record<StoreDevice, { w: number; h: number; kind: 'phone' | 'tablet'; dir: string }> = {
  iphone: { w: 1290, h: 2796, kind: 'phone', dir: 'iphone-6.9' },
  android: { w: 1080, h: 1920, kind: 'phone', dir: 'phone' },
  ipad: { w: 2064, h: 2752, kind: 'tablet', dir: 'ipad-13' },
  tablet: { w: 1600, h: 2560, kind: 'tablet', dir: 'tablet-10' }
};
