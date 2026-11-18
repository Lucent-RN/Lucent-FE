/** Data model of the web edition of Lucent. Mirrors the mobile app's tables (todos, sessions, tags, interruptions). */
export type TimerMode = 'focus' | 'break';
export type SoundId = 'ting' | 'harp' | 'chord' | 'chime';

export interface Tag {
  id: number;
  name: string;
  color: string;
}
export interface Priority {
  id: number;
  name: string;
  level: number;
  color: string;
}

export interface Todo {
  id: number;
  title: string;
  note: string;
  /** Seconds. null → use the default from settings. */
  duration: number | null;
  totalSessions: number;
  completedSessions: number;
  priorityId: number;
  tagId: number | null;
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: number;
  name: string;
  /** Seconds actually planned for this phase. */
  duration: number;
  status: TimerMode;
  isCompleted: boolean;
  tagId: number | null;
  todoId: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Interruption {
  id: number;
  sessionId: number;
  type: 'pause' | 'reset' | 'skip';
  createdAt: number;
}

export interface Settings {
  focusDuration: number; // seconds
  shortBreakDuration: number;
  longBreakDuration: number;
  useLongBreak: boolean;
  /** A long break replaces the short one after this many focus sessions. */
  pomodoroSessions: number;
  startBreakAutomatically: boolean;
  startFocusAutomatically: boolean;
  notifications: boolean;
  volume: number; // 0..1
  completeFocusSound: SoundId;
  completeBreakSound: SoundId;
}

export interface TimerState {
  mode: TimerMode;
  /** Completed focus sessions in the current cycle. */
  currentSession: number;
  /** Seconds left while paused. */
  remaining: number;
  /** Planned length of the phase in seconds (progress = remaining / total). */
  total: number;
  /** Epoch ms when the running phase ends; null when paused. */
  endAt: number | null;
  /** Session row for the phase in progress (created on first start). */
  sessionId: number | null;
  selectedTodoId: number | null;
}

export interface LucentData {
  version: 1;
  todos: Todo[];
  sessions: Session[];
  interruptions: Interruption[];
  settings: Settings;
  timer: TimerState;
  nextId: number;
}
