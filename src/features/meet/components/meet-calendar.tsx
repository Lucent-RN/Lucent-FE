'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../core/domain';
import {
  addDays,
  startOfDay,
  startOfMonth,
  startOfWeek
} from '../core/utils/time';
import { useMeet } from '../state/meet-provider';
import { CalendarsPanel } from './calendars-panel';
import { ConflictsPanel } from './conflicts-panel';
import { EventDetailsDialog } from './event-details-dialog';
import { EventEditorDialog, type EditorTarget } from './event-editor-dialog';
import { AgendaView } from './views/agenda-view';
import { MonthView } from './views/month-view';
import { WeekView } from './views/week-view';

type View = 'week' | 'month' | 'agenda';
const VIEWS: View[] = ['week', 'month', 'agenda'];

export function MeetCalendar() {
  const t = useTranslations('meet');
  const m = useMeet();
  const [view, setView] = useState<View>('week');
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [editor, setEditor] = useState<EditorTarget | null>(null);

  const conflictedIds = useMemo(
    () =>
      new Set(
        m.conflicts.filter((c) => c.isBlocking).flatMap((c) => c.eventIds)
      ),
    [m.conflicts]
  );

  // Phones show 3 days at a time: seven columns are unreadable at that width.
  const isMobile = useIsMobile();
  const span = isMobile ? 3 : 7;
  const weekStart = isMobile ? anchor : startOfWeek(anchor);
  const weekDays = useMemo(
    () => Array.from({ length: span }, (_, i) => addDays(weekStart, i)),
    [weekStart, span]
  );

  const shift = (dir: 1 | -1) =>
    setAnchor((a) =>
      view === 'month'
        ? new Date(a.getFullYear(), a.getMonth() + dir, 1)
        : addDays(a, (view === 'week' ? span : 7) * dir)
    );

  const title =
    view === 'week'
      ? `${weekDays[0].toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – ${weekDays[span - 1].toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : anchor.toLocaleDateString(undefined, {
          month: 'long',
          year: 'numeric'
        });

  const viewProps = {
    events: m.events,
    sourceOf: m.sourceOf,
    conflictedIds,
    onEventClick: setSelected
  };

  const sync = async () => {
    try {
      await m.syncNow();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sync failed');
    }
  };

  return (
    <div className='grid gap-4 lg:grid-cols-[272px_minmax(0,1fr)]'>
      {/* side panel */}
      <aside className='order-2 space-y-5 lg:order-1'>
        <div className='bg-card rounded-xl border p-2'>
          <Calendar
            mode='single'
            selected={anchor}
            onSelect={(d) => d && setAnchor(startOfDay(d))}
            weekStartsOn={1}
            className='mx-auto'
          />
        </div>
        <section className='bg-card space-y-3 rounded-xl border p-4'>
          <h2 className='text-sm font-semibold'>{t('panel.calendars')}</h2>
          <CalendarsPanel />
        </section>
        <section className='bg-card space-y-3 rounded-xl border p-4'>
          <h2 className='text-sm font-semibold'>{t('panel.conflicts')}</h2>
          <ConflictsPanel onOpen={setSelected} />
        </section>
      </aside>

      {/* main */}
      <section className='order-1 min-w-0 space-y-3 lg:order-2'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              aria-label={t('toolbar.prev')}
              onClick={() => shift(-1)}
            >
              <IconChevronLeft />
            </Button>
            <Button
              variant='outline'
              onClick={() => setAnchor(startOfDay(new Date()))}
            >
              {t('toolbar.today')}
            </Button>
            <Button
              variant='outline'
              size='icon'
              aria-label={t('toolbar.next')}
              onClick={() => shift(1)}
            >
              <IconChevronRight />
            </Button>
            <h2 className='ml-2 text-lg font-semibold tabular-nums'>{title}</h2>
          </div>

          <div className='flex items-center gap-2'>
            <div className='bg-muted flex rounded-lg p-1'>
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                    view === v
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(`toolbar.${v}`)}
                </button>
              ))}
            </div>
            {m.mode === 'live' && (
              <Button
                variant='outline'
                onClick={() => void sync()}
                disabled={m.isSyncing}
              >
                <IconRefresh className={cn(m.isSyncing && 'animate-spin')} />
                {m.isSyncing ? t('toolbar.syncing') : t('toolbar.sync')}
              </Button>
            )}
            <Button onClick={() => setEditor({ start: undefined })}>
              <IconPlus />
              {t('toolbar.newEvent')}
            </Button>
          </div>
        </div>

        {view === 'week' && (
          <WeekView
            {...viewProps}
            days={weekDays}
            onSlotClick={(start) => setEditor({ start })}
          />
        )}
        {view === 'month' && (
          <MonthView
            {...viewProps}
            month={startOfMonth(anchor)}
            onDayClick={(d) => {
              setAnchor(startOfDay(d));
              setView('week');
            }}
          />
        )}
        {view === 'agenda' && <AgendaView {...viewProps} from={anchor} />}
      </section>

      <EventDetailsDialog
        event={selected}
        onClose={() => setSelected(null)}
        onEdit={(e) => {
          setSelected(null);
          setEditor({ event: e });
        }}
      />
      <EventEditorDialog target={editor} onClose={() => setEditor(null)} />
    </div>
  );
}
