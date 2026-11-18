import type { Settings, TimerMode, Todo } from './types';

/** Is the break that follows `completedFocus` focus sessions a long one? */
export const isLongBreak = (completedFocus: number, s: Settings) =>
  s.useLongBreak && completedFocus > 0 && completedFocus % s.pomodoroSessions === 0;

/** Length in seconds of a phase. A todo may override the focus length. */
export function phaseSeconds(
  mode: TimerMode,
  s: Settings,
  opts: { todo?: Todo | null; completedFocus?: number } = {}
): number {
  if (mode === 'focus') return opts.todo?.duration ?? s.focusDuration;
  return isLongBreak(opts.completedFocus ?? 0, s) ? s.longBreakDuration : s.shortBreakDuration;
}

/**
 * What follows the phase that just finished.
 *   focus → break (long every N focus sessions)   break → focus
 * `currentSession` counts completed focus sessions.
 */
export function nextPhase(
  finished: TimerMode,
  currentSession: number,
  s: Settings,
  todo?: Todo | null
): { mode: TimerMode; currentSession: number; seconds: number; autoStart: boolean } {
  if (finished === 'focus') {
    const done = currentSession + 1;
    return {
      mode: 'break',
      currentSession: done,
      seconds: phaseSeconds('break', s, { completedFocus: done }),
      autoStart: s.startBreakAutomatically
    };
  }
  return {
    mode: 'focus',
    currentSession,
    seconds: phaseSeconds('focus', s, { todo }),
    autoStart: s.startFocusAutomatically
  };
}

export const secondsLeft = (endAt: number, now: number) => Math.max(0, Math.ceil((endAt - now) / 1000));

export const formatClock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const formatDuration = (seconds: number) => {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};
