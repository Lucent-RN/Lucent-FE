'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { layoutDayEvents } from '../../core/layout/layout-day-events';
import {
  addDays,
  isSameDay,
  roundToStep,
  startOfDay
} from '../../core/utils/time';
import { FALLBACK_COLOR, rangeLabel, tint } from '../../lib/datetime';
import type { ViewProps } from './types';

const HOUR_PX = 52;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

export function WeekView({
  days,
  events,
  sourceOf,
  conflictedIds,
  onEventClick,
  onSlotClick
}: ViewProps & { days: Date[]; onSlotClick?: (start: Date) => void }) {
  const t = useTranslations('meet');
  const scroller = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Open at 8am and keep the "now" line current.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = HOUR_PX * 7.5;
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const columns = useMemo(
    () =>
      days.map((day) => ({
        day,
        allDay: events.filter(
          (e) =>
            e.isAllDay &&
            e.startTime.getTime() < addDays(day, 1).getTime() &&
            e.endTime.getTime() > day.getTime()
        ),
        timed: layoutDayEvents(events, day)
      })),
    [days, events]
  );
  const hasAllDay = columns.some((c) => c.allDay.length > 0);
  const gridCols = {
    gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))`
  };

  return (
    <div className='bg-card overflow-hidden rounded-xl border'>
      {/* day headers */}
      <div className='grid border-b' style={gridCols}>
        <div />
        {days.map((d) => {
          const today = isSameDay(d, new Date());
          return (
            <div
              key={d.toISOString()}
              className='border-l px-2 py-2 text-center'
            >
              <div className='text-muted-foreground text-xs uppercase'>
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div
                className={cn(
                  'mx-auto mt-0.5 flex size-8 items-center justify-center rounded-full text-sm font-semibold',
                  today && 'bg-primary text-primary-foreground'
                )}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {hasAllDay && (
        <div className='grid border-b' style={gridCols}>
          <div className='text-muted-foreground px-1 py-1 text-right text-[10px] uppercase'>
            {t('event.allDay')}
          </div>
          {columns.map((c) => (
            <div key={c.day.toISOString()} className='space-y-0.5 border-l p-1'>
              {c.allDay.map((e) => {
                const color = sourceOf(e)?.colorHex ?? FALLBACK_COLOR;
                return (
                  <button
                    key={e.eventId}
                    onClick={() => onEventClick(e)}
                    className='block w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium'
                    style={{
                      backgroundColor: tint(color, 0.3),
                      color: 'inherit',
                      borderLeft: `3px solid ${color}`
                    }}
                  >
                    {e.title || t('event.untitled')}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* time grid */}
      <div
        ref={scroller}
        className='relative max-h-[calc(100dvh-340px)] min-h-[420px] overflow-y-auto'
      >
        <div className='grid' style={{ ...gridCols, height: HOUR_PX * 24 }}>
          <div className='relative'>
            {HOURS.slice(1).map((h) => (
              <div
                key={h}
                className='text-muted-foreground absolute right-2 -translate-y-1/2 text-[10px]'
                style={{ top: h * HOUR_PX }}
              >
                {new Date(2000, 0, 1, h).toLocaleTimeString(undefined, {
                  hour: 'numeric'
                })}
              </div>
            ))}
          </div>

          {columns.map((c) => {
            const showNow = now && isSameDay(c.day, now);
            return (
              <div
                key={c.day.toISOString()}
                className='relative border-l'
                onClick={(ev) => {
                  if (!onSlotClick) return;
                  const rect = ev.currentTarget.getBoundingClientRect();
                  const minutes = ((ev.clientY - rect.top) / HOUR_PX) * 60;
                  const start = roundToStep(
                    new Date(startOfDay(c.day).getTime() + minutes * 60_000),
                    30
                  );
                  onSlotClick(start);
                }}
              >
                {HOURS.slice(1).map((h) => (
                  <div
                    key={h}
                    className='border-border/60 absolute inset-x-0 border-t'
                    style={{ top: h * HOUR_PX }}
                  />
                ))}

                {c.timed.map((p) => {
                  const source = sourceOf(p.event);
                  const color = source?.colorHex ?? FALLBACK_COLOR;
                  const conflicted = conflictedIds.has(p.event.eventId);
                  const width = 100 / p.columns;
                  return (
                    <button
                      key={p.event.eventId}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick(p.event);
                      }}
                      className={cn(
                        'absolute overflow-hidden rounded-md px-1.5 py-1 text-left text-xs leading-tight transition-shadow hover:shadow-md',
                        conflicted && 'ring-2 ring-amber-500'
                      )}
                      style={{
                        top: (p.topMin / 60) * HOUR_PX,
                        height: Math.max((p.heightMin / 60) * HOUR_PX - 2, 18),
                        left: `calc(${p.column * width}% + 2px)`,
                        width: `calc(${width}% - 4px)`,
                        backgroundColor: tint(color, 0.22),
                        borderLeft: `3px solid ${color}`
                      }}
                    >
                      <div className='truncate font-semibold'>
                        {p.event.title || t('event.untitled')}
                      </div>
                      <div className='text-muted-foreground truncate text-[10px]'>
                        {rangeLabel(
                          p.event.startTime,
                          p.event.endTime,
                          false,
                          ''
                        )}
                      </div>
                    </button>
                  );
                })}

                {showNow && (
                  <div
                    className='pointer-events-none absolute inset-x-0 z-10 flex items-center'
                    style={{
                      top:
                        ((now.getHours() * 60 + now.getMinutes()) / 60) *
                        HOUR_PX
                    }}
                  >
                    <span className='size-2 -translate-x-1 rounded-full bg-red-500' />
                    <span className='h-px flex-1 bg-red-500' />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
