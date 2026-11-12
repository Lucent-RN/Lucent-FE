'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { addDays, dayKey, isSameDay } from '../../core/utils/time';
import { dayLabel, FALLBACK_COLOR, rangeLabel } from '../../lib/datetime';
import type { ViewProps } from './types';

export function AgendaView({
  from,
  days = 30,
  events,
  sourceOf,
  conflictedIds,
  onEventClick
}: ViewProps & { from: Date; days?: number }) {
  const t = useTranslations('meet');

  const groups = useMemo(() => {
    const out: Array<{ day: Date; items: typeof events }> = [];
    for (let i = 0; i < days; i++) {
      const day = addDays(from, i);
      const s = day.getTime();
      const en = addDays(day, 1).getTime();
      const items = events
        .filter((e) => e.startTime.getTime() < en && e.endTime.getTime() > s)
        .sort(
          (a, b) =>
            Number(b.isAllDay) - Number(a.isAllDay) ||
            a.startTime.getTime() - b.startTime.getTime()
        );
      if (items.length) out.push({ day, items });
    }
    return out;
  }, [from, days, events]);

  if (groups.length === 0) {
    return (
      <div className='text-muted-foreground bg-card flex min-h-[260px] items-center justify-center rounded-xl border text-sm'>
        {t('event.noEvents')}
      </div>
    );
  }

  return (
    <div className='bg-card divide-y rounded-xl border'>
      {groups.map(({ day, items }) => (
        <section
          key={dayKey(day)}
          className='grid gap-3 p-4 md:grid-cols-[180px_1fr]'
        >
          <h3
            className={cn(
              'text-sm font-semibold',
              isSameDay(day, new Date()) && 'text-primary'
            )}
          >
            {dayLabel(day)}
          </h3>
          <ul className='space-y-1.5'>
            {items.map((e) => {
              const source = sourceOf(e);
              const color = source?.colorHex ?? FALLBACK_COLOR;
              return (
                <li key={e.eventId}>
                  <button
                    onClick={() => onEventClick(e)}
                    className='hover:bg-muted/60 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors'
                  >
                    <span
                      className='h-9 w-1 shrink-0 rounded-full'
                      style={{ backgroundColor: color }}
                    />
                    <span className='text-muted-foreground w-28 shrink-0 text-sm tabular-nums'>
                      {rangeLabel(
                        e.startTime,
                        e.endTime,
                        e.isAllDay,
                        t('event.allDay')
                      )}
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className='block truncate text-sm font-medium'>
                        {e.title || t('event.untitled')}
                      </span>
                      <span className='text-muted-foreground block truncate text-xs'>
                        {[e.location, source?.calendarName]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    {conflictedIds.has(e.eventId) && (
                      <Badge
                        variant='outline'
                        className='border-amber-500 text-amber-600'
                      >
                        !
                      </Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
