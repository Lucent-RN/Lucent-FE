'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import type { CalendarEvent } from '../core/domain';
import { dayLabel, FALLBACK_COLOR, rangeLabel } from '../lib/datetime';
import { useMeet } from '../state/meet-provider';

export function EventDetailsDialog({
  event,
  onClose,
  onEdit
}: {
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (e: CalendarEvent) => void;
}) {
  const t = useTranslations('meet');
  const m = useMeet();
  const [confirming, setConfirming] = useState(false);
  const source = event ? m.sourceOf(event) : undefined;
  const writable = m.canWrite(source);
  const conflicts = event ? m.conflictsOf(event.eventId) : [];

  const remove = async () => {
    if (!event) return;
    try {
      await m.deleteEvent(event.eventId);
      toast.success(t('event.deleted'));
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };

  return (
    <>
      <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className='sm:max-w-md'>
          {event && (
            <>
              <DialogHeader>
                <div className='flex items-center gap-2'>
                  <span
                    className='size-3 rounded-full'
                    style={{
                      backgroundColor: source?.colorHex ?? FALLBACK_COLOR
                    }}
                  />
                  <DialogTitle className='truncate'>
                    {event.title || t('event.untitled')}
                  </DialogTitle>
                </div>
                <DialogDescription>
                  {dayLabel(event.startTime)} ·{' '}
                  {rangeLabel(
                    event.startTime,
                    event.endTime,
                    event.isAllDay,
                    t('event.allDay')
                  )}
                </DialogDescription>
              </DialogHeader>

              <dl className='space-y-2 text-sm'>
                {event.location && (
                  <div className='flex gap-2'>
                    <dt className='text-muted-foreground w-24 shrink-0'>
                      {t('event.location')}
                    </dt>
                    <dd>{event.location}</dd>
                  </div>
                )}
                <div className='flex gap-2'>
                  <dt className='text-muted-foreground w-24 shrink-0'>
                    {t('event.calendar')}
                  </dt>
                  <dd>{source?.calendarName ?? '—'}</dd>
                </div>
                <div className='flex gap-2'>
                  <dt className='text-muted-foreground w-24 shrink-0'>
                    {t('event.showAs')}
                  </dt>
                  <dd>{t(`event.${event.status}`)}</dd>
                </div>
                {event.description && (
                  <p className='text-muted-foreground whitespace-pre-line'>
                    {event.description}
                  </p>
                )}
              </dl>

              {conflicts.length > 0 && (
                <div className='space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3'>
                  {conflicts.map((c) => (
                    <div
                      key={c.conflictId}
                      className='flex items-center justify-between gap-2 text-sm'
                    >
                      <span>⚠ {t(`conflict.${c.type}`)}</span>
                      {m.mode === 'live' && (
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => void m.resolveConflict(c.conflictId)}
                        >
                          {t('panel.resolve')}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!writable && (
                <Badge variant='secondary'>{t('event.readOnly')}</Badge>
              )}

              <DialogFooter className='gap-2 sm:justify-between'>
                {writable ? (
                  <Button
                    variant='destructive'
                    onClick={() => setConfirming(true)}
                  >
                    {t('event.delete')}
                  </Button>
                ) : (
                  <span />
                )}
                <div className='flex gap-2'>
                  <Button variant='outline' onClick={onClose}>
                    {t('event.cancel')}
                  </Button>
                  {writable && (
                    <Button onClick={() => onEdit(event)}>
                      {t('event.edit')}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('event.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('event.deleteBody')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('event.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void remove()}>
              {t('event.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
