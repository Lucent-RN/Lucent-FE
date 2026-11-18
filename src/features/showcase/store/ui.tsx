import { cn } from '@/lib/utils';

/** Shared bits for the v2 store screens (phone 300×650 and tablet 600×800 designs). */
export const TAB_W = 600;
export const TAB_H = 800;

export const TabletScreen = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn('relative overflow-hidden text-left', className)}
    style={{ width: TAB_W, height: TAB_H }}
  >
    {children}
  </div>
);

export const Card = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      'rounded-2xl border border-[#cbeff8] bg-white shadow-[0_2px_10px_rgba(8,145,178,0.06)]',
      className
    )}
  >
    {children}
  </div>
);

export const Segmented = ({
  items,
  active,
  className
}: {
  items: string[];
  active: number;
  className?: string;
}) => (
  <div
    className={cn(
      'flex gap-1 rounded-full bg-[#e4f7fb] p-1 text-[11px] font-semibold',
      className
    )}
  >
    {items.map((v, i) => (
      <span
        key={v}
        className={cn(
          'flex-1 rounded-full py-1.5 text-center',
          i === active ? 'bg-white text-[#062c3b] shadow-sm' : 'text-[#3d7a8e]'
        )}
      >
        {v}
      </span>
    ))}
  </div>
);

export const Chip = ({
  children,
  tone = 'plain',
  className
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'active' | 'amber' | 'red' | 'green';
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
      tone === 'plain' && 'border-[#cbeff8] bg-white text-[#062c3b]',
      tone === 'active' && 'border-[#06b6d4] bg-[#e4f7fb] text-[#0e7490]',
      tone === 'amber' && 'border-amber-300/70 bg-amber-100/80 text-amber-800',
      tone === 'red' && 'border-red-300/70 bg-red-50 text-red-700',
      tone === 'green' && 'border-emerald-300/70 bg-emerald-50 text-emerald-700',
      className
    )}
  >
    {children}
  </span>
);

/** Vertical bars: value 0..1 per column. `hot` marks an overloaded / highlighted column. */
export const Bars = ({
  data,
  height,
  hot = [],
  labels
}: {
  data: number[];
  height: number;
  hot?: number[];
  labels: string[];
}) => (
  <div className='flex items-end justify-between gap-2' style={{ height: height + 22 }}>
    {data.map((v, i) => (
      <div key={labels[i]} className='flex flex-1 flex-col items-center gap-1.5'>
        <div
          className='flex w-full items-end rounded-xl bg-[#e4f7fb]'
          style={{ height }}
        >
          <div
            className={cn(
              'w-full rounded-xl',
              hot.includes(i)
                ? 'bg-gradient-to-t from-[#f97316] to-[#fbbf24]'
                : 'bg-gradient-to-t from-[#0891b2] to-[#22d3ee]'
            )}
            style={{ height: `${Math.max(v, 0.04) * 100}%` }}
          />
        </div>
        <span className='text-[9.5px] font-medium text-[#3d7a8e]'>
          {labels[i]}
        </span>
      </div>
    ))}
  </div>
);
