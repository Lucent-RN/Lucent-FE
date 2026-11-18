import {
  IconArrowUp,
  IconBook2,
  IconCalendar,
  IconChartBar,
  IconFlame,
  IconList,
  IconPlayerPause,
  IconPlus,
  IconSettings,
  IconSparkles
} from '@tabler/icons-react';
import { OrbitRing } from '@/components/brand/orbit-ring';
import { OrbitTabIcon } from '@/components/brand/orbit-system';
import { cn } from '@/lib/utils';
import { Cosmos, Dots, PlayButton } from '../screens';
import { Bars, Card, Chip, Segmented, TabletScreen } from './ui';

const SideNav = ({ items, active, dark = false, brand }: { items: Array<[React.ReactNode, string]>; active: number; dark?: boolean; brand: string }) => (
  <div className={cn('absolute inset-y-0 left-0 w-[150px] space-y-1 border-r p-3 pt-8', dark ? 'border-white/10 bg-white/5' : 'border-[#cbeff8] bg-white/70')}>
    <div className='mb-3 flex items-center gap-2 px-2 text-[13px] font-semibold'>
      <OrbitTabIcon size={26} />
      {brand}
    </div>
    {items.map(([icon, label], i) => (
      <div
        key={label}
        className={cn(
          'flex items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] font-semibold',
          i === active ? (dark ? 'bg-white/10' : 'bg-[#e4f7fb] text-[#0e7490]') : 'opacity-70'
        )}
      >
        {icon}
        {label}
      </div>
    ))}
  </div>
);

// ───────────────────────── Lucent ─────────────────────────

const lucentNav: Array<[React.ReactNode, string]> = [
  [<IconChartBar key='a' className='size-4' />, 'Statistic'],
  [<IconBook2 key='b' className='size-4' />, 'Timer'],
  [<IconSettings key='c' className='size-4' />, 'Settings']
];

export function TimerTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='Lucent' items={lucentNav} active={1} />
      <div className='absolute top-8 right-6 left-[170px] flex items-center justify-between'>
        <Chip tone='active'><IconBook2 className='size-4' /> Study</Chip>
        <span className='flex size-9 items-center justify-center rounded-full border border-[#cbeff8] bg-white'><IconList className='size-4' /></span>
      </div>
      <Card className='absolute top-[88px] right-6 left-[170px] flex items-center gap-3 px-4 py-3'>
        <span className='flex size-9 items-center justify-center rounded-full border-2 border-[#0e7490] text-[#0e7490]'><IconPlus className='size-4' /></span>
        <span>
          <span className='block text-[14px] font-semibold'>Write the proposal</span>
          <span className='block text-[11.5px] text-[#3d7a8e]'>30 min · 0/4 sessions</span>
        </span>
      </Card>
      <div className='absolute top-[190px] left-[170px] flex w-[410px] justify-center'>
        <OrbitRing progress={0.62} size={400}>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[50px] leading-none font-semibold tracking-tight'>24:59</span>
            <Dots />
          </div>
        </OrbitRing>
      </div>
      <div className='absolute bottom-16 left-[170px] flex w-[410px] justify-center'>
        <PlayButton />
      </div>
    </TabletScreen>
  );
}

export function FocusTablet() {
  return (
    <TabletScreen className='text-[#e4f7fb]'>
      <Cosmos />
      <div className='absolute inset-x-0 top-12 text-center text-[13px] font-semibold tracking-[0.35em] text-[#a5e3f4] uppercase'>Focus</div>
      <div className='absolute top-[130px] left-1/2 -translate-x-1/2'>
        <OrbitRing progress={0.38} size={500} dark>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[62px] leading-none font-semibold tracking-tight'>18:42</span>
            <Dots dark active={1} />
          </div>
        </OrbitRing>
      </div>
      <div className='absolute bottom-24 left-1/2 -translate-x-1/2'><PlayButton pause /></div>
      <div className='absolute inset-x-0 bottom-9 flex justify-center'>
        <Chip className='!border-[#22d3ee]/30 !bg-white/5 !text-[#e4f7fb]'>
          <span className='size-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' /> Stay focused
        </Chip>
      </div>
    </TabletScreen>
  );
}

export function StatsTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='Lucent' items={lucentNav} active={0} />
      <div className='absolute top-8 right-6 left-[170px]'>
        <div className='flex items-end justify-between'>
          <div className='text-[30px] leading-tight font-semibold'>Statistic</div>
          <Segmented items={['Week', 'Month', 'Year']} active={0} className='w-[210px]' />
        </div>
        <div className='mt-1 text-[12px] font-semibold text-[#3d7a8e]'>9 – 15 November 2026</div>
        <Card className='mt-4 p-4'>
          <div className='mb-3 text-[14px] font-semibold'>Focus time</div>
          <Bars data={[0.5, 0.78, 0.35, 0.92, 0.6, 0.2, 0.12]} hot={[3]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} height={210} />
        </Card>
        <div className='mt-3 grid grid-cols-3 gap-3 text-center'>
          {[['Started', '14'], ['Completed', '12'], ['Total time', '6h 40m']].map(([l, v]) => (
            <Card key={l} className='py-3'>
              <div className='text-[20px] font-semibold text-[#0e7490]'>{v}</div>
              <div className='text-[11px] text-[#3d7a8e]'>{l}</div>
            </Card>
          ))}
        </div>
        <Card className='mt-3 divide-y divide-[#e4f7fb]'>
          <div className='px-4 py-2.5 text-[13px] font-semibold'>Recent sessions</div>
          {[['Write the proposal', 'Work', '25 min'], ['Read chapter 7', 'Study', '25 min'], ['Morning run', 'Health', '30 min']].map(([t, tag, m]) => (
            <div key={t} className='flex items-center gap-3 px-4 py-2.5 text-[12.5px]'>
              <span className='flex-1 font-semibold'>{t}</span>
              <Chip className='!px-2 !py-0.5 !text-[10px]'>{tag}</Chip>
              <span className='w-14 text-right tabular-nums text-[#3d7a8e]'>{m}</span>
            </div>
          ))}
        </Card>
        <Card className='mt-3 flex items-center gap-3 p-3.5'>
          <span className='flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600'><IconFlame className='size-5' /></span>
          <span className='flex-1'>
            <span className='block text-[14px] font-semibold'>5-day streak</span>
            <span className='block text-[11.5px] text-[#3d7a8e]'>Longest: 12 days</span>
          </span>
        </Card>
      </div>
    </TabletScreen>
  );
}

export function LucentSettingsTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='Lucent' items={lucentNav} active={2} />
      <div className='absolute top-8 right-6 left-[170px] space-y-3'>
        <div className='text-[30px] leading-tight font-semibold'>Settings</div>
        <Card className='p-4'>
          <div className='mb-2 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Appearance</div>
          <Segmented items={['Light', 'Dark', 'System']} active={1} />
        </Card>
        <Card className='p-4'>
          <div className='mb-2 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>Language</div>
          <div className='flex flex-wrap gap-2'>
            <Chip tone='active'>English ✓</Chip><Chip>Tiếng Việt</Chip><Chip>日本語</Chip><Chip>Deutsch</Chip>
          </div>
        </Card>
        <Card className='divide-y divide-[#e4f7fb]'>
          {['Focus mode', 'Reminders', 'Sounds'].map((l, i) => (
            <div key={l} className='flex items-center gap-3 px-4 py-3.5 text-[14px] font-semibold'>
              <span className='flex-1'>{l}</span>
              <span className={cn('flex h-5 w-9 items-center rounded-full px-0.5', i < 2 ? 'justify-end bg-[#06b6d4]' : 'bg-[#cbeff8]')}><span className='size-4 rounded-full bg-white shadow' /></span>
            </div>
          ))}
        </Card>
      </div>
    </TabletScreen>
  );
}

// ───────────────────────── LucentMeet ─────────────────────────

const meetNav: Array<[React.ReactNode, string]> = [
  [<IconCalendar key='a' className='size-4' />, 'Calendar'],
  [<IconSparkles key='b' className='size-4' />, 'Assistant'],
  [<IconSettings key='c' className='size-4' />, 'Settings']
];

const COLS = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13'];
const BLOCKS: Array<[number, number, number, string, string, boolean?]> = [
  [0, 0.5, 1, '#4285F4', 'Roadmap sync'],
  [0, 3.2, 1, '#F59E0B', 'Lunch'],
  [1, 1.1, 1.4, '#4285F4', 'Customer call'],
  [2, 2.2, 1.6, '#A855F7', 'Piano'],
  [3, 1.2, 1.1, '#4285F4', 'Review', true],
  [3, 1.7, 1.1, '#10B981', 'Sprint', true],
  [3, 3.6, 0.9, '#4285F4', '1:1'],
  [4, 0.9, 2, '#4285F4', 'Planning'],
  [4, 3.4, 1, '#10B981', 'Retro']
];

const WeekGrid = ({ height }: { height: number }) => {
  const row = height / 6;
  return (
    <div className='overflow-hidden rounded-2xl border border-[#cbeff8] bg-white'>
      <div className='grid grid-cols-5 border-b border-[#cbeff8] text-center text-[11.5px] font-semibold'>
        {COLS.map((c, i) => <div key={c} className={cn('py-2', i === 3 && 'text-[#0891b2]')}>{c}</div>)}
      </div>
      <div className='relative grid grid-cols-5' style={{ height }}>
        {COLS.map((c) => (
          <div key={c} className='border-l border-[#cbeff8]/70 first:border-l-0'>
            {Array.from({ length: 6 }, (_, n) => <div key={n} className='border-b border-[#cbeff8]/50' style={{ height: row }} />)}
          </div>
        ))}
        {BLOCKS.map(([col, top, h, color, title, hot]) => (
          <div
            key={title}
            className='absolute overflow-hidden rounded-md px-1.5 py-1 text-[10px] font-semibold'
            style={{
              left: `calc(${col * 20}% + ${title === 'Sprint' ? '16px' : '3px'})`,
              width: `calc(20% - ${title === 'Sprint' ? '22px' : '6px'})`,
              top: top * row,
              height: h * row - 3,
              backgroundColor: `${color}2e`,
              borderLeft: `3px solid ${color}`,
              outline: hot ? '2px solid #f59e0b' : undefined
            }}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export function CalendarTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='LucentMeet' items={meetNav} active={0} />
      <div className='absolute top-8 right-5 left-[166px]'>
        <div className='flex items-end justify-between'>
          <div>
            <div className='text-[11px] font-semibold tracking-[0.2em] text-[#0891b2] uppercase'>Thursday</div>
            <div className='text-[28px] leading-tight font-semibold'>12 November</div>
          </div>
          <Segmented items={['Agenda', 'Week', 'Month']} active={1} className='w-[210px]' />
        </div>
        <div className='mt-4'><WeekGrid height={420} /></div>
        <div className='mt-3 flex flex-wrap gap-2'>
          {[['you@company.com', '#4285F4'], ['you@gmail.com', '#F59E0B'], ['iCloud', '#A855F7'], ['Team', '#10B981']].map(([n, c]) => (
            <Chip key={n}><span className='size-2 rounded-full' style={{ backgroundColor: c }} />{n}</Chip>
          ))}
        </div>
        <Chip tone='amber' className='mt-3'>⚠ 1 conflict today</Chip>
      </div>
    </TabletScreen>
  );
}

export function ConflictTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='LucentMeet' items={meetNav} active={0} />
      <div className='absolute top-8 right-5 left-[166px]'>
        <div className='text-[22px] leading-tight font-semibold'>Design review</div>
        <div className='mb-3 text-[12px] text-[#3d7a8e]'>Thu 12 Nov · 10:15 – 11:00 · Work</div>
        <WeekGrid height={250} />
        <div className='mt-3 rounded-2xl border border-red-300/60 bg-red-50 p-3.5'>
          <div className='text-[12px] font-bold text-red-700'>Overlaps “Sprint planning” · Too close to “Daily stand-up”</div>
        </div>
        <div className='mt-3 mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#3d7a8e] uppercase'>
          <IconSparkles className='size-3.5 text-[#06b6d4]' /> Suggested new times
        </div>
        <div className='grid grid-cols-3 gap-2'>
          {['Thu 11:30 – 12:15', 'Thu 14:30 – 15:15', 'Fri 09:30 – 10:15'].map((s, i) => (
            <div key={s} className={cn('rounded-xl border px-2 py-2.5 text-center text-[12px] font-semibold', i === 0 ? 'border-[#06b6d4] bg-[#e4f7fb] text-[#0e7490]' : 'border-[#cbeff8] bg-white')}>{s}</div>
          ))}
        </div>
        <div className='mt-3 rounded-xl bg-[#06b6d4] py-3 text-center text-[14px] font-semibold text-white'>Move to Thu 11:30</div>
      </div>
    </TabletScreen>
  );
}

export function ReportTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <div className='absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(34,211,238,0.2),transparent)]' />
      <SideNav brand='LucentMeet' items={meetNav} active={2} />
      <div className='absolute top-8 right-5 left-[166px]'>
        <div className='text-[28px] leading-tight font-semibold'>Weekly report</div>
        <div className='mb-3 text-[12px] text-[#3d7a8e]'>9 – 15 Nov</div>
        <div className='grid grid-cols-2 gap-2.5'>
          {[['Meeting time', '14h 30m'], ['Meetings', '18'], ['Free in work hours', '25h'], ['Longest free stretch', '3h 15m']].map(([l, v]) => (
            <Card key={l} className='px-3.5 py-3'>
              <div className='text-[11px] text-[#3d7a8e]'>{l}</div>
              <div className='text-[22px] font-semibold'>{v}</div>
            </Card>
          ))}
        </div>
        <Card className='mt-3 p-4'>
          <div className='mb-3 text-[13px] font-semibold'>By day</div>
          <Bars data={[0.55, 0.7, 0.4, 0.95, 0.5, 0.08, 0.04]} hot={[3]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} height={170} />
        </Card>
        <Card className='mt-3 space-y-1.5 p-4 text-[12.5px]'>
          <div className='text-[13px] font-semibold'>Insights</div>
          <div className='text-red-700'>• 1 unresolved conflict this week</div>
          <div className='text-amber-700'>• Thursday is over 75% booked</div>
          <div>• Protect a focus block on Wednesday</div>
        </Card>
      </div>
    </TabletScreen>
  );
}

export function AssistantTablet() {
  return (
    <TabletScreen className='bg-[#f2fbfd] text-[#062c3b]'>
      <SideNav brand='LucentMeet' items={meetNav} active={1} />
      <div className='absolute top-8 right-5 left-[166px] flex items-center gap-3 border-b border-[#cbeff8] pb-3'>
        <span className='flex size-10 items-center justify-center rounded-full bg-[#06b6d4] text-white'><IconSparkles className='size-5' /></span>
        <span>
          <span className='block text-[16px] font-semibold'>AI Assistant</span>
          <span className='block text-[11.5px] text-[#3d7a8e]'>Your calendar, by conversation</span>
        </span>
      </div>
      <div className='absolute top-[110px] right-5 left-[166px] space-y-4'>
        <div className='ml-auto w-fit max-w-[70%] rounded-2xl rounded-br-sm bg-[#06b6d4] px-4 py-2.5 text-[14px] text-white'>Find 30 minutes tomorrow afternoon</div>
        <div className='flex items-start gap-2.5'>
          <span className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#06b6d4] text-white'><IconSparkles className='size-4' /></span>
          <div className='space-y-2.5'>
            <div className='rounded-2xl rounded-tl-sm border border-[#cbeff8] bg-white px-4 py-2.5 text-[14px]'>You’re free from 3:00 PM. Here’s a focus block. Confirm and I’ll add it.</div>
            <Card className='space-y-1 p-3.5'>
              <div className='text-[10px] font-bold tracking-wide text-[#3d7a8e] uppercase'>New event</div>
              <div className='text-[16px] font-semibold'>Focus block</div>
              <div className='text-[12.5px] text-[#3d7a8e]'>Fri 13 Nov · 3:00 – 3:30 PM · Work</div>
              <div className='flex gap-2 pt-2 text-[13px] font-semibold'>
                <span className='flex-1 rounded-lg bg-[#06b6d4] py-2 text-center text-white'>Confirm</span>
                <span className='flex-1 rounded-lg py-2 text-center text-[#3d7a8e]'>Dismiss</span>
              </div>
            </Card>
          </div>
        </div>
        <div className='ml-auto w-fit rounded-2xl rounded-br-sm bg-[#06b6d4] px-4 py-2.5 text-[14px] text-white'>Any conflicts next week?</div>
      </div>
      <div className='absolute right-5 bottom-8 left-[166px] flex items-center gap-2 rounded-full border border-[#cbeff8] bg-white py-1.5 pr-1.5 pl-5 text-[14px] text-[#3d7a8e]'>
        <span className='flex-1'>Ask about your schedule…</span>
        <span className='flex size-10 items-center justify-center rounded-full bg-[#06b6d4] text-white'><IconArrowUp className='size-5' /></span>
      </div>
    </TabletScreen>
  );
}

export { IconPlayerPause };
