/**
 * Web side of the Lucent sync. The web keeps one JSON document in localStorage, so instead of
 * triggers it detects changes by hashing each row's wire payload against what was last uploaded.
 * Pure functions over (data, state): easy to test, no browser APIs.
 */
import { DEFAULT_SETTINGS, PRIORITIES, TAGS } from '../core/defaults';
import type { Interruption, LucentData, Session, Settings, Todo } from '../core/types';
import { ENTITY_ORDER, newId, type Change, type Entity, type RemoteRow } from './engine';
import { SETTINGS_ROW_ID, sanitizeSettings, stableJson, type SyncedSettings } from './settings-map';

type RowEntity = 'todo' | 'session' | 'interruption';
type Payload = Record<string, unknown>;

export interface RowState {
  remoteId: string;
  /** Hash of the payload the server holds (null: never uploaded). */
  hash: string | null;
  pendingHash: string | null;
  pendingAt: number;
  /** Last payload seen from the server: fields this app doesn't know are carried through edits. */
  base: Payload;
}
export interface SyncState {
  userId: string | null;
  deviceId: string;
  cursor: number;
  rows: Record<string, RowState>;
  tombstones: Record<string, { entity: RowEntity; remoteId: string; at: number }>;
  settings: { hash: string | null; pendingHash: string | null; pendingAt: number };
}

export const emptySyncState = (): SyncState => ({
  userId: null,
  deviceId: newId(),
  cursor: 0,
  rows: {},
  tombstones: {},
  settings: { hash: null, pendingHash: null, pendingAt: 0 }
});

const key = (e: RowEntity, id: number) => `${e}:${id}`;
const tagName = (id: number | null) => TAGS.find((t) => t.id === id)?.name ?? null;
const tagId = (name: unknown) =>
  typeof name === 'string' ? (TAGS.find((t) => t.name.toLowerCase() === name.toLowerCase())?.id ?? null) : null;
const priorityId = (level: unknown) => PRIORITIES.find((p) => p.level === level)?.id ?? 2;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? Math.trunc(v) : null);

export const settingsToWire = (s: Settings): SyncedSettings => ({
  focus_duration: s.focusDuration,
  short_break_duration: s.shortBreakDuration,
  long_break_duration: s.longBreakDuration,
  use_long_break: s.useLongBreak,
  pomodoro_sessions: s.pomodoroSessions,
  start_break_automatically: s.startBreakAutomatically,
  start_focus_automatically: s.startFocusAutomatically,
  focus_sound: s.completeFocusSound,
  break_sound: s.completeBreakSound,
  volume: s.volume
});

export function settingsFromWire(raw: Payload, cur: Settings): Settings {
  const p = sanitizeSettings(raw);
  return {
    ...cur,
    focusDuration: p.focus_duration ?? cur.focusDuration,
    shortBreakDuration: p.short_break_duration ?? cur.shortBreakDuration,
    longBreakDuration: p.long_break_duration ?? cur.longBreakDuration,
    useLongBreak: p.use_long_break ?? cur.useLongBreak,
    pomodoroSessions: p.pomodoro_sessions ?? cur.pomodoroSessions,
    startBreakAutomatically: p.start_break_automatically ?? cur.startBreakAutomatically,
    startFocusAutomatically: p.start_focus_automatically ?? cur.startFocusAutomatically,
    completeFocusSound: (p.focus_sound as Settings['completeFocusSound']) ?? cur.completeFocusSound,
    completeBreakSound: (p.break_sound as Settings['completeBreakSound']) ?? cur.completeBreakSound,
    volume: p.volume ?? cur.volume
  };
}

/** A tag this device doesn't have (a phone's custom tag) keeps its name instead of being wiped by an edit here. */
function tagNameOf(state: SyncState, e: RowEntity, localId: number, id: number | null): string | null {
  if (id !== null) return tagName(id);
  const base = state.rows[key(e, localId)]?.base.tag_name;
  return typeof base === 'string' && tagId(base) === null ? base : null;
}

/** Ensures a row has a server id so other rows can point at it. */
function ensure(state: SyncState, e: RowEntity, localId: number): RowState {
  const k = key(e, localId);
  return (state.rows[k] ??= { remoteId: newId(), hash: null, pendingHash: null, pendingAt: 0, base: {} });
}

function wireOf(data: LucentData, state: SyncState, e: RowEntity, row: Todo | Session | Interruption): Payload {
  if (e === 'todo') {
    const t = row as Todo;
    return {
      title: t.title,
      note: t.note,
      duration: t.duration,
      total_sessions: t.totalSessions,
      completed_sessions: t.completedSessions,
      priority_level: PRIORITIES.find((p) => p.id === t.priorityId)?.level ?? 2,
      tag_name: tagNameOf(state, 'todo', t.id, t.tagId),
      is_completed: t.isCompleted,
      created_at: t.createdAt
    };
  }
  if (e === 'session') {
    const s = row as Session;
    return {
      name: s.name,
      duration: s.duration,
      status: s.status,
      is_completed: s.isCompleted,
      tag_name: tagNameOf(state, 'session', s.id, s.tagId),
      todo_id: s.todoId === null || !data.todos.some((t) => t.id === s.todoId) ? null : ensure(state, 'todo', s.todoId).remoteId,
      created_at: s.createdAt
    };
  }
  const i = row as Interruption;
  return {
    session_id: data.sessions.some((s) => s.id === i.sessionId) ? ensure(state, 'session', i.sessionId).remoteId : null,
    type: i.type,
    created_at: i.createdAt
  };
}

const listOf = (d: LucentData, e: RowEntity) => (e === 'todo' ? d.todos : e === 'session' ? d.sessions : d.interruptions);
const ROW_ENTITIES: RowEntity[] = ['todo', 'session', 'interruption'];

export function collectDirty(data: LucentData, state: SyncState, now: number, limit = 200): Change[] {
  const out: Change[] = [];
  const live = new Set<string>();
  for (const e of ROW_ENTITIES) {
    for (const row of listOf(data, e)) {
      const k = key(e, row.id);
      live.add(k);
      const rs = ensure(state, e, row.id);
      const wire = wireOf(data, state, e, row);
      const h = stableJson(wire);
      if (h === rs.hash) {
        rs.pendingHash = null;
        continue;
      }
      if (rs.pendingHash !== h) {
        rs.pendingHash = h;
        rs.pendingAt = now;
      }
      out.push({ entity: e, id: rs.remoteId, data: { ...rs.base, ...wire }, updatedAt: rs.pendingAt, deletedAt: null });
    }
  }
  for (const [k, rs] of Object.entries(state.rows)) {
    if (live.has(k)) continue;
    const e = k.split(':')[0] as RowEntity;
    delete state.rows[k];
    if (rs.hash !== null) state.tombstones[k] = { entity: e, remoteId: rs.remoteId, at: now };
  }
  for (const t of Object.values(state.tombstones)) {
    out.push({ entity: t.entity, id: t.remoteId, data: {}, updatedAt: t.at, deletedAt: t.at });
  }
  const sh = stableJson(settingsToWire(data.settings) as unknown as Payload);
  if (state.settings.hash === null) state.settings.hash = sh; // first sign-in: never overwrite the account's settings with this device's defaults
  if (sh !== state.settings.hash) {
    if (state.settings.pendingHash !== sh) {
      state.settings.pendingHash = sh;
      state.settings.pendingAt = now;
    }
    out.push({
      entity: 'settings',
      id: SETTINGS_ROW_ID,
      data: settingsToWire(data.settings) as unknown as Payload,
      updatedAt: state.settings.pendingAt,
      deletedAt: null
    });
  }
  return out.sort((a, b) => ENTITY_ORDER.indexOf(a.entity) - ENTITY_ORDER.indexOf(b.entity)).slice(0, limit);
}

export function markPushed(state: SyncState, changes: Change[]): void {
  for (const c of changes) {
    if (c.entity === 'settings') {
      if (state.settings.pendingAt === c.updatedAt) {
        state.settings.hash = state.settings.pendingHash;
        state.settings.pendingHash = null;
      }
      continue;
    }
    if (c.deletedAt !== null) {
      for (const [k, t] of Object.entries(state.tombstones)) if (t.remoteId === c.id) delete state.tombstones[k];
      continue;
    }
    const rs = Object.values(state.rows).find((r) => r.remoteId === c.id);
    if (rs && rs.pendingAt === c.updatedAt) {
      rs.hash = rs.pendingHash;
      rs.pendingHash = null;
      rs.base = c.data;
    }
  }
}

/** Applies server rows to the document. Returns the new data (the state is updated in place). */
export function applyRemote(input: LucentData, state: SyncState, rows: RemoteRow[]): LucentData {
  let d = input;
  const byRemote = (e: RowEntity, remoteId: unknown) =>
    typeof remoteId === 'string'
      ? Object.entries(state.rows).find(([k, r]) => r.remoteId === remoteId && k.startsWith(`${e}:`))
      : undefined;
  const localOf = (e: RowEntity, remoteId: unknown) => {
    const hit = byRemote(e, remoteId);
    return hit ? Number(hit[0].split(':')[1]) : null;
  };

  for (const r of rows) {
    if (r.entity === 'settings') {
      if (r.deletedAt !== null) continue;
      const cur = stableJson(settingsToWire(d.settings) as unknown as Payload);
      const local = state.settings.hash !== null && cur !== state.settings.hash;
      if (local && state.settings.pendingAt > r.updatedAt) continue;
      d = { ...d, settings: settingsFromWire(r.data, d.settings) };
      state.settings = { hash: stableJson(settingsToWire(d.settings) as unknown as Payload), pendingHash: null, pendingAt: 0 };
      continue;
    }
    if (r.entity === 'tag') continue; // the web has a fixed tag palette
    const e = r.entity as RowEntity;
    const hit = byRemote(e, r.id);
    const [k, rs] = hit ?? [null, null];
    for (const [tk, t] of Object.entries(state.tombstones)) if (t.remoteId === r.id && r.deletedAt === null && t.at < r.updatedAt) delete state.tombstones[tk];

    if (r.deletedAt !== null) {
      if (!k) continue;
      const id = Number(k.split(':')[1]);
      delete state.rows[k];
      if (e === 'todo') {
        d = {
          ...d,
          todos: d.todos.filter((t) => t.id !== id),
          sessions: d.sessions.map((s) => (s.todoId === id ? { ...s, todoId: null } : s)),
          timer: d.timer.selectedTodoId === id ? { ...d.timer, selectedTodoId: null } : d.timer
        };
      } else if (e === 'session') {
        d = { ...d, sessions: d.sessions.filter((s) => s.id !== id), interruptions: d.interruptions.filter((i) => i.sessionId !== id) };
      } else d = { ...d, interruptions: d.interruptions.filter((i) => i.id !== id) };
      continue;
    }

    if (rs) {
      const id = Number(k!.split(':')[1]);
      const row = listOf(d, e).find((x) => x.id === id);
      if (row && stableJson(wireOf(d, state, e, row)) !== rs.hash && rs.pendingAt > r.updatedAt) continue; // local edit is newer
    }
    const x = r.data;
    let id = rs ? Number(k!.split(':')[1]) : d.nextId;
    if (!rs) d = { ...d, nextId: d.nextId + 1 };
    const t0 = r.updatedAt;
    if (e === 'todo') {
      const title = str(x.title, 300);
      if (!title) continue;
      const todo: Todo = {
        id,
        title,
        note: str(x.note, 5000),
        duration: num(x.duration),
        totalSessions: Math.max(1, num(x.total_sessions) ?? 1),
        completedSessions: Math.max(0, num(x.completed_sessions) ?? 0),
        priorityId: priorityId(x.priority_level),
        tagId: tagId(x.tag_name),
        isCompleted: x.is_completed === true,
        createdAt: num(x.created_at) ?? t0,
        updatedAt: t0
      };
      d = { ...d, todos: d.todos.some((t) => t.id === id) ? d.todos.map((t) => (t.id === id ? todo : t)) : [todo, ...d.todos] };
    } else if (e === 'session') {
      const duration = num(x.duration);
      if (duration === null) continue;
      const todoLocal = localOf('todo', x.todo_id);
      const session: Session = {
        id,
        name: str(x.name, 300),
        duration,
        status: x.status === 'break' ? 'break' : 'focus',
        isCompleted: x.is_completed === true,
        tagId: tagId(x.tag_name),
        todoId: todoLocal,
        createdAt: num(x.created_at) ?? t0,
        updatedAt: t0
      };
      d = { ...d, sessions: d.sessions.some((s) => s.id === id) ? d.sessions.map((s) => (s.id === id ? session : s)) : [...d.sessions, session] };
    } else {
      const sessionLocal = localOf('session', x.session_id);
      if (sessionLocal === null) continue; // parent not here (yet): skip rather than orphan it
      const type = x.type === 'reset' || x.type === 'skip' ? x.type : 'pause';
      const it: Interruption = { id, sessionId: sessionLocal, type, createdAt: num(x.created_at) ?? t0 };
      d = { ...d, interruptions: d.interruptions.some((i) => i.id === id) ? d.interruptions.map((i) => (i.id === id ? it : i)) : [...d.interruptions, it] };
    }
    const fresh = listOf(d, e).find((q) => q.id === id)!;
    const entry = (state.rows[key(e, id)] ??= { remoteId: r.id, hash: null, pendingHash: null, pendingAt: 0, base: {} });
    entry.remoteId = r.id;
    entry.hash = stableJson(wireOf(d, state, e, fresh));
    entry.pendingHash = null;
    entry.pendingAt = 0;
    entry.base = r.data;
  }
  return d;
}

export const DEFAULT_WEB_SETTINGS = DEFAULT_SETTINGS;
export type { Entity };
