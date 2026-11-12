'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CalendarEvent, type AvailabilityStatus } from '../core/domain';
import { MS_MINUTE, roundToStep } from '../core/utils/time';
import { fromInputValue, toInputValue } from '../lib/datetime';
import { useMeet } from '../state/meet-provider';

export interface EditorTarget {
  event?: CalendarEvent;
  /** Pre-filled start for a new event (click on the time grid). */
  start?: Date;
}

const SELECT =
  'border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]';

/** US02-S2 on the web: type a title, pick a time, see conflicts *before* saving. */
export function EventEditorDialog({
  target,
  onClose
}: {
  target: EditorTarget | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        {/* remount per target so the form starts fresh */}
        {target && (
          <EditorForm
            key={
              target.event?.eventId ?? String(target.start?.getTime() ?? 'new')
            }
            target={target}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditorForm({
  target,
  onClose
}: {
  target: EditorTarget;
  onClose: () => void;
}) {
  const t = useTranslations('meet');
  const m = useMeet();
  const editing = target.event;
  const writable = useMemo(() => m.sources.filter((s) => m.canWrite(s)), [m]);

  const [initialStart] = useState(
    () =>
      editing?.startTime ??
      target.start ??
      roundToStep(new Date(Date.now() + 15 * MS_MINUTE), 15)
  );
  const [title, setTitle] = useState(editing?.title ?? '');
  const [location, setLocation] = useState(editing?.location ?? '');
  const [calendarId, setCalendarId] = useState(
    editing?.calendarId ?? writable[0]?.calendarId ?? ''
  );
  const [allDay, setAllDay] = useState(editing?.isAllDay ?? false);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(
    editing?.endTime ?? new Date(initialStart.getTime() + 30 * MS_MINUTE)
  );
  const [status, setStatus] = useState<AvailabilityStatus>(
    editing?.status ?? 'BUSY'
  );
  const [saving, setSaving] = useState(false);

  const invalid = end.getTime() <= start.getTime();

  // Same rules as the backend and the phone: warn before anything is saved.
  const warnings = useMemo(() => {
    if (invalid || !m.user) return [];
    const draft = new CalendarEvent({
      eventId: editing?.eventId ?? 'draft',
      calendarId,
      externalEventId: '',
      title: title || 'draft',
      startTime: start,
      endTime: end,
      isAllDay: allDay,
      status,
      lifecycleState: 'SYNCED'
    });
    return m.engine
      .previewFor(draft, m.events, {
        preference: m.preference,
        timeZone: m.user.timeZone
      })
      .map((c) => c.type);
  }, [
    invalid,
    m.user,
    m.engine,
    m.events,
    m.preference,
    editing,
    calendarId,
    title,
    start,
    end,
    allDay,
    status
  ]);

  const changeStart = (next: Date) => {
    const duration = end.getTime() - start.getTime();
    setStart(next);
    setEnd(new Date(next.getTime() + Math.max(duration, 15 * MS_MINUTE)));
  };

  const canSave =
    title.trim().length > 0 && !invalid && !!calendarId && !saving;

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        calendarId,
        title: title.trim(),
        location: location.trim() || undefined,
        startTime: start,
        endTime: end,
        isAllDay: allDay,
        status
      };
      const r = editing
        ? await m.updateEvent(editing.eventId, payload)
        : await m.createEvent(payload);
      toast.success(t('event.saved'));
      if (r.conflictTypes.length)
        toast.warning(t('conflict.count', { count: r.conflictTypes.length }));
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (writable.length === 0) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('event.newTitle')}</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-sm'>{t('event.noWritable')}</p>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('event.cancel')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editing ? t('event.editTitle') : t('event.newTitle')}
        </DialogTitle>
      </DialogHeader>

      <div className='space-y-4'>
        <Input
          autoFocus={!editing}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('event.title')}
          maxLength={255}
          className='h-11 text-base font-medium'
        />

        <div className='flex items-center justify-between'>
          <Label htmlFor='all-day'>{t('event.allDay')}</Label>
          <Switch id='all-day' checked={allDay} onCheckedChange={setAllDay} />
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('event.starts')}</Label>
            <Input
              type={allDay ? 'date' : 'datetime-local'}
              value={toInputValue(start, allDay)}
              onChange={(e) => {
                const d = fromInputValue(e.target.value);
                if (d) changeStart(d);
              }}
            />
          </div>
          <div className='space-y-1.5'>
            <Label>{t('event.ends')}</Label>
            <Input
              type={allDay ? 'date' : 'datetime-local'}
              value={toInputValue(end, allDay)}
              onChange={(e) => {
                const d = fromInputValue(e.target.value);
                if (d) setEnd(d);
              }}
            />
          </div>
        </div>
        {invalid && (
          <p className='text-destructive text-sm'>
            {t('event.invalidInterval')}
          </p>
        )}

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('event.calendar')}</Label>
            <select
              className={SELECT}
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              disabled={!!editing}
            >
              {writable.map((s) => (
                <option key={s.calendarId} value={s.calendarId}>
                  {s.calendarName}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1.5'>
            <Label>{t('event.showAs')}</Label>
            <select
              className={SELECT}
              value={status}
              onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            >
              {(['BUSY', 'FREE', 'TENTATIVE'] as const).map((s) => (
                <option key={s} value={s}>
                  {t(`event.${s}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='space-y-1.5'>
          <Label>{t('event.location')}</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {warnings.length > 0 && (
          <div
            className='space-y-1 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm'
            data-testid='draft-warnings'
          >
            {[...new Set(warnings)].map((w) => (
              <div key={w}>⚠ {t(`conflict.${w}`)}</div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={onClose}>
          {t('event.cancel')}
        </Button>
        <Button onClick={() => void save()} disabled={!canSave}>
          {saving ? t('event.saving') : t('event.save')}
        </Button>
      </DialogFooter>
    </>
  );
}
