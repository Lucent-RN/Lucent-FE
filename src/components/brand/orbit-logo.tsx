import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * The Lucent mark: a shaded planet with a tilted orbit and a glowing sphere circling it.
 * Same depth trick as the app icon and the mobile timer: the far half of the orbit (and the
 * sphere while it is there) is drawn BEHIND the planet, the near half IN FRONT of it.
 */
export function OrbitLogo({
  size = 32,
  animated = true,
  className
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const ORBIT = 'M92 50 A42 14 0 1 1 8 50 A42 14 0 1 1 92 50';
  const sphere = (clip: string) => (
    <g clipPath={`url(#${clip})`}>
      <circle
        r='5.2'
        fill={`url(#${uid}-sphere)`}
        cx={animated ? 0 : 92}
        cy={animated ? 0 : 50}
      >
        {animated && (
          <animateMotion dur='7s' repeatCount='indefinite' path={ORBIT} />
        )}
      </circle>
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      role='img'
      aria-label='Lucent'
      className={cn('shrink-0', className)}
    >
      <defs>
        <radialGradient id={`${uid}-planet`} cx='34%' cy='28%' r='85%'>
          <stop offset='0' stopColor='#67e8f9' />
          <stop offset='0.5' stopColor='#06b6d4' />
          <stop offset='1' stopColor='#0e7490' />
        </radialGradient>
        <radialGradient id={`${uid}-sphere`} cx='35%' cy='32%' r='75%'>
          <stop offset='0' stopColor='#fff' />
          <stop offset='0.4' stopColor='#a5f3fc' />
          <stop offset='1' stopColor='#0891b2' />
        </radialGradient>
        <clipPath id={`${uid}-planet-clip`}>
          <circle cx='50' cy='50' r='24' />
        </clipPath>
        <clipPath id={`${uid}-back`}>
          <rect x='0' y='0' width='100' height='50' />
        </clipPath>
        <clipPath id={`${uid}-front`}>
          <rect x='0' y='50' width='100' height='50' />
        </clipPath>
      </defs>

      {/* far half of the orbit, behind the planet */}
      <g transform='rotate(-18 50 50)'>
        <path
          d='M8 50 A42 14 0 0 1 92 50'
          fill='none'
          stroke='#22d3ee'
          strokeOpacity='0.35'
          strokeWidth='3.2'
          strokeLinecap='round'
        />
        {sphere(`${uid}-back`)}
      </g>

      <circle cx='50' cy='50' r='24' fill={`url(#${uid}-planet)`} />
      <g clipPath={`url(#${uid}-planet-clip)`}>
        <path
          d='M20 38 C 36 32, 50 44, 80 36 L80 46 C 52 54, 40 42, 20 48 Z'
          fill='#a5f3fc'
          opacity='0.25'
        />
        <path
          d='M20 56 C 38 50, 52 62, 80 54 L80 62 C 54 70, 38 60, 20 66 Z'
          fill='#0e7490'
          opacity='0.35'
        />
      </g>

      {/* near half of the orbit, in front of the planet */}
      <g transform='rotate(-18 50 50)'>
        <path
          d='M92 50 A42 14 0 0 1 8 50'
          fill='none'
          stroke='#a5f3fc'
          strokeWidth='4.4'
          strokeLinecap='round'
        />
        {sphere(`${uid}-front`)}
      </g>
    </svg>
  );
}
