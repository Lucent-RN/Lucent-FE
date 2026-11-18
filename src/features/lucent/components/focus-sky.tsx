'use client';

import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Deep-space backdrop for focus mode — the web twin of the app's CosmicBackground
 * (Lucent/src/features/time-progress/views/atoms/cosmic-background.tsx): a violet-to-teal
 * night sky, slow drifting nebulae, a star field (two layers twinkling), an occasional
 * shooting star and a soft vignette. Pure CSS animation (globals.css → "Lucent focus mode"),
 * so it costs no JS per frame; it fades in over 900 ms and out over 350 ms, and its animations
 * pause while hidden. Reduced motion keeps a static sky.
 */

const SKY = 'linear-gradient(160deg, #0A0524 0%, #0B1740 55%, #05283A 100%)';
const STAR_COLORS = ['#FFFFFF', '#CFF7FF', '#E9D5FF', '#A5F3FC'];

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Star = { x: number; y: number; r: number; o: number; c: string };

/** Positions are percentages, so the field fills any window without re-generating. */
const makeStars = (count: number, seed: number): Star[] => {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    r: 0.5 + rnd() * 1.3,
    o: 0.35 + rnd() * 0.6,
    c: STAR_COLORS[Math.floor(rnd() * STAR_COLORS.length)]
  }));
};

// More stars than the phone: a desktop window is several times larger.
const CALM = makeStars(90, 7);
const TWINKLE_A = makeStars(40, 21);
const TWINKLE_B = makeStars(40, 99);

const NEBULAE = [
  { color: '139 92 246', alpha: 0.34, cx: 18, cy: 16, size: 70, dx: 40, dy: 26, ms: 16000 },
  { color: '34 211 238', alpha: 0.22, cx: 92, cy: 50, size: 66, dx: -34, dy: 30, ms: 21000 },
  { color: '217 70 239', alpha: 0.2, cx: 22, cy: 86, size: 66, dx: 30, dy: -24, ms: 18000 },
  { color: '59 130 246', alpha: 0.14, cx: 78, cy: 8, size: 44, dx: -24, dy: 18, ms: 24000 }
] as const;

const StarField = memo(function StarField({
  stars,
  twinkleMs,
  delayMs
}: {
  stars: Star[];
  twinkleMs?: number;
  delayMs?: number;
}) {
  return (
    <svg
      className={twinkleMs ? 'focus-twinkle absolute inset-0' : 'absolute inset-0'}
      style={
        twinkleMs
          ? ({ '--ms': `${twinkleMs}ms`, '--delay': `${delayMs ?? 0}ms` } as React.CSSProperties)
          : undefined
      }
      width='100%'
      height='100%'
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill={s.c} opacity={s.o} />
      ))}
    </svg>
  );
});

function Sky({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      data-active={active}
      className='focus-sky pointer-events-none fixed inset-0 z-[-5] overflow-hidden'
      style={{ backgroundImage: SKY }}
    >
      {NEBULAE.map((n) => (
        <div
          key={n.color}
          className='focus-nebula absolute rounded-full'
          style={
            {
              left: `calc(${n.cx}% - ${n.size / 2}vmax)`,
              top: `calc(${n.cy}% - ${n.size / 2}vmax)`,
              width: `${n.size}vmax`,
              height: `${n.size}vmax`,
              backgroundImage: `radial-gradient(closest-side, rgb(${n.color} / ${n.alpha}), rgb(${n.color} / ${n.alpha * 0.35}) 55%, transparent)`,
              '--dx': `${n.dx}px`,
              '--dy': `${n.dy}px`,
              '--ms': `${n.ms}ms`
            } as React.CSSProperties
          }
        />
      ))}

      <StarField stars={CALM} />
      <StarField stars={TWINKLE_A} twinkleMs={2400} />
      <StarField stars={TWINKLE_B} twinkleMs={3300} delayMs={900} />

      <div
        className='focus-shooting-star absolute h-0.5 w-27.5 rounded-full'
        style={{
          left: '78%',
          top: '10%',
          backgroundImage: 'linear-gradient(90deg, rgb(255 255 255 / 0), rgb(207 247 255 / 0.95))'
        }}
      />

      {/* soft vignette pulls the eye to the centre */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage:
            'radial-gradient(75% 75% at 50% 46%, rgb(2 4 14 / 0) 55%, rgb(2 4 14 / 0.55) 100%)'
        }}
      />
    </div>
  );
}

/**
 * Mounted on the first focus session and kept afterwards (hidden and paused), so later sessions
 * fade in instantly without re-creating ~170 SVG nodes. Rendered into <body> so no ancestor
 * transform or overflow can clip the fixed layer.
 */
export function FocusSky({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    setMounted(true);
    // two frames: let the layer paint at opacity 0 first, so the fade-in transition runs
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setShown(true));
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  if (!mounted) return null;
  return createPortal(<Sky active={shown} />, document.body);
}
