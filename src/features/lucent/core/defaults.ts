import type { LucentData, Priority, Settings, Tag } from './types';

export const MIN_FOCUS = 5 * 60;
export const MAX_FOCUS = 120 * 60;
export const MIN_BREAK = 1 * 60;
export const MAX_BREAK = 60 * 60;

export const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  useLongBreak: true,
  pomodoroSessions: 4,
  startBreakAutomatically: false,
  startFocusAutomatically: false,
  notifications: false,
  volume: 0.7,
  completeFocusSound: 'ting',
  completeBreakSound: 'ting'
};

// Same names and ordering as the mobile app's seeds.
export const PRIORITIES: Priority[] = [
  { id: 1, name: 'Low', level: 1, color: '#4CAF50' },
  { id: 2, name: 'Medium', level: 2, color: '#FF9800' },
  { id: 3, name: 'High', level: 3, color: '#F44336' }
];

export const TAGS: Tag[] = [
  { id: 1, name: 'Study', color: '#06B6D4' },
  { id: 2, name: 'Exercise', color: '#F97316' },
  { id: 3, name: 'Music', color: '#3B82F6' },
  { id: 4, name: 'Working', color: '#34D399' },
  { id: 5, name: 'Coding', color: '#EC4899' },
  { id: 6, name: 'Meditation', color: '#2DD4BF' },
  { id: 7, name: 'Reading', color: '#A855F7' },
  { id: 8, name: 'Health', color: '#EF4444' },
  { id: 9, name: 'Creative', color: '#EAB308' },
  { id: 10, name: 'Social', color: '#6366F1' }
];

export const emptyData = (): LucentData => ({
  version: 1,
  todos: [],
  sessions: [],
  interruptions: [],
  settings: { ...DEFAULT_SETTINGS },
  timer: {
    mode: 'focus',
    currentSession: 0,
    remaining: DEFAULT_SETTINGS.focusDuration,
    total: DEFAULT_SETTINGS.focusDuration,
    endAt: null,
    sessionId: null,
    selectedTodoId: null
  },
  nextId: 1
});
