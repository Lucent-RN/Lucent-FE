import { describe, expect, it } from 'vitest';
import { emptyData } from '../core/defaults';
import type { LucentData } from '../core/types';
import { syncOnce, type Change, type LocalStore, type Remote, type RemoteRow } from '../sync/engine';
import { applyRemote, collectDirty, emptySyncState, markPushed } from '../sync/web-sync';

function fakeServer() {
  const rows = new Map<string, RemoteRow>();
  let seq = 0;
  const remote: Remote = {
    async push(deviceId, changes: Change[]) {
      let applied = 0;
      let skipped = 0;
      for (const c of changes) {
        const k = `${c.entity}:${c.id}`;
        const cur = rows.get(k);
        if (cur && (cur.updatedAt > c.updatedAt || (cur.updatedAt === c.updatedAt && cur.deviceId >= deviceId))) {
          skipped++;
          continue;
        }
        rows.set(k, { ...c, deviceId, seq: ++seq });
        applied++;
      }
      return { applied, skipped };
    },
    async pull(after, limit) {
      return [...rows.values()].filter((r) => r.seq > after).sort((a, b) => a.seq - b.seq).slice(0, limit);
    }
  };
  return { remote, rows };
}

function device(userId = 'u') {
  let data: LucentData = emptyData();
  const state = { ...emptySyncState(), userId };
  let clock = 1_000;
  const store: LocalStore = {
    getDeviceId: async () => state.deviceId,
    getCursor: async () => state.cursor,
    setCursor: async (n) => void (state.cursor = n),
    collectDirty: async (limit) => collectDirty(data, state, ++clock, limit),
    markPushed: async (c) => markPushed(state, c),
    applyRemote: async (rows) => void (data = applyRemote(data, state, rows))
  };
  return {
    store,
    state,
    get data() {
      return data;
    },
    set: (fn: (d: LucentData) => LucentData) => void (data = fn(data)),
    tick: () => ++clock
  };
}

const addTodo = (d: ReturnType<typeof device>, title: string, extra: object = {}) =>
  d.set((x) => ({
    ...x,
    nextId: x.nextId + 1,
    todos: [{ id: x.nextId, title, note: '', duration: null, totalSessions: 4, completedSessions: 0, priorityId: 3, tagId: 5, isCompleted: false, createdAt: 10, updatedAt: 10, ...extra }, ...x.todos]
  }));

describe('web sync', () => {
  it('a todo, its session and an interruption reach another device with references intact', async () => {
    const srv = fakeServer();
    const a = device();
    const b = device();
    addTodo(a, 'Write report');
    a.set((x) => ({
      ...x,
      nextId: 10,
      sessions: [{ id: 8, name: 'Focus', duration: 1500, status: 'focus', isCompleted: true, tagId: 5, todoId: 1, createdAt: 20, updatedAt: 20 }],
      interruptions: [{ id: 9, sessionId: 8, type: 'pause', createdAt: 25 }]
    }));
    expect((await syncOnce(a.store, srv.remote)).pushed).toBe(3);
    await syncOnce(b.store, srv.remote);
    expect(b.data.todos[0]).toMatchObject({ title: 'Write report', priorityId: 3, tagId: 5, totalSessions: 4 });
    const s = b.data.sessions[0];
    expect(s).toMatchObject({ name: 'Focus', duration: 1500, todoId: b.data.todos[0].id });
    expect(b.data.interruptions[0]).toMatchObject({ sessionId: s.id, type: 'pause' });
    expect((await syncOnce(b.store, srv.remote)).pushed).toBe(0); // pulled rows are not echoed back
  });

  it('edits and deletes propagate, and later edits win', async () => {
    const srv = fakeServer();
    const a = device();
    const b = device();
    addTodo(a, 'v1');
    await syncOnce(a.store, srv.remote);
    await syncOnce(b.store, srv.remote);
    b.tick();
    b.tick();
    b.set((x) => ({ ...x, todos: x.todos.map((t) => ({ ...t, title: 'edited on B' })) }));
    await syncOnce(b.store, srv.remote);
    await syncOnce(a.store, srv.remote);
    expect(a.data.todos[0].title).toBe('edited on B');
    for (let i = 0; i < 100; i++) a.tick(); // A's clock is now later than B's edit
    a.set((x) => ({ ...x, todos: [] }));
    await syncOnce(a.store, srv.remote);
    await syncOnce(b.store, srv.remote);
    expect(b.data.todos).toEqual([]);
  });

  it('keeps fields the web does not know (phone-only data) when the web edits a todo', async () => {
    const srv = fakeServer();
    const a = device();
    addTodo(a, 'from phone');
    await syncOnce(a.store, srv.remote);
    const row = [...srv.rows.values()][0];
    srv.rows.set(`todo:${row.id}`, { ...row, data: { ...row.data, event_id: 'cal-123', short_break_duration: 300 }, updatedAt: row.updatedAt + 1, deviceId: 'phone', seq: 99 });
    await syncOnce(a.store, srv.remote);
    a.tick();
    a.set((x) => ({ ...x, todos: x.todos.map((t) => ({ ...t, title: 'renamed on web' })) }));
    await syncOnce(a.store, srv.remote);
    const after = [...srv.rows.values()][0].data;
    expect(after).toMatchObject({ title: 'renamed on web', event_id: 'cal-123', short_break_duration: 300 });
  });

  it('settings sync, and a first sign-in does not overwrite them with defaults', async () => {
    const srv = fakeServer();
    const a = device();
    const b = device();
    await syncOnce(a.store, srv.remote);
    expect(srv.rows.size).toBe(0); // untouched defaults are not uploaded
    a.set((x) => ({ ...x, settings: { ...x.settings, focusDuration: 3000, completeFocusSound: 'harp' } }));
    await syncOnce(a.store, srv.remote);
    await syncOnce(b.store, srv.remote);
    expect(b.data.settings).toMatchObject({ focusDuration: 3000, completeFocusSound: 'harp' });
    // hostile values from the server are ignored field by field
    srv.rows.set('settings:x', { entity: 'settings', id: '00000000-0000-4000-8000-000000000001', data: { focus_duration: 'x', focus_sound: 'evil', volume: 0.2 }, updatedAt: 9e12, deletedAt: null, deviceId: 'z', seq: 50 });
    await syncOnce(b.store, srv.remote);
    expect(b.data.settings).toMatchObject({ focusDuration: 3000, completeFocusSound: 'harp', volume: 0.2 });
  });

  it('drops malformed rows instead of corrupting the document, and skips orphan interruptions', async () => {
    const srv = fakeServer();
    const a = device();
    const put = (entity: RemoteRow['entity'], id: string, data: object) =>
      srv.rows.set(`${entity}:${id}`, { entity, id, data: data as never, updatedAt: 5, deletedAt: null, deviceId: 'p', seq: srv.rows.size + 1 });
    put('todo', '00000000-0000-4000-8000-0000000000a1', { title: '' });
    put('session', '00000000-0000-4000-8000-0000000000a2', { name: 'x', duration: 'NaN' });
    put('interruption', '00000000-0000-4000-8000-0000000000a3', { session_id: '00000000-0000-4000-8000-0000000000ff', type: 'pause' });
    put('todo', '00000000-0000-4000-8000-0000000000a4', { title: 'ok', total_sessions: -5, priority_level: 99, tag_name: 'Nope' });
    await syncOnce(a.store, srv.remote);
    expect(a.data.todos).toHaveLength(1);
    expect(a.data.todos[0]).toMatchObject({ title: 'ok', totalSessions: 1, priorityId: 2, tagId: null });
    expect(a.data.sessions).toEqual([]);
    expect(a.data.interruptions).toEqual([]);
  });
});
