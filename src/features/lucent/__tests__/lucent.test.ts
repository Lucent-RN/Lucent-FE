import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, emptyData } from '../core/defaults';
import { buildChart, computeStreaks, rangeFor, shiftAnchor, startOfWeek, totalsFor } from '../core/stats';
import { exportJson, importJson, normalize } from '../core/storage';
import { formatClock, formatDuration, isLongBreak, nextPhase, phaseSeconds } from '../core/timer';
import type { Interruption, Session } from '../core/types';

const at = (d: number, h = 10) => new Date(2030, 0, d, h).getTime(); // 2030-01-07 is a Monday
let n = 0;
const session = (o: Partial<Session> & { createdAt: number }): Session => ({
  id: ++n,
  name: 's',
  duration: 25 * 60,
  status: 'focus',
  isCompleted: true,
  tagId: null,
  todoId: null,
  updatedAt: o.createdAt,
  ...o
});

describe('timer', () => {
  const s = DEFAULT_SETTINGS;
  it('alternates focus and break, with a long break every 4th focus', () => {
    let cur = 0;
    const seen: string[] = [];
    for (let i = 0; i < 4; i++) {
      const b = nextPhase('focus', cur, s);
      seen.push(`${b.mode}:${b.seconds / 60}`);
      cur = b.currentSession;
      const f = nextPhase('break', cur, s);
      expect(f.mode).toBe('focus');
      expect(f.seconds).toBe(25 * 60);
    }
    expect(seen).toEqual(['break:5', 'break:5', 'break:5', 'break:15']);
  });
  it('can disable the long break and honour a todo-specific focus length', () => {
    const noLong = { ...s, useLongBreak: false };
    expect(isLongBreak(4, noLong)).toBe(false);
    const todo = { duration: 50 * 60 } as never;
    expect(phaseSeconds('focus', s, { todo })).toBe(50 * 60);
  });
  it('auto-start follows the settings', () => {
    expect(nextPhase('focus', 0, { ...s, startBreakAutomatically: true }).autoStart).toBe(true);
    expect(nextPhase('break', 1, s).autoStart).toBe(false);
  });
  it('formats clocks and durations', () => {
    expect(formatClock(1499)).toBe('24:59');
    expect(formatClock(-3)).toBe('00:00');
    expect(formatDuration(25 * 60)).toBe('25m');
    expect(formatDuration(95 * 60)).toBe('1h 35m');
  });
});

describe('statistics', () => {
  const sessions = [
    session({ createdAt: at(7) }),
    session({ createdAt: at(7, 14), duration: 50 * 60 }),
    session({ createdAt: at(9) }),
    session({ createdAt: at(9, 12), isCompleted: false }),
    session({ createdAt: at(9, 13), status: 'break', duration: 5 * 60 }),
    session({ createdAt: at(20) }) // outside the first week
  ];
  const anchor = new Date(2030, 0, 10);

  it('week starts on Monday and charts completed focus minutes only', () => {
    expect(startOfWeek(anchor).getDate()).toBe(7);
    const chart = buildChart(sessions, 'week', anchor);
    expect(chart.map((c) => c.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(chart[0].minutes).toBe(25 + 50);
    expect(chart[2].minutes).toBe(25); // the unfinished session is excluded
  });
  it('month and year buckets', () => {
    const month = buildChart(sessions, 'month', anchor);
    expect(month).toHaveLength(31);
    expect(month[19].minutes).toBe(25);
    const year = buildChart(sessions, 'year', anchor);
    expect(year).toHaveLength(12);
    expect(year[0].minutes).toBe(25 + 50 + 25 + 25);
  });
  it('totals include breaks and interruptions', () => {
    const intr: Interruption[] = [{ id: 99, sessionId: sessions[0].id, type: 'pause', createdAt: at(7) }];
    const t = totalsFor(sessions, intr, rangeFor('week', anchor));
    expect(t.focusStarted).toBe(4);
    expect(t.focusCompleted).toBe(3);
    expect(t.focusSeconds).toBe((25 + 50 + 25) * 60);
    expect(t.breakCompleted).toBe(1);
    expect(t.interruptions).toBe(1);
  });
  it('shifts the anchor by the filter unit', () => {
    expect(shiftAnchor('week', anchor, -1).getDate()).toBe(3);
    expect(shiftAnchor('month', anchor, 1).getMonth()).toBe(1);
    expect(shiftAnchor('year', anchor, -1).getFullYear()).toBe(2029);
  });
});

describe('streaks', () => {
  const day = (d: number) => session({ createdAt: at(d) });
  it('counts consecutive days, keeps the current streak alive until the end of today', () => {
    const list = [day(1), day(2), day(3), day(5), day(6)];
    const st = computeStreaks(list, new Date(2030, 0, 7)); // nothing done on the 7th yet
    expect(st.longest).toBe(3);
    expect(st.current).toBe(2);
    expect(computeStreaks(list, new Date(2030, 0, 9)).current).toBe(0);
  });
  it('ignores unfinished sessions and breaks', () => {
    const st = computeStreaks([session({ createdAt: at(4), isCompleted: false }), session({ createdAt: at(5), status: 'break' })], new Date(2030, 0, 5));
    expect(st.longest).toBe(0);
  });
});

describe('storage', () => {
  it('round-trips an export and rejects garbage', () => {
    const d = { ...emptyData(), nextId: 5 };
    expect(importJson(exportJson(d)).nextId).toBe(5);
    expect(() => importJson('{"version":2}')).toThrow();
    expect(() => importJson('nope')).toThrow();
  });
  it('normalize fills gaps and never reuses ids', () => {
    const d = normalize({ todos: [{ id: 41 }], settings: { focusDuration: 30 * 60 } });
    expect(d.settings.shortBreakDuration).toBe(5 * 60);
    expect(d.settings.focusDuration).toBe(30 * 60);
    expect(d.nextId).toBeGreaterThan(41);
    expect(normalize(null).todos).toEqual([]);
  });
});

import { applyAction, isRunning, remainingNow } from '../core/engine';
import type { LucentData } from '../core/types';

describe('engine', () => {
  const T0 = Date.UTC(2030, 0, 7, 9, 0, 0);
  const run = (d: LucentData, ...acts: Array<Parameters<typeof applyAction>[1] & { at?: number }>) =>
    acts.reduce((cur, a) => applyAction(cur, a, a.at ?? T0).data, d);
  const withTodo = () =>
    applyAction(emptyData(), { type: 'addTodo', todo: { title: 'Write', note: '', duration: null, totalSessions: 2, priorityId: 2, tagId: 1 } }, T0).data;

  it('start creates one session row and pause/resume does not duplicate it', () => {
    let d = run(emptyData(), { type: 'start' });
    expect(isRunning(d)).toBe(true);
    expect(d.sessions).toHaveLength(1);
    d = applyAction(d, { type: 'pause' }, T0 + 60_000).data;
    expect(isRunning(d)).toBe(false);
    expect(d.timer.remaining).toBe(25 * 60 - 60);
    expect(d.interruptions).toHaveLength(1);
    d = applyAction(d, { type: 'start' }, T0 + 90_000).data;
    expect(d.sessions).toHaveLength(1);
    expect(remainingNow(d, T0 + 90_000)).toBe(25 * 60 - 60);
  });

  it('a finished focus session completes the row, counts on the todo and starts a break', () => {
    let d = withTodo();
    const id = d.todos[0].id;
    d = run(d, { type: 'selectTodo', id }, { type: 'start' });
    const r = applyAction(d, { type: 'tick' }, T0 + 25 * 60 * 1000);
    expect(r.events).toEqual(['focus-complete']);
    expect(r.data.sessions[0].isCompleted).toBe(true);
    expect(r.data.sessions[0].todoId).toBe(id);
    expect(r.data.todos[0].completedSessions).toBe(1);
    expect(r.data.timer).toMatchObject({ mode: 'break', currentSession: 1, remaining: 5 * 60, endAt: null });
  });

  it('completing the last planned session finishes the todo and deselects it', () => {
    let d = withTodo();
    const id = d.todos[0].id;
    d = { ...d, todos: [{ ...d.todos[0], completedSessions: 1 }] };
    d = run(d, { type: 'selectTodo', id }, { type: 'start' });
    const r = applyAction(d, { type: 'tick' }, T0 + 25 * 60 * 1000);
    expect(r.data.todos[0].isCompleted).toBe(true);
    expect(r.data.timer.selectedTodoId).toBeNull();
  });

  it('auto-start chains into the break', () => {
    let d = run(emptyData(), { type: 'settings', patch: { startBreakAutomatically: true } }, { type: 'start' });
    const r = applyAction(d, { type: 'tick' }, T0 + 25 * 60 * 1000);
    expect(r.data.timer.mode).toBe('break');
    expect(isRunning(r.data)).toBe(true);
    expect(r.data.sessions).toHaveLength(2);
  });

  it('reset logs an interruption and an unfinished session never counts', () => {
    let d = run(emptyData(), { type: 'start' });
    d = applyAction(d, { type: 'reset' }, T0 + 10_000).data;
    expect(d.interruptions.map((i) => i.type)).toEqual(['reset']);
    expect(d.sessions[0].isCompleted).toBe(false);
    expect(d.timer.remaining).toBe(25 * 60);
    expect(isRunning(d)).toBe(false);
  });

  it('only breaks can be skipped; mode switch is blocked while running', () => {
    let d = run(emptyData(), { type: 'skip' });
    expect(d.timer.mode).toBe('focus');
    d = run(emptyData(), { type: 'setMode', mode: 'break' });
    expect(d.timer.mode).toBe('break');
    expect(run(d, { type: 'skip' }).timer.mode).toBe('focus');
    const running = run(emptyData(), { type: 'start' });
    expect(run(running, { type: 'setMode', mode: 'break' }).timer.mode).toBe('focus');
  });

  it('idle clock follows settings, deleting a todo detaches its sessions', () => {
    let d = run(emptyData(), { type: 'settings', patch: { focusDuration: 40 * 60 } });
    expect(d.timer.remaining).toBe(40 * 60);
    d = withTodo();
    const id = d.todos[0].id;
    d = run(d, { type: 'selectTodo', id }, { type: 'start' }, { type: 'deleteTodo', id });
    expect(d.todos).toHaveLength(0);
    expect(d.timer.selectedTodoId).toBeNull();
    expect(d.sessions[0].todoId).toBeNull();
  });
});
