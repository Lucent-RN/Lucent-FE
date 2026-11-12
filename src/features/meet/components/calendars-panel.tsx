'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useMeet } from '../state/meet-provider';

/** Calendars grouped by the account they come from; toggle which ones appear on the timeline. */
export function CalendarsPanel() {
  const t = useTranslations('meet');
  const m = useMeet();

  if (m.accounts.length === 0)
    return (
      <p className='text-muted-foreground text-sm'>{t('accounts.none')}</p>
    );

  return (
    <div className='space-y-4'>
      {m.accounts.map((a) => {
        const list = m.sources.filter((s) => s.accountId === a.accountId);
        return (
          <div key={a.accountId} className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <span className='truncate text-xs font-medium'>
                {a.accountEmail}
              </span>
              <Badge variant='outline' className='h-4 px-1 text-[10px]'>
                {t(`accounts.${a.provider}`)}
              </Badge>
            </div>
            {list.map((s) => (
              <label
                key={s.calendarId}
                className='flex cursor-pointer items-center gap-2 text-sm'
              >
                <span
                  className='size-2.5 shrink-0 rounded-full'
                  style={{ backgroundColor: s.colorHex }}
                />
                <span className='flex-1 truncate'>{s.calendarName}</span>
                <Switch
                  checked={s.isVisible}
                  aria-label={s.calendarName}
                  onCheckedChange={(v) =>
                    void m
                      .setCalendarVisible(s.calendarId, v)
                      .catch((e) => toast.error(String(e?.message ?? e)))
                  }
                />
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}
