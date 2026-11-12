'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  addDays,
  dayKey,
  isSameDay,
  startOfMonth,
  startOfWeek
} from '../../core/utils/time';
import { FALLBACK_COLOR, timeLabel, tint } from '../../lib/datetime';
import type { ViewProps } from './types';

const MAX_CHIPS = 3;

export function MonthView({
  month,
  events,
  sourceOf,
  conflictedIds,
  onEventClick,
  onDayClick
}: ViewProps & { month: Date; onDayClick: (d: Date) => void }) {
  const t = useTranslations('meet');
  const first = startOfMonth(month);

  const { cells, byDay } = useMemo(() => {
    const gridStart = startOfWeek(first);
    const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    const byDay = new Map<string, typeof events>();
    for (const e of events) {
      // an event shows on every day it covers (all-day events end at the next midnight)
      for (const d of cells) {
        const s = d.getTime();
        const en = addDays(d, 1).getTime();
        if (e.startTime.getTime() < en && e.endTime.getTime() > s) {
          byDay.set(dayKey(d), [...(byDay.get(dayKey(d)) ?? []), e]);
        }
      }
    }
    for (const list of byDay.values()) {
      list.sort(
        (a, b) =>
          Number(b.isAllDay) - Number(a.isAllDay) ||
          a.startTime.getTime() - b.startTime.getTime()
      );
    }
    return { cells, byDay };
  }, [first, events]);

  const weekdays = cells.slice(0, 7);

  return (
    <div className='bg-card overflow-hidden rounded-xl border'>
      <div className='grid grid-cols-7 border-b'>
        {weekdays.map((d) => (
          <div
            key={d.toISOString()}
            className='text-muted-foreground px-2 py-2 text-center text-xs uppercase'
          >
            {d.toLocaleDateString(undefined, { weekday: 'short' })}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7'>
        {cells.map((d) => {
          const inMonth = d.getMonth() === first.getMonth();
          const today = isSameDay(d, new Date());
          const list = byDay.get(dayKey(d)) ?? [];
          return (
            <div
              key={d.toISOString()}
              onClick={() => onDayClick(d)}
              className={cn(
                'hover:bg-muted/40 min-h-[104px] cursor-pointer border-t border-l p-1.5 transition-colors first:border-l-0 [&:nth-child(7n+1)]:border-l-0',
                !inMonth && 'bg-muted/20 text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'mb-1 flex size-6 items-center justify-center rounded-full text-xs font-medium',
                  today && 'bg-primary text-primary-foreground'
                )}
              >
                {d.getDate()}
              </div>
              <div className='space-y-0.5'>
                {list.slice(0, MAX_CHIPS).map((e) => {
                  const color = sourceOf(e)?.colorHex ?? FALLBACK_COLOR;
                  return (
                    <button
                      key={e.eventId}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick(e);
                      }}
                      className={cn(
                        'flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] leading-tight',
                        conflictedIds.has(e.eventId) && 'ring-1 ring-amber-500'
                      )}
                      style={{ backgroundColor: tint(color, 0.18) }}
                    >
                      <span
                        className='size-1.5 shrink-0 rounded-full'
                        style={{ backgroundColor: color }}
                      />
                      {!e.isAllDay && (
                        <span className='text-muted-foreground shrink-0'>
                          {timeLabel(e.startTime)}
                        </span>
                      )}
                      <span className='truncate font-medium'>
                        {e.title || t('event.untitled')}
                      </span>
                    </button>
                  );
                })}
                {list.length > MAX_CHIPS && (
                  <div className='text-muted-foreground px-1 text-[11px]'>
                    {t('event.more', { count: list.length - MAX_CHIPS })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
