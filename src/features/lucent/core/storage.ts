import { emptyData } from './defaults';
import type { LucentData } from './types';

export const STORAGE_KEY = 'lucent.web.v1';

/** Merges whatever is stored (possibly from an older/partial export) over the defaults. */
export function normalize(raw: unknown): LucentData {
  const base = emptyData();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<LucentData>;
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const todos = arr<LucentData['todos'][number]>(r.todos);
  const sessions = arr<LucentData['sessions'][number]>(r.sessions);
  const interruptions = arr<LucentData['interruptions'][number]>(r.interruptions);
  const maxId = Math.max(0, ...todos.map((t) => t.id), ...sessions.map((s) => s.id), ...interruptions.map((i) => i.id));
  return {
    version: 1,
    todos,
    sessions,
    interruptions,
    settings: { ...base.settings, ...(r.settings ?? {}) },
    timer: { ...base.timer, ...(r.timer ?? {}) },
    nextId: Math.max(Number(r.nextId) || 1, maxId + 1)
  };
}

export function load(): LucentData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return emptyData();
  }
}

export function save(data: LucentData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

export const exportJson = (data: LucentData) => JSON.stringify(data, null, 2);

export function importJson(text: string): LucentData {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) throw new Error('Not a Lucent export');
  return normalize(parsed);
}
