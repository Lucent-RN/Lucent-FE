import { emptyData } from './defaults';
import { nextPhase, phaseSeconds, secondsLeft } from './timer';
import type { LucentData, Priority, Settings, TimerMode, Todo } from './types';

export type Action =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'skip' }
  | { type: 'setMode'; mode: TimerMode }
  | { type: 'selectTodo'; id: number | null }
  | { type: 'tick' }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'addTodo'; todo: NewTodo }
  | { type: 'updateTodo'; id: number; patch: Partial<NewTodo> }
  | { type: 'toggleTodo'; id: number }
  | { type: 'deleteTodo'; id: number }
  | { type: 'deleteSession'; id: number }
  | { type: 'replace'; data: LucentData }
  | { type: 'clear' };

export type NewTodo = Pick<Todo, 'title' | 'note' | 'duration' | 'totalSessions' | 'priorityId' | 'tagId'>;
export type EngineEvent = 'focus-complete' | 'break-complete';
export interface Result {
  data: LucentData;
  events: EngineEvent[];
}

export const isRunning = (d: LucentData) => d.timer.endAt !== null;
export const remainingNow = (d: LucentData, now: number) => (d.timer.endAt !== null ? secondsLeft(d.timer.endAt, now) : d.timer.remaining);
export const selectedTodo = (d: LucentData) => d.todos.find((t) => t.id === d.timer.selectedTodoId) ?? null;

/** Put the clock back to the start of the current phase (nothing running, no session row). */
function freshPhase(d: LucentData, mode: TimerMode = d.timer.mode): LucentData {
  const seconds = phaseSeconds(mode, d.settings, { todo: selectedTodo(d), completedFocus: d.timer.currentSession });
  return { ...d, timer: { ...d.timer, mode, remaining: seconds, total: seconds, endAt: null, sessionId: null } };
}

const withId = (d: LucentData): [number, LucentData] => [d.nextId, { ...d, nextId: d.nextId + 1 }];

/** Every state transition of the web app, as a pure function (so it is easy to test). */
export function applyAction(d: LucentData, a: Action, now: number): Result {
  const none = (data: LucentData): Result => ({ data, events: [] });

  switch (a.type) {
    case 'start': {
      if (isRunning(d)) return none(d);
      let data = d;
      let sessionId = d.timer.sessionId;
      if (sessionId === null) {
        const [id, next] = withId(d);
        const todo = selectedTodo(d);
        data = {
          ...next,
          sessions: [
            ...next.sessions,
            {
              id,
              name: todo?.title ?? (d.timer.mode === 'focus' ? 'Focus' : 'Break'),
              duration: d.timer.total,
              status: d.timer.mode,
              isCompleted: false,
              tagId: d.timer.mode === 'focus' ? (todo?.tagId ?? null) : null,
              todoId: d.timer.mode === 'focus' ? (todo?.id ?? null) : null,
              createdAt: now,
              updatedAt: now
            }
          ]
        };
        sessionId = id;
      }
      return none({ ...data, timer: { ...data.timer, sessionId, endAt: now + data.timer.remaining * 1000 } });
    }

    case 'pause': {
      if (!isRunning(d)) return none(d);
      const remaining = secondsLeft(d.timer.endAt!, now);
      let data: LucentData = { ...d, timer: { ...d.timer, remaining, endAt: null } };
      if (d.timer.mode === 'focus' && d.timer.sessionId !== null) {
        const [id, next] = withId(data);
        data = { ...next, interruptions: [...next.interruptions, { id, sessionId: d.timer.sessionId, type: 'pause', createdAt: now }] };
      }
      return none(data);
    }

    case 'reset': {
      let data = d;
      if (d.timer.mode === 'focus' && d.timer.sessionId !== null && (isRunning(d) || d.timer.remaining < d.timer.total)) {
        const [id, next] = withId(d);
        data = { ...next, interruptions: [...next.interruptions, { id, sessionId: d.timer.sessionId, type: 'reset', createdAt: now }] };
      }
      return none(freshPhase(data));
    }

    case 'skip': {
      // Only a break can be skipped; skipping focus would fake a completed session.
      if (d.timer.mode !== 'break') return none(d);
      const next = nextPhase('break', d.timer.currentSession, d.settings, selectedTodo(d));
      return none(freshPhase({ ...d, timer: { ...d.timer, currentSession: next.currentSession } }, 'focus'));
    }

    case 'setMode':
      if (isRunning(d) || a.mode === d.timer.mode) return none(d);
      return none(freshPhase(d, a.mode));

    case 'selectTodo': {
      const data = { ...d, timer: { ...d.timer, selectedTodoId: a.id } };
      return none(isRunning(data) || data.timer.sessionId !== null ? data : freshPhase(data));
    }

    case 'tick': {
      if (!isRunning(d) || d.timer.endAt! > now) return none(d);
      return complete(d, now);
    }

    case 'settings': {
      const data = { ...d, settings: { ...d.settings, ...a.patch } };
      // Idle clock follows the new durations immediately.
      return none(isRunning(data) || data.timer.sessionId !== null ? data : freshPhase(data));
    }

    case 'addTodo': {
      const [id, next] = withId(d);
      const todo: Todo = { ...a.todo, id, completedSessions: 0, isCompleted: false, createdAt: now, updatedAt: now };
      return none({ ...next, todos: [todo, ...next.todos] });
    }
    case 'updateTodo': {
      const data = { ...d, todos: d.todos.map((t) => (t.id === a.id ? { ...t, ...a.patch, updatedAt: now } : t)) };
      return none(a.id === d.timer.selectedTodoId && !isRunning(data) && data.timer.sessionId === null ? freshPhase(data) : data);
    }
    case 'toggleTodo':
      return none({ ...d, todos: d.todos.map((t) => (t.id === a.id ? { ...t, isCompleted: !t.isCompleted, updatedAt: now } : t)) });
    case 'deleteTodo': {
      const data = {
        ...d,
        todos: d.todos.filter((t) => t.id !== a.id),
        sessions: d.sessions.map((s) => (s.todoId === a.id ? { ...s, todoId: null } : s)),
        timer: { ...d.timer, selectedTodoId: d.timer.selectedTodoId === a.id ? null : d.timer.selectedTodoId }
      };
      return none(data);
    }
    case 'deleteSession':
      return none({
        ...d,
        sessions: d.sessions.filter((s) => s.id !== a.id),
        interruptions: d.interruptions.filter((i) => i.sessionId !== a.id)
      });
    case 'replace':
      return none(a.data);
    case 'clear':
      return none(emptyData());
  }
}

/** The running phase reached zero: close its session, count it on the todo, move to the next phase. */
function complete(d: LucentData, now: number): Result {
  const { mode, sessionId } = d.timer;
  const todo = selectedTodo(d);
  let todos = d.todos;
  let selectedTodoId = d.timer.selectedTodoId;

  if (mode === 'focus' && todo) {
    const done = todo.completedSessions + 1;
    const finished = todo.totalSessions > 0 && done >= todo.totalSessions;
    todos = d.todos.map((t) => (t.id === todo.id ? { ...t, completedSessions: done, isCompleted: finished || t.isCompleted, updatedAt: now } : t));
    if (finished) selectedTodoId = null;
  }
  const sessions = d.sessions.map((s) => (s.id === sessionId ? { ...s, isCompleted: true, updatedAt: now } : s));
  const next = nextPhase(mode, d.timer.currentSession, d.settings, todos.find((t) => t.id === selectedTodoId) ?? null);

  let data: LucentData = {
    ...d,
    todos,
    sessions,
    timer: {
      ...d.timer,
      mode: next.mode,
      currentSession: next.currentSession,
      remaining: next.seconds,
      total: next.seconds,
      endAt: null,
      sessionId: null,
      selectedTodoId
    }
  };
  if (next.autoStart) data = applyAction(data, { type: 'start' }, now).data;
  return { data, events: [mode === 'focus' ? 'focus-complete' : 'break-complete'] };
}

export const priorityOf = (priorities: Priority[], id: number) => priorities.find((p) => p.id === id);
