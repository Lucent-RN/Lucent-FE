import {
  IconBook2,
  IconCalendar,
  IconChartBar,
  IconList,
  IconPlayerPause,
  IconSettings,
  IconSparkles,
  IconAdjustmentsHorizontal,
  IconUsers,
  IconPlus,
  IconArrowUp
} from '@tabler/icons-react';
import { OrbitRing } from '@/components/brand/orbit-ring';
import { cn } from '@/lib/utils';
import { SCREEN_H, SCREEN_W } from './phone-frame';

/**
 * App screens drawn in HTML/SVG at SCREEN_W × SCREEN_H, mirroring the latest Lucent / LucentMeet UI
 * (cosmic palette, orbit timer). Text inside is the app's own English UI, like a store screenshot.
 */
const Screen = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn('relative text-left', className)}
    style={{ width: SCREEN_W, height: SCREEN_H }}
  >
    {children}
  </div>
);

const Pill = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold',
      className
    )}
  >
    {children}
  </span>
);

/** Bottom floating tab bar (planet = the timer tab). */
const TabBar = ({
  items,
  active,
  dark = false
}: {
  items: React.ReactNode[];
  active: number;
  dark?: boolean;
}) => (
  <div
    className={cn(
      'absolute bottom-5 left-1/2 flex w-[230px] -translate-x-1/2 items-center justify-between rounded-full border px-2 py-1.5 shadow-lg backdrop-blur',
      dark ? 'border-white/10 bg-white/5' : 'border-[#cbeff8] bg-white/80'
    )}
  >
    {items.map((icon, i) => (
      <span
        key={i}
        className={cn(
          'flex h-10 w-[66px] items-center justify-center rounded-full',
          i === active && (dark ? 'bg-white/10' : 'bg-[#e4f7fb]')
        )}
      >
        {icon}
      </span>
    ))}
  </div>
);

const Dots = ({
  n = 4,
  active = 0,
  dark = false
}: {
  n?: number;
  active?: number;
  dark?: boolean;
}) => (
  <div className='flex items-center gap-1.5'>
    {Array.from({ length: n }, (_, i) => (
      <span
        key={i}
        className={cn(
          'h-1.5 rounded-full',
          i === active
            ? 'w-5 bg-[#22d3ee]'
            : cn('w-1.5', dark ? 'bg-white/25' : 'bg-[#a5e3f4]')
        )}
      />
    ))}
  </div>
);

const PlayButton = ({ pause = false }: { pause?: boolean }) => (
  <span className='relative flex h-[72px] w-[72px] items-center justify-center'>
    <span className='absolute inset-0 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/15' />
    <span className='relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-[#67e8f9] via-[#06b6d4] to-[#0891b2] shadow-[0_8px_22px_rgba(6,182,212,0.45)]'>
      {pause ? (
        <IconPlayerPause className='size-6 fill-white text-white' />
      ) : (
        <span className='ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-white' />
      )}
    </span>
  </span>
);

// ───────────────────────── Lucent ─────────────────────────

export function TimerScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <div className='absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(34,211,238,0.18),transparent)]' />
      <div className='absolute inset-x-4 top-12 flex items-center justify-between'>
        <span className='flex size-10 items-center justify-center rounded-full border border-[#cbeff8] bg-white'>
          <IconAdjustmentsHorizontal className='size-5' />
        </span>
        <Pill className='border border-[#cbeff8] bg-[#e4f7fb] text-[#0891b2]'>
          <IconBook2 className='size-4' /> Study
        </Pill>
        <span className='flex size-10 items-center justify-center rounded-full border border-[#cbeff8] bg-white'>
          <IconList className='size-5' />
        </span>
      </div>

      <div className='absolute inset-x-4 top-[108px] flex items-center gap-3 rounded-2xl border border-[#cbeff8] bg-white px-4 py-3 shadow-sm'>
        <span className='flex size-8 items-center justify-center rounded-full border-2 border-[#0e7490] text-[#0e7490]'>
          <IconPlus className='size-4' />
        </span>
        <span>
          <span className='block text-[13px] font-semibold'>
            Write the proposal
          </span>
          <span className='block text-[11px] text-[#3d7a8e]'>
            30 min · 0/4 sessions
          </span>
        </span>
      </div>

      <div className='absolute top-[196px] left-1/2 -translate-x-1/2'>
        <OrbitRing progress={0.62} size={290}>
          <div className='flex flex-col items-center gap-1.5'>
            <span className='text-[34px] leading-none font-semibold tracking-tight text-[#062c3b]'>
              24:59
            </span>
            <Dots />
          </div>
        </OrbitRing>
      </div>

      <div className='absolute bottom-[96px] left-1/2 -translate-x-1/2'>
        <PlayButton />
      </div>
      <TabBar
        active={1}
        items={[
          <IconChartBar key='a' className='size-5' />,
          <OrbitRing key='b' progress={0.0} size={26} />,
          <IconSettings key='c' className='size-5' />
        ]}
      />
    </Screen>
  );
}

const Cosmos = () => (
  <>
    <div className='absolute inset-0 bg-[linear-gradient(165deg,#0a0524_0%,#0b1740_55%,#05283a_100%)]' />
    <div className='absolute -top-16 -left-20 size-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.5),transparent)]' />
    <div className='absolute top-[220px] -right-24 size-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.32),transparent)]' />
    <div className='absolute -bottom-20 -left-10 size-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(217,70,239,0.32),transparent)]' />
    <div className='cosmic-stars absolute inset-0 opacity-90' />
    <div className='cosmic-stars cosmic-stars-twinkle absolute inset-0' />
  </>
);

export function FocusScreen() {
  return (
    <Screen className='text-[#e4f7fb]'>
      <Cosmos />
      <div className='absolute inset-x-0 top-14 text-center text-[12px] font-semibold tracking-[0.3em] text-[#a5e3f4] uppercase'>
        Focus
      </div>
      <div className='absolute top-[170px] left-1/2 -translate-x-1/2'>
        <OrbitRing progress={0.38} size={300} dark>
          <div className='flex flex-col items-center gap-1.5'>
            <span className='text-[36px] leading-none font-semibold tracking-tight'>
              18:42
            </span>
            <Dots dark active={1} />
          </div>
        </OrbitRing>
      </div>
      <div className='absolute bottom-[130px] left-1/2 -translate-x-1/2'>
        <PlayButton pause />
      </div>
      <div className='absolute inset-x-0 bottom-9 flex justify-center'>
        <Pill className='border border-[#22d3ee]/30 bg-white/5 text-[#e4f7fb] backdrop-blur'>
          <span className='size-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />{' '}
          Stay focused
        </Pill>
      </div>
    </Screen>
  );
}

export function LockScreen() {
  return (
    <Screen className='text-white'>
      <Cosmos />
      <div className='absolute inset-x-0 top-16 text-center'>
        <div className='text-[14px] font-medium text-white/80'>
          Thursday, 12 November
        </div>
        <div className='text-[78px] leading-none font-light tracking-tight'>
          9:41
        </div>
      </div>

      {/* the Live Activity */}
      <div className='absolute inset-x-3 top-[250px] flex items-center gap-4 rounded-[26px] border border-white/10 bg-[#062c3b] p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]'>
        <OrbitRing progress={0.62} size={108} dark>
          <span className='text-[15px] font-semibold tracking-tight'>
            24:59
          </span>
        </OrbitRing>
        <div className='min-w-0 flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/assets/app-icon.png'
              alt=''
              width={24}
              height={24}
              className='size-6 rounded-md'
            />
            <span className='text-[12px] font-semibold text-[#a5e3f4]'>
              Lucent
            </span>
            <span className='ml-auto'>
              <Dots n={3} active={0} dark />
            </span>
          </div>
          <div className='text-[15px] leading-tight font-semibold'>
            Write the proposal
          </div>
        </div>
      </div>

      <div className='absolute inset-x-8 bottom-10 flex justify-between'>
        {[0, 1].map((i) => (
          <span
            key={i}
            className='size-12 rounded-full bg-white/10 backdrop-blur'
          />
        ))}
      </div>
    </Screen>
  );
}

// ───────────────────────── LucentMeet ─────────────────────────

const EVENTS = [
  {
    t: '9:30',
    end: '9:45',
    title: 'Daily stand-up',
    cal: 'Work',
    c: '#4285F4'
  },
  {
    t: '10:00',
    end: '11:00',
    title: 'Design review',
    cal: 'Work',
    c: '#4285F4',
    warn: true
  },
  {
    t: '10:30',
    end: '11:30',
    title: 'Sprint planning',
    cal: 'Team',
    c: '#10B981',
    warn: true
  },
  {
    t: '12:00',
    end: '13:00',
    title: 'Lunch with Linh',
    cal: 'Personal',
    c: '#F59E0B'
  },
  {
    t: '14:00',
    end: '14:30',
    title: '1:1 with manager',
    cal: 'Work',
    c: '#4285F4'
  },
  { t: '18:30', end: '19:30', title: 'Gym', cal: 'iCloud', c: '#A855F7' }
];

export function MeetCalendarScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <div className='absolute inset-x-0 top-0 h-44 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(34,211,238,0.18),transparent)]' />
      <div className='absolute inset-x-5 top-12'>
        <div className='text-[11px] font-semibold tracking-[0.2em] text-[#0891b2] uppercase'>
          Thursday
        </div>
        <div className='text-[28px] leading-tight font-semibold'>
          12 November
        </div>
        <div className='mt-3 flex gap-1.5 rounded-full bg-[#e4f7fb] p-1 text-[11px] font-semibold'>
          {['Agenda', 'Week', 'Month'].map((v, i) => (
            <span
              key={v}
              className={cn(
                'flex-1 rounded-full py-1.5 text-center',
                i === 0 ? 'bg-white shadow-sm' : 'text-[#3d7a8e]'
              )}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className='absolute inset-x-4 top-[170px] space-y-2'>
        {EVENTS.map((e) => (
          <div
            key={e.title}
            className='flex items-center gap-3 rounded-xl border border-[#cbeff8] bg-white px-3 py-2'
          >
            <span
              className='h-9 w-1 rounded-full'
              style={{ backgroundColor: e.c }}
            />
            <span className='w-[44px] text-[11px] leading-tight text-[#3d7a8e] tabular-nums'>
              {e.t}
              <br />
              {e.end}
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block truncate text-[12.5px] font-semibold'>
                {e.title}
              </span>
              <span className='block text-[10.5px] text-[#3d7a8e]'>
                {e.cal}
              </span>
            </span>
            {e.warn && (
              <span className='flex size-5 items-center justify-center rounded-full bg-amber-100 text-[11px] text-amber-600'>
                !
              </span>
            )}
          </div>
        ))}
      </div>

      <span className='absolute right-5 bottom-[84px] flex size-12 items-center justify-center rounded-full bg-[#06b6d4] text-white shadow-[0_8px_22px_rgba(6,182,212,0.45)]'>
        <IconPlus className='size-6' />
      </span>
      <TabBar
        active={0}
        items={[
          <IconCalendar key='a' className='size-5 text-[#0891b2]' />,
          <IconSparkles key='b' className='size-5' />,
          <IconUsers key='c' className='size-5' />
        ]}
      />
    </Screen>
  );
}

export function MeetConflictScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <div className='absolute inset-x-0 top-0 h-full bg-[#062c3b]/10' />
      <div className='absolute inset-x-0 top-[70px] bottom-0 rounded-t-[30px] bg-[#f2fbfd] px-5 pt-5 shadow-[0_-10px_40px_rgba(4,30,41,0.25)]'>
        <div className='mx-auto mb-4 h-1 w-10 rounded-full bg-[#cbeff8]' />
        <div className='text-[16px] font-semibold'>New event</div>
        <div className='mt-3 rounded-xl border border-[#cbeff8] bg-white px-3 py-2.5 text-[15px] font-semibold'>
          Design review
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2 text-[12px]'>
          {[
            ['Starts', 'Thu 10:15'],
            ['Ends', 'Thu 11:00']
          ].map(([l, v]) => (
            <div
              key={l}
              className='rounded-xl border border-[#cbeff8] bg-white px-3 py-2'
            >
              <div className='text-[10px] text-[#3d7a8e]'>{l}</div>
              <div className='font-semibold'>{v}</div>
            </div>
          ))}
        </div>
        <div className='mt-3 flex flex-wrap gap-2 text-[11px] font-semibold'>
          <Pill className='border border-[#4285F4] bg-[#e4f7fb]'>
            <span className='size-2 rounded-full bg-[#4285F4]' />
            Work
          </Pill>
          <Pill className='border border-[#cbeff8] bg-white'>
            <span className='size-2 rounded-full bg-[#F59E0B]' />
            Personal
          </Pill>
        </div>

        <div className='mt-4 space-y-1.5 rounded-xl border border-amber-300/60 bg-amber-100/70 p-3 text-[12px] font-semibold text-amber-800'>
          <div>⚠ Overlaps “Sprint planning”</div>
          <div>⚠ Too close to “Daily stand-up”</div>
        </div>

        <div className='mt-5 rounded-xl bg-[#06b6d4] py-3 text-center text-[14px] font-semibold text-white'>
          Save anyway
        </div>
        <div className='mt-2 text-center text-[12px] font-semibold text-[#3d7a8e]'>
          Cancel
        </div>
      </div>
    </Screen>
  );
}

export function MeetAssistantScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <div className='absolute inset-x-5 top-12 flex items-center gap-3 border-b border-[#cbeff8] pb-3'>
        <span className='flex size-9 items-center justify-center rounded-full bg-[#06b6d4] text-white'>
          <IconSparkles className='size-5' />
        </span>
        <span>
          <span className='block text-[14px] font-semibold'>AI Assistant</span>
          <span className='block text-[11px] text-[#3d7a8e]'>
            Your calendar, by conversation
          </span>
        </span>
      </div>

      <div className='absolute inset-x-4 top-[116px] space-y-3'>
        <div className='ml-auto w-fit max-w-[78%] rounded-2xl rounded-br-sm bg-[#06b6d4] px-3.5 py-2 text-[13px] text-white'>
          Find 30 minutes tomorrow afternoon
        </div>
        <div className='flex items-start gap-2'>
          <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#06b6d4] text-white'>
            <IconSparkles className='size-4' />
          </span>
          <div className='space-y-2'>
            <div className='rounded-2xl rounded-tl-sm border border-[#cbeff8] bg-white px-3.5 py-2 text-[13px]'>
              You’re free from 3:00 PM. Here’s a focus block — confirm and I’ll
              add it.
            </div>
            <div className='space-y-1 rounded-xl border border-[#cbeff8] bg-white p-3 shadow-sm'>
              <div className='text-[10px] font-bold tracking-wide text-[#3d7a8e] uppercase'>
                New event
              </div>
              <div className='text-[14px] font-semibold'>Focus block</div>
              <div className='text-[12px] text-[#3d7a8e]'>
                Fri 13 Nov · 3:00 – 3:30 PM
              </div>
              <div className='text-[11px] text-[#3d7a8e]'>Work</div>
              <div className='flex gap-2 pt-1.5 text-[12px] font-semibold'>
                <span className='flex-1 rounded-lg bg-[#06b6d4] py-1.5 text-center text-white'>
                  Confirm
                </span>
                <span className='flex-1 rounded-lg py-1.5 text-center text-[#3d7a8e]'>
                  Dismiss
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute inset-x-3 bottom-5 flex items-center gap-2 rounded-full border border-[#cbeff8] bg-white py-1.5 pr-1.5 pl-4 text-[13px] text-[#3d7a8e]'>
        <span className='flex-1'>Ask about your schedule…</span>
        <span className='flex size-9 items-center justify-center rounded-full bg-[#06b6d4] text-white'>
          <IconArrowUp className='size-5' />
        </span>
      </div>
    </Screen>
  );
}

/** Wide web view (browser frame) for the LucentMeet landing hero. */
export function MeetWebScreen() {
  const cols = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13'];
  const blocks: Array<[number, number, number, number, string, string]> = [
    [3, 1.2, 1.1, 0, '#4285F4', 'Design review'],
    [3, 1.7, 1.1, 1, '#10B981', 'Sprint planning'],
    [0, 3.5, 1, 0, '#F59E0B', 'Lunch'],
    [1, 0.4, 1.3, 0, '#4285F4', 'Roadmap sync'],
    [2, 2.4, 1.4, 0, '#A855F7', 'Piano'],
    [4, 1.1, 2, 0, '#4285F4', 'Planning'],
    [4, 2.6, 1, 0, '#10B981', 'Retro']
  ];
  return (
    <div className='w-[760px] overflow-hidden rounded-2xl border border-[#cbeff8] bg-white shadow-[0_30px_80px_-20px_rgba(4,30,41,0.45)]'>
      <div className='flex items-center gap-2 border-b border-[#cbeff8] bg-[#e4f7fb] px-4 py-2.5'>
        <span className='size-2.5 rounded-full bg-[#ff5f57]' />
        <span className='size-2.5 rounded-full bg-[#febc2e]' />
        <span className='size-2.5 rounded-full bg-[#28c840]' />
        <span className='mx-auto rounded-md bg-white px-10 py-1 text-[11px] text-[#3d7a8e]'>
          lucent.app/dashboard/meet
        </span>
      </div>
      <div className='grid grid-cols-[150px_1fr] text-[#062c3b]'>
        <div className='space-y-3 border-r border-[#cbeff8] bg-[#f2fbfd] p-4 text-[12px]'>
          <div className='font-semibold'>Calendars</div>
          {[
            ['you@company.com', '#4285F4'],
            ['you@gmail.com', '#F59E0B'],
            ['iCloud', '#A855F7']
          ].map(([n, c]) => (
            <div key={n} className='flex items-center gap-2 text-[11px]'>
              <span
                className='size-2.5 rounded-full'
                style={{ backgroundColor: c }}
              />
              <span className='truncate'>{n}</span>
            </div>
          ))}
          <div className='rounded-lg border border-amber-300/60 bg-amber-100/70 p-2 text-[10.5px] font-medium text-amber-800'>
            ⚠ 1 conflict today
          </div>
        </div>
        <div className='relative h-[330px]'>
          <div className='grid grid-cols-5 border-b border-[#cbeff8] text-center text-[11px] font-semibold'>
            {cols.map((c, i) => (
              <div key={c} className={cn('py-2', i === 3 && 'text-[#0891b2]')}>
                {c}
              </div>
            ))}
          </div>
          <div className='relative grid h-[290px] grid-cols-5'>
            {cols.map((c) => (
              <div key={c} className='border-l border-[#cbeff8]/70'>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className='h-[58px] border-b border-[#cbeff8]/50'
                  />
                ))}
              </div>
            ))}
            {blocks.map(([col, top, h, side, color, title]) => (
              <div
                key={title}
                className='absolute overflow-hidden rounded-md px-1.5 py-1 text-[10px] font-semibold'
                style={{
                  left: `calc(${col * 20}% + ${side ? '50%' : '3px'})`,
                  width: `calc(20% - ${side ? 'calc(50% + 3px)' : '6px'} - ${side ? '0px' : '0px'})`,
                  top: top * 58,
                  height: h * 58 - 3,
                  backgroundColor: `${color}2e`,
                  borderLeft: `3px solid ${color}`,
                  outline: col === 3 ? '2px solid #f59e0b' : undefined
                }}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
