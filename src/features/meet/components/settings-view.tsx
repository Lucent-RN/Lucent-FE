'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMeet } from '../state/meet-provider';
import type { PreferencePatch } from '../data/meet-repository';

const ISO_DAYS = [1, 2, 3, 4, 5, 6, 7];

export function SettingsView() {
  const t = useTranslations('meet');
  const m = useMeet();
  const p = m.preference;

  const save = async (patch: PreferencePatch) => {
    try {
      await m.updatePreference(patch);
      if (m.mode === 'live') toast.success(t('settings.saved'));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };
  const weekday = (iso: number) =>
    new Date(2024, 0, iso).toLocaleDateString(undefined, { weekday: 'short' });
  const num = (v: string, max: number) =>
    Math.max(0, Math.min(max, Math.round(Number(v) || 0)));

  return (
    <div className='mx-auto w-full max-w-2xl space-y-6'>
      <div>
        <h2 className='text-lg font-semibold'>{t('settings.title')}</h2>
        <p className='text-muted-foreground text-sm'>
          {t('settings.subtitle')}
        </p>
        {m.mode === 'demo' && (
          <p className='mt-1 text-sm text-amber-600'>
            {t('settings.demoNote')}
          </p>
        )}
      </div>

      <section className='bg-card space-y-4 rounded-xl border p-5'>
        <Label>{t('settings.workDays')}</Label>
        <div className='flex gap-2'>
          {ISO_DAYS.map((d) => {
            const on = p.workingDays.includes(d);
            return (
              <button
                key={d}
                aria-pressed={on}
                onClick={() =>
                  void save({
                    working_days: on
                      ? p.workingDays.filter((x) => x !== d)
                      : [...p.workingDays, d].sort()
                  })
                }
                className={cn(
                  'h-9 flex-1 rounded-md border text-sm font-medium transition-colors',
                  on
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground'
                )}
              >
                {weekday(d)}
              </button>
            );
          })}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='from'>{t('settings.from')}</Label>
            <Input
              id='from'
              type='time'
              defaultValue={p.workStartTime}
              key={`from-${p.workStartTime}`}
              onBlur={(e) =>
                e.target.value &&
                e.target.value < p.workEndTime &&
                void save({ work_start_time: e.target.value })
              }
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='to'>{t('settings.to')}</Label>
            <Input
              id='to'
              type='time'
              defaultValue={p.workEndTime}
              key={`to-${p.workEndTime}`}
              onBlur={(e) =>
                e.target.value &&
                e.target.value > p.workStartTime &&
                void save({ work_end_time: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      <section className='bg-card grid gap-4 rounded-xl border p-5 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='buffer'>{t('settings.buffer')}</Label>
          <div className='flex items-center gap-2'>
            <Input
              id='buffer'
              type='number'
              min={0}
              max={120}
              step={5}
              defaultValue={p.bufferMinutesAfterMeeting}
              key={`buf-${p.bufferMinutesAfterMeeting}`}
              onBlur={(e) =>
                void save({
                  buffer_minutes_after_meeting: num(e.target.value, 120)
                })
              }
            />
            <span className='text-muted-foreground text-sm'>
              {t('settings.minutes')}
            </span>
          </div>
          <p className='text-muted-foreground text-xs'>
            {t('settings.bufferHint')}
          </p>
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='reminder'>{t('settings.reminder')}</Label>
          <div className='flex items-center gap-2'>
            <Input
              id='reminder'
              type='number'
              min={0}
              max={1440}
              step={5}
              defaultValue={p.defaultReminderMinutes}
              key={`rem-${p.defaultReminderMinutes}`}
              onBlur={(e) =>
                void save({
                  default_reminder_minutes: num(e.target.value, 1440)
                })
              }
            />
            <span className='text-muted-foreground text-sm'>
              {t('settings.minutes')}
            </span>
          </div>
        </div>
      </section>

      <p className='text-muted-foreground text-sm'>
        {t('settings.timezone')}: {m.user?.timeZone}
      </p>
    </div>
  );
}
