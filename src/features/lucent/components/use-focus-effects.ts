'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Timer progress (0..1) that moves every frame instead of once a second, and glides
 * (instead of jumping) when the timer is reset, skipped or switches mode.
 *
 * While running, the target is computed from the absolute end time, so the ring is exact
 * at 60 fps; the displayed value eases towards the target with a ~90 ms time constant,
 * which is invisible while running and gives a ~0.4 s glide on jumps.
 */
export function useSmoothProgress({
  endAt,
  total,
  progress
}: {
  /** epoch ms the running session ends at, or null while paused/idle */
  endAt: number | null;
  /** session length in seconds */
  total: number;
  /** the provider's (per-second) progress, used while paused/idle */
  progress: number;
}) {
  const [shown, setShown] = useState(progress);
  const shownRef = useRef(progress);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = () =>
      endAt !== null && total > 0
        ? Math.min(1, Math.max(0, 1 - (endAt - Date.now()) / 1000 / total))
        : progress;

    if (reduce) {
      // no tweening: still smooth while running (the value is exact), but no glide on jumps
      if (endAt === null) {
        shownRef.current = progress;
        setShown(progress);
        return;
      }
    }

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      const goal = target();
      const k = reduce ? 1 : 1 - Math.exp(-dt / 90);
      const next = shownRef.current + (goal - shownRef.current) * k;
      const settled = Math.abs(goal - next) < 0.0005;
      shownRef.current = settled ? goal : next;
      setShown(shownRef.current);
      // keep animating while running; otherwise stop once the glide has settled
      if (endAt !== null || !settled) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [endAt, total, progress]);

  return shown;
}

/**
 * Focus mode re-themes the page dark ("deep space"), like the app's ThemeOverride, and
 * restores the visitor's own theme afterwards. Only touches the `dark` class it added, and
 * cross-fades colours briefly so the switch is not abrupt.
 */
export function useFocusDarkMode(active: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    if (!active || root.classList.contains('dark')) return;

    // Cross-fade colours briefly. The class removal outlives the effect on purpose,
    // so the fade back to the visitor's theme also gets its 600 ms.
    const fade = () => {
      root.classList.add('lucent-theme-fade');
      window.setTimeout(() => root.classList.remove('lucent-theme-fade'), 650);
    };

    const prevScheme = root.style.colorScheme; // next-themes sets this (enableColorScheme)
    fade();
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    return () => {
      fade();
      root.classList.remove('dark');
      root.style.colorScheme = prevScheme;
    };
  }, [active]);
}
