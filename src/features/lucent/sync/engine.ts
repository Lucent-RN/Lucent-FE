/**
 * Platform-neutral sync engine shared by Lucent mobile and Lucent web
 * (the web copy lives in Lucent-FE/src/features/lucent/sync/engine.ts, kept identical by
 * `yarn lucent:sync-engine`).
 *
 * Local-first: the app always reads and writes its own store. A sync pass is
 *   1. push every pending local change (batches),
 *   2. pull everything the server changed after our cursor (pages),
 *   3. hand pulled rows to the store, which applies them without re-queueing them.
 * Conflicts are last-write-wins per row; the server decides on `updatedAt` (ties: larger device id).
 */
export type Entity = 'tag' | 'todo' | 'session' | 'interruption' | 'settings';

/** Parents before children, so a pulled session can find its todo. */
export const ENTITY_ORDER: Entity[] = ['tag', 'todo', 'session', 'interruption', 'settings'];

export interface Change {
  entity: Entity;
  id: string;
  data: Record<string, unknown>;
  /** Epoch ms of the local edit. */
  updatedAt: number;
  /** Epoch ms when deleted, otherwise null. */
  deletedAt: number | null;
}

export interface RemoteRow extends Change {
  deviceId: string;
  seq: number;
}

export interface LocalStore {
  getDeviceId(): Promise<string>;
  getCursor(): Promise<number>;
  setCursor(seq: number): Promise<void>;
  /** Pending local changes, parents first. Must not return more than `limit`. */
  collectDirty(limit: number): Promise<Change[]>;
  /** Clear the pending marker for rows that were not edited again after being collected. */
  markPushed(changes: Change[]): Promise<void>;
  /**
   * Apply server rows locally WITHOUT queueing them for upload.
   * A local row edited more recently than the remote one must be kept.
   */
  applyRemote(rows: RemoteRow[]): Promise<void>;
}

export interface Remote {
  push(deviceId: string, changes: Change[]): Promise<{ applied: number; skipped: number }>;
  pull(after: number, limit: number): Promise<RemoteRow[]>;
}

export interface SyncResult {
  pushed: number;
  skipped: number;
  pulled: number;
}

const PUSH_BATCH = 200;
const PULL_PAGE = 500;
const MAX_PAGES = 200; // hard stop against a misbehaving server

export async function syncOnce(store: LocalStore, remote: Remote): Promise<SyncResult> {
  const deviceId = await store.getDeviceId();
  const result: SyncResult = { pushed: 0, skipped: 0, pulled: 0 };

  for (let i = 0; i < MAX_PAGES; i++) {
    const batch = await store.collectDirty(PUSH_BATCH);
    if (batch.length === 0) break;
    const r = await remote.push(deviceId, batch);
    await store.markPushed(batch); // skipped rows lost to a newer server copy; the pull below replaces them
    result.pushed += r.applied;
    result.skipped += r.skipped;
  }

  let cursor = await store.getCursor();
  for (let i = 0; i < MAX_PAGES; i++) {
    const rows = await remote.pull(cursor, PULL_PAGE);
    if (rows.length === 0) break;
    const sorted = [...rows].sort(
      (a, b) => a.seq - b.seq || ENTITY_ORDER.indexOf(a.entity) - ENTITY_ORDER.indexOf(b.entity)
    );
    await store.applyRemote(sorted.filter((r) => r.deviceId !== deviceId)); // our own echoes need no apply
    cursor = sorted[sorted.length - 1].seq;
    await store.setCursor(cursor);
    result.pulled += rows.length;
    if (rows.length < PULL_PAGE) break;
  }
  return result;
}

/** Collapses overlapping triggers (app start, focus, edits) into one run plus at most one follow-up. */
export function createSyncRunner(run: () => Promise<unknown>, onError?: (e: unknown) => void) {
  let running: Promise<void> | null = null;
  let again = false;
  const start = (): Promise<void> => {
    if (running) {
      again = true;
      return running;
    }
    running = (async () => {
      try {
        do {
          again = false;
          await run();
        } while (again);
      } catch (e) {
        onError?.(e);
      } finally {
        running = null;
      }
    })();
    return running;
  };
  return start;
}

/** Random RFC-4122 v4 id, generated on the device that creates the row. */
export function newId(): string {
  try {
    const g = globalThis as { crypto?: { randomUUID?: () => string } };
    if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  } catch {
    /* runtime without WebCrypto: fall through */
  }
  const h = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) s += '-';
    else if (i === 14) s += '4';
    else if (i === 19) s += h[8 + Math.floor(Math.random() * 4)];
    else s += h[Math.floor(Math.random() * 16)];
  }
  return s;
}
