'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { useSupabaseUser } from '@/lib/supabase/use-user';
import type { LucentData } from '../core/types';
import { createSyncRunner, syncOnce, type LocalStore } from './engine';
import { createSupabaseRemote } from './remote';
import { applyRemote, collectDirty, emptySyncState, markPushed, type SyncState } from './web-sync';

const KEY = 'lucent.web.sync.v1';
const DEBOUNCE_MS = 3000;

function loadState(): SyncState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...emptySyncState(), ...JSON.parse(raw) };
  } catch {
    /* corrupt or blocked: start over, the server still has everything */
  }
  return emptySyncState();
}
const saveState = (s: SyncState) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage full: next pass re-detects changes */
  }
};

export type SyncStatus = 'off' | 'idle' | 'syncing' | 'synced' | 'error';

/** Mirrors the web document to the signed-in account. Signed out (or Supabase unconfigured): stays local-only. */
export function useWebSync(opts: {
  hydrated: boolean;
  data: LucentData;
  getData: () => LucentData;
  mutate: (fn: (d: LucentData) => LucentData) => void;
}) {
  const { hydrated, data, getData, mutate } = opts;
  const { user } = useSupabaseUser();
  const [status, setStatus] = useState<SyncStatus>('off');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const runRef = useRef<(() => Promise<void>) | null>(null);
  const userId = isSupabaseConfigured ? (user?.id ?? null) : null;

  useEffect(() => {
    if (!hydrated || !userId) {
      runRef.current = null;
      setStatus('off');
      return;
    }
    let state = loadState();
    if (state.userId !== userId) state = { ...emptySyncState(), deviceId: state.deviceId, userId };
    const store: LocalStore = {
      getDeviceId: async () => state.deviceId,
      getCursor: async () => state.cursor,
      setCursor: async (n) => {
        state.cursor = n;
        saveState(state);
      },
      collectDirty: async (limit) => {
        const c = collectDirty(getData(), state, Date.now(), limit);
        saveState(state);
        return c;
      },
      markPushed: async (c) => {
        markPushed(state, c);
        saveState(state);
      },
      applyRemote: async (rows) => {
        mutate((d) => applyRemote(d, state, rows));
        saveState(state);
      }
    };
    const sb = getSupabaseBrowser();
    const remote = createSupabaseRemote(sb);
    const run = createSyncRunner(
      async () => {
        setStatus('syncing');
        await syncOnce(store, remote);
        setStatus('synced');
        setLastSyncedAt(Date.now());
      },
      () => setStatus('error')
    );
    runRef.current = run;
    void run();
    const onFocus = () => void run();
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onFocus);
    const channel = sb
      .channel(`lucent-web-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lucent_records', filter: `user_id=eq.${userId}` }, () => void run())
      .subscribe();
    return () => {
      runRef.current = null;
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onFocus);
      void sb.removeChannel(channel);
    };
  }, [hydrated, userId, getData, mutate]);

  // Local edits (not timer ticks: those keep the same array references) → one debounced pass.
  useEffect(() => {
    if (!runRef.current) return;
    const id = window.setTimeout(() => void runRef.current?.(), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [data.todos, data.sessions, data.interruptions, data.settings]);

  const syncNow = useCallback(() => void runRef.current?.(), []);
  return useMemo(
    () => ({ status, lastSyncedAt, syncNow, signedIn: !!userId, configured: isSupabaseConfigured }),
    [status, lastSyncedAt, syncNow, userId]
  );
}
