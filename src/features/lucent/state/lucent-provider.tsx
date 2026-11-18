'use client';

import { useTranslations } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { applyAction, isRunning, remainingNow, selectedTodo, type Action } from '../core/engine';
import { emptyData } from '../core/defaults';
import { playSound } from '../core/sound';
import { load, save } from '../core/storage';
import { formatClock } from '../core/timer';
import type { LucentData, Todo } from '../core/types';

interface LucentValue {
  data: LucentData;
  hydrated: boolean;
  /** Seconds left in the current phase (live while running). */
  remaining: number;
  running: boolean;
  /** 0..1 — how much of the phase has elapsed. */
  progress: number;
  todo: Todo | null;
  dispatch: (a: Action) => void;
}

const Ctx = createContext<LucentValue | null>(null);

export function LucentProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('lucent-web');
  const [data, setData] = useState<LucentData>(emptyData);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef(data);
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // The browser is the only storage, so it is read after mount (never during SSR).
  useEffect(() => {
    const d = load();
    ref.current = d;
    setData(d);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) save(data);
  }, [data, hydrated]);

  const notify = useCallback((kind: 'focus-complete' | 'break-complete', d: LucentData) => {
    const s = d.settings;
    playSound(kind === 'focus-complete' ? s.completeFocusSound : s.completeBreakSound, s.volume);
    if (s.notifications && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      const next = d.timer.mode === 'focus' ? tRef.current('timer.focus') : tRef.current('timer.break');
      try {
        new Notification(kind === 'focus-complete' ? tRef.current('timer.focusDone') : tRef.current('timer.breakDone'), {
          body: tRef.current('timer.timeFor', { mode: next.toLowerCase() }),
          icon: '/assets/app-icon.webp',
          tag: 'lucent-timer'
        });
      } catch {
        /* some browsers only allow notifications from a service worker */
      }
    }
  }, []);

  const dispatch = useCallback(
    (a: Action) => {
      const r = applyAction(ref.current, a, Date.now());
      ref.current = r.data;
      setData(r.data);
      for (const e of r.events) notify(e, r.data);
    },
    [notify]
  );

  const running = isRunning(data);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setNow(Date.now());
      dispatch({ type: 'tick' });
    }, 250);
    return () => window.clearInterval(id);
  }, [running, dispatch]);

  const remaining = remainingNow(data, now);
  const todo = selectedTodo(data);

  // Keep the countdown visible in the tab title.
  useEffect(() => {
    if (!hydrated) return;
    const base = 'Lucent';
    document.title = running ? `${formatClock(remaining)} · ${data.timer.mode === 'focus' ? t('timer.focus') : t('timer.break')} · ${base}` : document.title.replace(/^\d\d:\d\d · .* · Lucent$/, base);
  }, [running, remaining, data.timer.mode, hydrated, t]);

  const value = useMemo<LucentValue>(
    () => ({
      data,
      hydrated,
      remaining,
      running,
      progress: data.timer.total > 0 ? 1 - remaining / data.timer.total : 0,
      todo,
      dispatch
    }),
    [data, hydrated, remaining, running, todo, dispatch]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLucent(): LucentValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLucent must be used inside <LucentProvider>');
  return v;
}
