import {
  IconCalendar,
  IconCheck,
  IconChartBar,
  IconClockHour4,
  IconFlame,
  IconPlayerPlay,
  IconPlus,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconBell,
  IconMoon,
  IconSun,
  IconDeviceMobile,
  IconShare2
} from '@tabler/icons-react';
import { OrbitTabIcon } from '@/components/brand/orbit-system';
import { cn } from '@/lib/utils';
import { Screen, TabBar } from '../screens';
import { Bars, Card, Chip, Segmented } from './ui';

const Glow = () => (
  <div className='absolute inset-x-0 top-0 h-44 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(34,211,238,0.18),transparent)]' />
);

const lucentTabs = (active: number) => (
  <TabBar
    active={active}
    items={[
      <IconChartBar key='a' className='size-5' />,
      <OrbitTabIcon key='b' size={30} />,
      <IconSettings key='c' className='size-5' />
    ]}
  />
);

// ───────────────────────── Lucent ─────────────────────────

export function StatsScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12'>
        <div className='text-[26px] leading-tight font-semibold'>Statistic</div>
        <Segmented items={['Week', 'Month', 'Year']} active={0} className='mt-3' />
        <div className='mt-3 flex items-center justify-between text-[12px] font-semibold'>
          <span className='flex size-7 items-center justify-center rounded-full border border-[#cbeff8] bg-white'>‹</span>
          9 – 15 November 2026
          <span className='flex size-7 items-center justify-center rounded-full border border-[#cbeff8] bg-white'>›</span>
        </div>
      </div>
      <div className='absolute inset-x-5 top-[178px]'>
        <div className='mb-2 text-[13px] font-semibold'>Focus time</div>
        <Card className='p-3'>
          <Bars
            data={[0.5, 0.78, 0.35, 0.92, 0.6, 0.2, 0.12]}
            hot={[3]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            height={118}
          />
        </Card>
        <div className='mt-3 grid grid-cols-3 gap-2 text-center'>
          {[
            ['Started', '14'],
            ['Completed', '12'],
            ['Total', '6h 40m']
          ].map(([l, v]) => (
            <Card key={l} className='px-1 py-2.5'>
              <div className='text-[15px] font-semibold text-[#0e7490]'>{v}</div>
              <div className='text-[10px] text-[#3d7a8e]'>{l}</div>
            </Card>
          ))}
        </div>
        <Card className='mt-3 flex items-center gap-3 p-3'>
          <span className='flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
            <IconFlame className='size-5' />
          </span>
          <span>
            <span className='block text-[13px] font-semibold'>5-day streak</span>
            <span className='block text-[11px] text-[#3d7a8e]'>Longest: 12 days</span>
          </span>
        </Card>
      </div>
      {lucentTabs(0)}
    </Screen>
  );
}

const TASKS = [
  { t: 'Write the proposal', tag: 'Work', done: 2, total: 4, active: true },
  { t: 'Read chapter 7', tag: 'Study', done: 1, total: 3 },
  { t: 'Morning run', tag: 'Health', done: 1, total: 1, ticked: true },
  { t: 'Plan the week', tag: 'Work', done: 0, total: 2 }
];

export function TasksScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12 flex items-end justify-between'>
        <div>
          <div className='text-[26px] leading-tight font-semibold'>Tasks</div>
          <div className='text-[12px] text-[#3d7a8e]'>4 tasks · 8 sessions left</div>
        </div>
        <Chip tone='active'>Today</Chip>
      </div>
      <div className='absolute inset-x-4 top-[132px] space-y-2.5'>
        {TASKS.map((x) => (
          <Card
            key={x.t}
            className={cn(
              'flex items-center gap-3 px-3 py-3',
              x.active && 'border-[#06b6d4] shadow-[0_8px_22px_rgba(6,182,212,0.18)]'
            )}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                x.ticked
                  ? 'border-[#0891b2] bg-[#0891b2] text-white'
                  : 'border-[#0e7490] text-[#0e7490]'
              )}
            >
              {x.ticked ? <IconCheck className='size-4' /> : <IconPlus className='size-4' />}
            </span>
            <span className='min-w-0 flex-1'>
              <span className={cn('block truncate text-[13px] font-semibold', x.ticked && 'line-through opacity-60')}>
                {x.t}
              </span>
              <span className='mt-1 flex items-center gap-1.5'>
                <Chip className='!px-2 !py-0.5 !text-[10px]'>{x.tag}</Chip>
                <span className='flex gap-1'>
                  {Array.from({ length: x.total }, (_, i) => (
                    <span
                      key={i}
                      className={cn('size-1.5 rounded-full', i < x.done ? 'bg-[#06b6d4]' : 'bg-[#cbeff8]')}
                    />
                  ))}
                </span>
              </span>
            </span>
            {x.active && (
              <span className='flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#67e8f9] to-[#0891b2] text-white'>
                <IconPlayerPlay className='size-4 fill-white' />
              </span>
            )}
          </Card>
        ))}
      </div>
      {lucentTabs(1)}
    </Screen>
  );
}

export function LucentSettingsScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12 text-[26px] leading-tight font-semibold'>Settings</div>
      <div className='absolute inset-x-4 top-[104px] space-y-3'>
        <Card className='p-3'>
          <div className='mb-2 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Appearance</div>
          <div className='grid grid-cols-3 gap-2 text-[11px] font-semibold'>
            {[
              ['Light', IconSun, false],
              ['Dark', IconMoon, true],
              ['System', IconDeviceMobile, false]
            ].map(([l, Ico, on]) => {
              const I = Ico as typeof IconSun;
              return (
                <span
                  key={l as string}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border py-2.5',
                    on ? 'border-[#06b6d4] bg-[#e4f7fb] text-[#0e7490]' : 'border-[#cbeff8] bg-white'
                  )}
                >
                  <I className='size-5' />
                  {l as string}
                </span>
              );
            })}
          </div>
        </Card>
        <Card className='p-3'>
          <div className='mb-2 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Language</div>
          <div className='flex flex-wrap gap-1.5'>
            <Chip tone='active'>English ✓</Chip>
            <Chip>Tiếng Việt</Chip>
            <Chip>日本語</Chip>
            <Chip>Deutsch</Chip>
          </div>
        </Card>
        <Card className='divide-y divide-[#e4f7fb]'>
          {[
            ['Focus mode', IconClockHour4, true],
            ['Reminders', IconBell, true]
          ].map(([l, Ico, on]) => {
            const I = Ico as typeof IconBell;
            return (
              <div key={l as string} className='flex items-center gap-3 px-3 py-3 text-[13px] font-semibold'>
                <I className='size-5 text-[#0891b2]' />
                <span className='flex-1'>{l as string}</span>
                <span className={cn('flex h-5 w-9 items-center rounded-full px-0.5', on ? 'justify-end bg-[#06b6d4]' : 'bg-[#cbeff8]')}>
                  <span className='size-4 rounded-full bg-white shadow' />
                </span>
              </div>
            );
          })}
        </Card>
      </div>
      {lucentTabs(2)}
    </Screen>
  );
}

// ───────────────────────── LucentMeet ─────────────────────────

const meetTabs = (active: number) => (
  <TabBar
    active={active}
    items={[
      <IconCalendar key='a' className={cn('size-5', active === 0 && 'text-[#0891b2]')} />,
      <IconSparkles key='b' className={cn('size-5', active === 1 && 'text-[#0891b2]')} />,
      <IconSettings key='c' className={cn('size-5', active === 2 && 'text-[#0891b2]')} />
    ]}
  />
);

export function MeetSuggestScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12'>
        <div className='flex items-center gap-2'>
          <span className='h-8 w-1.5 rounded-full bg-[#4285F4]' />
          <div className='text-[22px] leading-tight font-semibold'>Design review</div>
        </div>
        <div className='mt-1 text-[12px] text-[#3d7a8e]'>Thu 12 Nov · 10:15 – 11:00 · Work</div>
      </div>
      <div className='absolute inset-x-4 top-[132px] space-y-3'>
        <div className='rounded-2xl border border-red-300/60 bg-red-50 p-3'>
          <div className='text-[11px] font-bold text-red-700'>Overlaps with another event</div>
          <div className='mt-2 flex items-center gap-2.5 rounded-xl border border-[#cbeff8] bg-white px-3 py-2'>
            <span className='h-8 w-1 rounded-full bg-[#10B981]' />
            <span>
              <span className='block text-[12.5px] font-semibold'>Sprint planning</span>
              <span className='block text-[10.5px] text-[#3d7a8e]'>10:30 – 11:30 · Team</span>
            </span>
          </div>
        </div>
        <div>
          <div className='mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>
            <IconSparkles className='size-3.5 text-[#06b6d4]' /> Suggested new times
          </div>
          <div className='space-y-2'>
            {['Thu · 11:30 – 12:15', 'Thu · 14:30 – 15:15', 'Fri · 09:30 – 10:15'].map((s, i) => (
              <div
                key={s}
                className={cn(
                  'rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold',
                  i === 0
                    ? 'border-[#06b6d4] bg-[#e4f7fb] text-[#0e7490]'
                    : 'border-[#cbeff8] bg-white'
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className='rounded-xl bg-[#06b6d4] py-3 text-center text-[14px] font-semibold text-white'>
          Move to Thu 11:30
        </div>
        <div className='text-center text-[12px] font-semibold text-[#3d7a8e]'>Keep both</div>
      </div>
    </Screen>
  );
}

export function MeetSlotsScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12'>
        <div className='text-[22px] leading-tight font-semibold'>Share free slots</div>
        <div className='text-[11.5px] text-[#3d7a8e]'>Auto-scanned from your calendars & working hours</div>
      </div>
      <div className='absolute inset-x-4 top-[122px] space-y-3'>
        <div>
          <div className='mb-1.5 text-[10px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Duration</div>
          <div className='flex gap-1.5'>
            {['15m', '30m', '45m', '60m'].map((d, i) => (
              <Chip key={d} tone={i === 1 ? 'active' : 'plain'} className='flex-1 justify-center'>{d}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className='mb-1.5 text-[10px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Time window</div>
          <Segmented items={['Next 3 days', 'This week', 'Next week']} active={1} />
        </div>
        <div>
          <div className='mb-1.5 text-[10px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Suggested slots</div>
          <div className='space-y-1.5'>
            {[
              ['Thu 12 Nov', '11:30 – 12:00', true],
              ['Thu 12 Nov', '15:00 – 15:30', true],
              ['Fri 13 Nov', '09:30 – 10:00', true],
              ['Mon 16 Nov', '14:00 – 14:30', false]
            ].map(([d, t, on]) => (
              <div key={t as string} className='flex items-center gap-2.5 rounded-xl border border-[#cbeff8] bg-white px-3 py-2 text-[12px]'>
                <span className={cn('flex size-5 items-center justify-center rounded-full border', on ? 'border-[#06b6d4] bg-[#06b6d4] text-white' : 'border-[#cbeff8]')}>
                  {on ? <IconCheck className='size-3' /> : null}
                </span>
                <span className='flex-1 font-semibold'>{d as string}</span>
                <span className='text-[#3d7a8e] tabular-nums'>{t as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='rounded-2xl rounded-bl-sm border border-[#cbeff8] bg-white p-3 text-[11.5px] leading-relaxed'>
          Hi! I’m free for 30 minutes at:
          <br />• Thu 12 Nov, 11:30 – 12:00
          <br />• Thu 12 Nov, 15:00 – 15:30
          <br />• Fri 13 Nov, 09:30 – 10:00
        </div>
        <div className='flex items-center justify-center gap-2 rounded-xl bg-[#06b6d4] py-3 text-[14px] font-semibold text-white'>
          <IconShare2 className='size-4' /> Share / Copy
        </div>
      </div>
    </Screen>
  );
}

export function MeetReportScreen() {
  return (
    <Screen className='bg-[#f2fbfd]'>
      <Glow />
      <div className='absolute inset-x-5 top-12'>
        <div className='text-[22px] leading-tight font-semibold'>Weekly report</div>
        <div className='text-[12px] text-[#3d7a8e]'>9 – 15 Nov</div>
      </div>
      <div className='absolute inset-x-4 top-[116px] space-y-3'>
        <div className='grid grid-cols-2 gap-2'>
          {[
            ['Meeting time', '14h 30m'],
            ['Meetings', '18'],
            ['Free in work hours', '25h'],
            ['Longest free stretch', '3h 15m']
          ].map(([l, v]) => (
            <Card key={l} className='px-3 py-2.5'>
              <div className='text-[10px] text-[#3d7a8e]'>{l}</div>
              <div className='text-[18px] font-semibold'>{v}</div>
            </Card>
          ))}
        </div>
        <Card className='p-3'>
          <div className='mb-2 text-[12px] font-semibold'>By day</div>
          <Bars
            data={[0.55, 0.7, 0.4, 0.95, 0.5, 0.08, 0.04]}
            hot={[3]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            height={96}
          />
          <div className='mt-1.5 text-[10.5px] text-[#3d7a8e]'>Busiest day: Thursday · 6h 50m</div>
        </Card>
        <Card className='space-y-1.5 p-3 text-[11.5px]'>
          <div className='text-[12px] font-semibold'>Insights</div>
          <div className='text-red-700'>• 1 unresolved conflict this week</div>
          <div className='text-amber-700'>• Thursday is over 75% booked</div>
          <div>• Protect a focus block on Wednesday</div>
        </Card>
      </div>
      {meetTabs(2)}
    </Screen>
  );
}

export { IconUsers };
