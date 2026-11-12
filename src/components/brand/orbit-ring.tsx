import { useId } from 'react';

/**
 * The Lucent timer, drawn as SVG: a shaded planet, a tilted orbit whose bright arc is the time that
 * is set/left, and a glossy sphere at its end ("now"). The far half of the orbit passes behind the
 * planet and the near half in front of it — the same depth cues as the app (see circular-slider.tsx).
 */
export function OrbitRing({
  progress,
  size = 240,
  dark = false,
  children
}: {
  /** 0..1 — how far the arc has travelled from the orbit's right tip, clockwise. */
  progress: number;
  size?: number;
  dark?: boolean;
  /** Content centred on the planet (usually the time). */
  children?: React.ReactNode;
}) {
  const uid = useId().replace(/:/g, '');
  const C = 50;
  const RX = 46;
  const RY = RX * 0.34;
  const TILT = -18;
  const TWO_PI = Math.PI * 2;
  const a = Math.max(0, Math.min(1, progress)) * TWO_PI;

  const pt = (angle: number) =>
    `${(C + RX * Math.cos(angle)).toFixed(2)} ${(C + RY * Math.sin(angle)).toFixed(2)}`;
  const arc = (a0: number, a1: number) =>
    `M ${pt(a0)} A ${RX} ${RY} 0 0 1 ${pt(a1)}`;
  const t = (TILT * Math.PI) / 180;
  const sin = Math.sin(a);
  const ux = RX * Math.cos(a);
  const uy = RY * Math.sin(a);
  const kx = C + ux * Math.cos(t) - uy * Math.sin(t);
  const ky = C + ux * Math.sin(t) + uy * Math.cos(t);
  const kr = 3.6 * (0.72 + 0.5 * ((sin + 1) / 2)); // nearer = bigger
  const onFront = sin >= -0.06;

  const planet = dark
    ? ['#2d8bab', '#0d4a61', '#062c3b']
    : ['#ffffff', '#d6f3fa', '#86d5e8'];
  const band = dark ? '#22d3ee' : '#06b6d4';
  const track = dark ? 'rgba(19,94,122,0.65)' : 'rgba(165,227,244,0.85)';

  const knob = (
    <g>
      <circle cx={kx} cy={ky} r={kr * 2.6} fill={`url(#${uid}-halo)`} />
      <circle cx={kx} cy={ky} r={kr} fill={`url(#${uid}-knob)`} />
      <circle
        cx={kx - kr * 0.32}
        cy={ky - kr * 0.34}
        r={kr * 0.27}
        fill='#fff'
        opacity='0.9'
      />
    </g>
  );

  return (
    <div className='relative' style={{ width: size, height: size }}>
      <svg viewBox='0 0 100 100' width={size} height={size} aria-hidden>
        <defs>
          <radialGradient id={`${uid}-planet`} cx='34%' cy='28%' r='88%'>
            <stop offset='0' stopColor={planet[0]} />
            <stop offset='0.5' stopColor={planet[1]} />
            <stop offset='1' stopColor={planet[2]} />
          </radialGradient>
          <linearGradient
            id={`${uid}-shade`}
            x1='22%'
            y1='12%'
            x2='92%'
            y2='100%'
          >
            <stop offset='0.45' stopColor='#062c3b' stopOpacity='0' />
            <stop
              offset='1'
              stopColor='#062c3b'
              stopOpacity={dark ? 0.5 : 0.24}
            />
          </linearGradient>
          <linearGradient
            id={`${uid}-arc`}
            gradientUnits='userSpaceOnUse'
            x1='4'
            y1='0'
            x2='96'
            y2='0'
          >
            <stop offset='0' stopColor='#a5f3fc' />
            <stop offset='0.5' stopColor='#22d3ee' />
            <stop offset='1' stopColor='#0891b2' />
          </linearGradient>
          <radialGradient id={`${uid}-knob`} cx='35%' cy='32%' r='75%'>
            <stop offset='0' stopColor='#fff' />
            <stop offset='0.38' stopColor='#a5f3fc' />
            <stop offset='0.75' stopColor='#22d3ee' />
            <stop offset='1' stopColor='#0e7490' />
          </radialGradient>
          <radialGradient id={`${uid}-halo`}>
            <stop offset='0' stopColor='#67e8f9' stopOpacity='0.7' />
            <stop offset='1' stopColor='#22d3ee' stopOpacity='0' />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <circle cx={C} cy={C} r='27' />
          </clipPath>
        </defs>

        {/* far half: behind the planet */}
        <g transform={`rotate(${TILT} ${C} ${C})`}>
          <path
            d={arc(Math.PI, TWO_PI)}
            fill='none'
            stroke={track}
            strokeWidth='1.7'
            strokeLinecap='round'
            opacity='0.7'
          />
          {a > Math.PI + 0.01 && (
            <path
              d={arc(Math.PI, a)}
              fill='none'
              stroke={`url(#${uid}-arc)`}
              strokeWidth='1.7'
              strokeLinecap='round'
              opacity='0.72'
            />
          )}
        </g>
        {!onFront && knob}

        {/* planet */}
        <circle cx={C} cy={C} r='27' fill={`url(#${uid}-planet)`} />
        <g clipPath={`url(#${uid}-clip)`}>
          <path
            d='M20 36 C 36 29, 50 43, 80 35 L80 45 C 52 53, 40 41, 20 47 Z'
            fill={band}
            opacity='0.16'
          />
          <path
            d='M20 55 C 38 49, 52 62, 80 53 L80 62 C 54 70, 38 59, 20 66 Z'
            fill={band}
            opacity='0.12'
          />
          <path
            d='M20 72 C 40 66, 56 78, 80 71 L80 90 L20 90 Z'
            fill={band}
            opacity='0.1'
          />
          <circle cx={C} cy={C} r='27' fill={`url(#${uid}-shade)`} />
        </g>
        <circle
          cx={C}
          cy={C}
          r='26.7'
          fill='none'
          stroke={band}
          strokeOpacity='0.3'
          strokeWidth='0.4'
        />

        {/* near half: in front of the planet */}
        <g transform={`rotate(${TILT} ${C} ${C})`}>
          <path
            d={arc(0, Math.PI)}
            fill='none'
            stroke={track}
            strokeWidth='2.4'
            strokeLinecap='round'
          />
          {a > 0.01 && (
            <path
              d={arc(0, Math.min(a, Math.PI))}
              fill='none'
              stroke={`url(#${uid}-arc)`}
              strokeWidth='2.4'
              strokeLinecap='round'
            />
          )}
        </g>
        {onFront && knob}
      </svg>
      {children && (
        <div className='absolute inset-0 flex items-center justify-center'>
          {children}
        </div>
      )}
    </div>
  );
}
