'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '../core/domain';
import { useMeet } from '../state/meet-provider';

const MAX = 5;

export function ConflictsPanel({
  onOpen
}: {
  onOpen: (e: CalendarEvent) => void;
}) {
  const t = useTranslations('meet');
  const m = useMeet();
  const blocking = m.conflicts.filter((c) => c.isBlocking);

  if (blocking.length === 0)
    return (
      <p className='text-muted-foreground text-sm'>{t('panel.noConflicts')}</p>
    );

  return (
    <ul className='space-y-2'>
      {blocking.slice(0, MAX).map((c) => {
        const titles = c.eventIds
          .map((id) => m.allEvents.find((e) => e.eventId === id))
          .filter(Boolean) as CalendarEvent[];
        return (
          <li
            key={c.conflictId}
            className='rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-sm'
          >
            <div className='font-medium'>{t(`conflict.${c.type}`)}</div>
            <div className='mt-1 flex flex-wrap gap-1'>
              {titles.map((e) => (
                <button
                  key={e.eventId}
                  onClick={() => onOpen(e)}
                  className='bg-background/70 hover:bg-background max-w-full truncate rounded px-1.5 py-0.5 text-xs'
                >
                  {e.title}
                </button>
              ))}
            </div>
            {m.mode === 'live' && (
              <Button
                size='sm'
                variant='ghost'
                className='mt-1 h-7 px-2 text-xs'
                onClick={() => void m.resolveConflict(c.conflictId)}
              >
                {t('panel.resolve')}
              </Button>
            )}
          </li>
        );
      })}
      {blocking.length > MAX && (
        <li className='text-muted-foreground text-xs'>
          {t('panel.more', { count: blocking.length - MAX })}
        </li>
      )}
    </ul>
  );
}
