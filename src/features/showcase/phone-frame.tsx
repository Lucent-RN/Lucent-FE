import { cn } from '@/lib/utils';

/** Every screen is designed at this size and scaled with CSS, so text and layout stay identical everywhere. */
export const SCREEN_W = 300;
export const SCREEN_H = 650;

/**
 * An iPhone-style frame. `scale` is a number or a CSS length expression ("var(--s)") so it can follow
 * breakpoints: <PhoneFrame className='[--s:0.8] md:[--s:1]' scale='var(--s)'>.
 */
export function PhoneFrame({
  children,
  scale = 1,
  dark = false,
  className
}: {
  children: React.ReactNode;
  scale?: number | string;
  dark?: boolean;
  className?: string;
}) {
  const s = typeof scale === 'number' ? String(scale) : scale;
  const w = SCREEN_W + 20; // bezel
  const h = SCREEN_H + 20;
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: `calc(${w}px * ${s})`, height: `calc(${h}px * ${s})` }}
    >
      <div
        className='absolute top-0 left-0 origin-top-left rounded-[52px] bg-[#0b0b0d] p-[10px] shadow-[0_30px_80px_-20px_rgba(4,30,41,0.55),inset_0_0_0_2px_#2a2f33]'
        style={{ width: w, height: h, transform: `scale(${s})` }}
      >
        <div
          className={cn(
            'relative h-full w-full overflow-hidden rounded-[42px]',
            dark ? 'bg-[#041e29] text-[#e4f7fb]' : 'bg-[#f2fbfd] text-[#062c3b]'
          )}
        >
          {/* status bar + dynamic island */}
          <div className='absolute top-2.5 left-1/2 z-30 h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-black' />
          <div className='absolute top-3 left-6 z-30 text-[12px] font-semibold'>
            9:41
          </div>
          <div className='absolute top-3.5 right-6 z-30 flex items-center gap-1'>
            <span className='h-[7px] w-[13px] rounded-sm bg-current opacity-80' />
            <span className='h-[8px] w-[16px] rounded-[3px] bg-current' />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Scales any fixed-size design (e.g. the 760px web mock) with CSS so it can follow breakpoints. */
export function Scaled({
  width,
  height,
  scale,
  className,
  children
}: {
  width: number;
  height: number;
  scale: string; // e.g. "var(--s)"
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{
        width: `calc(${width}px * ${scale})`,
        height: `calc(${height}px * ${scale})`
      }}
    >
      <div
        className='absolute top-0 left-0 origin-top-left'
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
