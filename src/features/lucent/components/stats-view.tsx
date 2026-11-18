'use client';

import { IconChevronLeft, IconChevronRight, IconFlame, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TAGS } from '../core/defaults';
import { buildChart, computeStreaks, dayKey, rangeFor, shiftAnchor, totalsFor, type FilterTime } from '../core/stats';
import { formatDuration } from '../core/timer';
import { useLucent } from '../state/lucent-provider';

const FILTERS: FilterTime[] = ['week', 'month', 'year'];

function rangeLabel(filter: FilterTime, anchor: Date, locale?: string) {
  const { from, to } = rangeFor(filter, anchor);
  if (filter === 'year') return String(from.getFullYear());
  if (filter === 'month') return from.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const last = new Date(to.getTime() - 86_400_000);
  return `${from.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${last.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

const Stat = ({ label, value, className }: { label: string; value: string | number; className?: string }) => (
  <div className={cn('bg-card rounded-xl border p-4', className)}>
    <div className='text-muted-foreground text-xs'>{label}</div>
    <div className='mt-1 text-2xl font-semibold tabular-nums'>{value}</div>
  </div>
);

export function StatsView() {
  const t = useTranslations('lucent-web');
  const { data, dispatch } = useLucent();
  const [filter, setFilter] = useState<FilterTime>('week');
  const [anchor, setAnchor] = useState(() => new Date());

  const range = useMemo(() => rangeFor(filter, anchor), [filter, anchor]);
  const chart = useMemo(() => buildChart(data.sessions, filter, anchor), [data.sessions, filter, anchor]);
  const totals = useMemo(() => totalsFor(data.sessions, data.interruptions, range), [data.sessions, data.interruptions, range]);
  const streaks = useMemo(() => computeStreaks(data.sessions), [data.sessions]);
  const list = useMemo(
    () =>
      data.sessions
        .filter((s) => s.createdAt >= range.from.getTime() && s.createdAt < range.to.getTime())
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50),
    [data.sessions, range]
  );
  const hasData = chart.some((c) => c.minutes > 0);
  const today = dayKey(new Date());
  const hot = new Set(streaks.activeDays);
  const maxMinutes = Math.max(...chart.map((c) => c.minutes), 1);

  return (
    <div className='mx-auto w-full max-w-4xl space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='bg-muted flex rounded-lg p-1 text-sm'>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setAnchor(new Date());
              }}
              className={cn('rounded-md px-3 py-1 font-medium', filter === f ? 'bg-background shadow-sm' : 'text-muted-foreground')}
            >
              {t(`stats.${f}`)}
            </button>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <Button size='icon' variant='outline' aria-label='Previous' onClick={() => setAnchor((a) => shiftAnchor(filter, a, -1))}>
            <IconChevronLeft />
          </Button>
          <span className='min-w-44 text-center text-sm font-medium'>{rangeLabel(filter, anchor)}</span>
          <Button size='icon' variant='outline' aria-label='Next' onClick={() => setAnchor((a) => shiftAnchor(filter, a, 1))}>
            <IconChevronRight />
          </Button>
        </div>
      </div>

      <div className='bg-card rounded-xl border p-4'>
        <h2 className='mb-3 text-sm font-semibold'>{t('stats.chart')}</h2>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chart} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' opacity={0.4} />
              <XAxis dataKey='label' tickLine={false} axisLine={false} fontSize={11} interval={filter === 'month' ? 2 : 0} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(34,211,238,0.12)' }} formatter={(v: number) => [t('stats.min', { n: v }), t('stats.focus')]} />
              <Bar dataKey='minutes' radius={[8, 8, 0, 0]}>
                {chart.map((c) => (
                  <Cell key={c.key} fill={c.minutes === maxMinutes && c.minutes > 0 ? '#f59e0b' : '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!hasData && <p className='text-muted-foreground -mt-40 mb-32 text-center text-sm'>{t('stats.noSessions')}</p>}
      </div>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <Stat label={`${t('stats.focus')} · ${t('stats.started')}`} value={totals.focusStarted} />
        <Stat label={`${t('stats.focus')} · ${t('stats.completed')}`} value={totals.focusCompleted} />
        <Stat label={t('stats.totalTime')} value={formatDuration(totals.focusSeconds)} />
        <Stat label={t('stats.interruptions')} value={totals.interruptions} />
        <Stat label={`${t('stats.breaks')} · ${t('stats.completed')}`} value={totals.breakCompleted} />
        <Stat label={`${t('stats.breaks')} · ${t('stats.totalTime')}`} value={formatDuration(totals.breakSeconds)} />
        <Stat label={t('stats.tasksDone')} value={data.todos.filter((x) => x.isCompleted).length} />
        <div className='bg-card flex items-center gap-3 rounded-xl border p-4'>
          <span className='flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
            <IconFlame className='size-5' />
          </span>
          <div>
            <div className='text-xl leading-tight font-semibold'>{t('stats.days', { n: streaks.current })}</div>
            <div className='text-muted-foreground text-xs'>{t('stats.current')} · {t('stats.longest')}: {streaks.longest}</div>
          </div>
        </div>
      </div>

      <div className='bg-card rounded-xl border p-4'>
        <h2 className='mb-3 text-sm font-semibold'>{t('stats.streak')}</h2>
        <div className='flex flex-wrap gap-1.5'>
          {Array.from({ length: 56 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (55 - i));
            const k = dayKey(d);
            return (
              <span
                key={k}
                title={k}
                className={cn('size-5 rounded-md', hot.has(k) ? 'bg-[#06b6d4]' : 'bg-muted', k === today && 'ring-2 ring-[#f59e0b]')}
              />
            );
          })}
        </div>
      </div>

      <div className='bg-card rounded-xl border'>
        <h2 className='border-b p-4 text-sm font-semibold'>{t('stats.sessions')}</h2>
        {list.length === 0 ? (
          <p className='text-muted-foreground p-6 text-center text-sm'>{t('stats.noSessions')}</p>
        ) : (
          <ul className='divide-y'>
            {list.map((s) => {
              const tag = TAGS.find((g) => g.id === s.tagId);
              return (
                <li key={s.id} className='flex items-center gap-3 px-4 py-2.5 text-sm'>
                  <span className={cn('size-2.5 shrink-0 rounded-full', s.status === 'focus' ? 'bg-[#06b6d4]' : 'bg-emerald-400')} />
                  <div className='min-w-0 flex-1'>
                    <div className={cn('truncate font-medium', !s.isCompleted && 'text-muted-foreground')}>{s.name}</div>
                    <div className='text-muted-foreground text-xs'>
                      {new Date(s.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  {tag && <Badge variant='outline'>{tag.name}</Badge>}
                  <span className='text-muted-foreground w-14 text-right tabular-nums'>{formatDuration(s.duration)}</span>
                  <Badge variant={s.isCompleted ? 'secondary' : 'outline'}>{s.isCompleted ? t('stats.completed') : '—'}</Badge>
                  <Button size='icon' variant='ghost' className='size-8' aria-label={t('stats.remove')} onClick={() => dispatch({ type: 'deleteSession', id: s.id })}>
                    <IconTrash className='size-4' />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
