'use client';

import { useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

type Orbit = {
  rx: number;
  tilt: number;
  dur: number;
  r: number;
  reverse?: boolean;
  opacity: number;
};

const ORBITS: Orbit[] = [
  { rx: 94, tilt: -18, dur: 16, r: 5.2, opacity: 1 },
  { rx: 76, tilt: 22, dur: 10, r: 3.8, reverse: true, opacity: 0.85 },
  { rx: 58, tilt: -42, dur: 6.5, r: 3, opacity: 0.7 }
];
const FLAT = 0.33;
const C = 100;

/**
 * The Lucent planet with three tilted orbits and a glowing sphere circling each — a larger, living
 * version of the logo. Far halves of the orbits (and a sphere while it is there) are drawn behind the
 * planet, near halves in front. Pure SVG/SMIL; stops moving when the user prefers reduced motion.
 */
export function OrbitSystem({
  size = 520,
  className
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const still = useReducedMotion();

  const path = (o: Orbit) => {
    const ry = o.rx * FLAT;
    const sweep = o.reverse ? 0 : 1;
    return `M${C + o.rx} ${C} A${o.rx} ${ry} 0 1 ${sweep} ${C - o.rx} ${C} A${o.rx} ${ry} 0 1 ${sweep} ${C + o.rx} ${C}`;
  };
  const half = (o: Orbit, side: 'back' | 'front') => {
    const ry = o.rx * FLAT;
    return side === 'back'
      ? `M${C - o.rx} ${C} A${o.rx} ${ry} 0 0 1 ${C + o.rx} ${C}`
      : `M${C + o.rx} ${C} A${o.rx} ${ry} 0 0 1 ${C - o.rx} ${C}`;
  };

  const sphere = (o: Orbit, clip: string) => (
    <g clipPath={`url(#${clip})`}>
      <circle
        r={o.r}
        cx={still ? C + o.rx : 0}
        cy={still ? C : 0}
        fill={`url(#${uid}-ball)`}
        opacity={o.opacity}
      >
        {!still && (
          <animateMotion
            dur={`${o.dur}s`}
            repeatCount='indefinite'
            path={path(o)}
          />
        )}
      </circle>
      <circle
        r={o.r * 2.6}
        cx={still ? C + o.rx : 0}
        cy={still ? C : 0}
        fill={`url(#${uid}-glow)`}
        opacity={o.opacity * 0.6}
      >
        {!still && (
          <animateMotion
            dur={`${o.dur}s`}
            repeatCount='indefinite'
            path={path(o)}
          />
        )}
      </circle>
    </g>
  );

  return (
    <svg
      viewBox='0 0 200 200'
      width={size}
      height={size}
      aria-hidden
      className={cn('pointer-events-none', className)}
    >
      <defs>
        <radialGradient id={`${uid}-planet`} cx='34%' cy='28%' r='88%'>
          <stop offset='0' stopColor='#67e8f9' />
          <stop offset='0.5' stopColor='#06b6d4' />
          <stop offset='1' stopColor='#0e7490' />
        </radialGradient>
        <radialGradient id={`${uid}-ball`} cx='35%' cy='32%' r='75%'>
          <stop offset='0' stopColor='#fff' />
          <stop offset='0.4' stopColor='#a5f3fc' />
          <stop offset='1' stopColor='#0891b2' />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset='0' stopColor='#67e8f9' stopOpacity='0.7' />
          <stop offset='1' stopColor='#22d3ee' stopOpacity='0' />
        </radialGradient>
        <clipPath id={`${uid}-planet-clip`}>
          <circle cx={C} cy={C} r='24' />
        </clipPath>
        <clipPath id={`${uid}-back`}>
          <rect x='0' y='0' width='200' height={C} />
        </clipPath>
        <clipPath id={`${uid}-front`}>
          <rect x='0' y={C} width='200' height={C} />
        </clipPath>
      </defs>

      {/* far halves + spheres while behind the planet */}
      {ORBITS.map((o) => (
        <g key={`b${o.rx}`} transform={`rotate(${o.tilt} ${C} ${C})`}>
          <path
            d={half(o, 'back')}
            fill='none'
            stroke='#22d3ee'
            strokeOpacity={0.28 * o.opacity}
            strokeWidth='1.1'
            strokeLinecap='round'
          />
          {sphere(o, `${uid}-back`)}
        </g>
      ))}

      <circle cx={C} cy={C} r='24' fill={`url(#${uid}-planet)`} />
      <g clipPath={`url(#${uid}-planet-clip)`}>
        <path
          d='M70 88 C 88 80, 104 96, 132 87 L132 97 C 104 106, 90 92, 70 99 Z'
          fill='#a5f3fc'
          opacity='0.26'
        />
        <path
          d='M70 108 C 90 101, 106 116, 132 106 L132 116 C 106 124, 90 112, 70 119 Z'
          fill='#0e7490'
          opacity='0.36'
        />
      </g>

      {/* near halves + spheres in front of the planet */}
      {ORBITS.map((o) => (
        <g key={`f${o.rx}`} transform={`rotate(${o.tilt} ${C} ${C})`}>
          <path
            d={half(o, 'front')}
            fill='none'
            stroke='#a5f3fc'
            strokeOpacity={0.85 * o.opacity}
            strokeWidth='1.6'
            strokeLinecap='round'
          />
          {sphere(o, `${uid}-front`)}
        </g>
      ))}
    </svg>
  );
}

/** The app's timer-tab icon (selected state): planet + bright orbit + glowing sphere. */
export function OrbitTabIcon({
  size = 26,
  className
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      viewBox='0 0 100 100'
      width={size}
      height={size}
      aria-hidden
      className={className}
    >
      <defs>
        <radialGradient id={`${uid}-p`} cx='34%' cy='28%' r='88%'>
          <stop offset='0' stopColor='#a5f3fc' />
          <stop offset='0.5' stopColor='#06b6d4' />
          <stop offset='1' stopColor='#0e7490' />
        </radialGradient>
        <linearGradient
          id={`${uid}-a`}
          gradientUnits='userSpaceOnUse'
          x1='3'
          y1='0'
          x2='97'
          y2='0'
        >
          <stop offset='0' stopColor='#cffafe' />
          <stop offset='0.55' stopColor='#22d3ee' />
          <stop offset='1' stopColor='#0891b2' />
        </linearGradient>
        <radialGradient id={`${uid}-b`} cx='35%' cy='32%' r='75%'>
          <stop offset='0' stopColor='#fff' />
          <stop offset='0.4' stopColor='#a5f3fc' />
          <stop offset='1' stopColor='#0891b2' />
        </radialGradient>
        <radialGradient id={`${uid}-g`}>
          <stop offset='0' stopColor='#67e8f9' stopOpacity='0.75' />
          <stop offset='1' stopColor='#22d3ee' stopOpacity='0' />
        </radialGradient>
      </defs>
      <g transform='translate(50 52) scale(0.84) translate(-50 -50)'>
        <g transform='rotate(-18 50 50)'>
          <path
            d='M3 50 A47 16.5 0 0 1 97 50'
            fill='none'
            stroke='#22d3ee'
            strokeOpacity='0.5'
            strokeWidth='4.2'
            strokeLinecap='round'
          />
        </g>
        <circle cx='50' cy='50' r='29' fill={`url(#${uid}-p)`} />
        <g transform='rotate(-18 50 50)'>
          <path
            d='M97 50 A47 16.5 0 0 1 3 50'
            fill='none'
            stroke='#0e7490'
            strokeOpacity='0.45'
            strokeWidth='9.5'
            strokeLinecap='round'
          />
          <path
            d='M97 50 A47 16.5 0 0 1 3 50'
            fill='none'
            stroke={`url(#${uid}-a)`}
            strokeWidth='6.4'
            strokeLinecap='round'
          />
        </g>
        <circle cx='94.7' cy='35.5' r='13' fill={`url(#${uid}-g)`} />
        <circle cx='94.7' cy='35.5' r='6.6' fill={`url(#${uid}-b)`} />
        <circle cx='92.6' cy='33.2' r='1.8' fill='#fff' opacity='0.9' />
      </g>
    </svg>
  );
}
