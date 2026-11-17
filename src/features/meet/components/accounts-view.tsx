'use client';

import { IconCalendarPlus, IconPlugConnected } from '@tabler/icons-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConnectedAccount } from '../core/domain';
import { useMeet } from '../state/meet-provider';

const KNOWN_ERRORS = new Set([
  'invalid_url',
  'feed_unreachable',
  'not_a_calendar',
  'feed_too_large',
  'too_many_feeds'
]);

export function AccountsView() {
  const t = useTranslations('meet');
  const m = useMeet();
  const [removing, setRemoving] = useState<ConnectedAccount | null>(null);
  const [adding, setAdding] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');
  const [feedName, setFeedName] = useState('');
  const [busy, setBusy] = useState(false);

  const addFeed = async () => {
    setBusy(true);
    try {
      const name = await m.addIcsFeed(feedUrl.trim(), feedName);
      toast.success(t('accounts.feedAdded', { name }));
      setAdding(false);
      setFeedUrl('');
      setFeedName('');
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      toast.error(
        KNOWN_ERRORS.has(code)
          ? t(`accounts.errors.${code}`)
          : e instanceof Error
            ? e.message
            : 'Error'
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removing) return;
    try {
      await m.disconnectAccount(removing.accountId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
    setRemoving(null);
  };

  return (
    <div className='mx-auto w-full max-w-3xl space-y-5'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold'>{t('accounts.title')}</h2>
          <p className='text-muted-foreground text-sm'>
            {t('accounts.subtitle')}
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <IconCalendarPlus />
          {t('accounts.addFeed')}
        </Button>
      </div>

      <ul className='bg-card divide-y rounded-xl border'>
        {m.accounts.length === 0 && (
          <li className='text-muted-foreground p-6 text-sm'>
            {t('accounts.none')}
          </li>
        )}
        {m.accounts.map((a) => {
          const count = m.sources.filter(
            (s) => s.accountId === a.accountId
          ).length;
          return (
            <li
              key={a.accountId}
              className='flex flex-wrap items-center gap-3 p-4'
            >
              <IconPlugConnected className='text-muted-foreground size-5' />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='truncate font-medium'>{a.accountEmail}</span>
                  <Badge variant='outline'>{t(`accounts.${a.provider}`)}</Badge>
                  {a.needsReauth ? (
                    <Badge variant='destructive'>
                      {t('accounts.needsReauth')}
                    </Badge>
                  ) : (
                    <Badge variant='secondary'>
                      {t(`accounts.status.${a.syncStatus}`)}
                    </Badge>
                  )}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {a.lastSyncedAt
                    ? `${t('accounts.lastSync')}: ${a.lastSyncedAt.toLocaleString()}`
                    : t('accounts.neverSynced')}
                  {count > 0 &&
                    ` · ${count} ${t('panel.calendars').toLowerCase()}`}
                </p>
                {a.lastError && (
                  <p className='text-destructive mt-0.5 truncate text-xs'>
                    {a.lastError}
                  </p>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='text-destructive'
                onClick={() => setRemoving(a)}
              >
                {t('accounts.disconnect')}
              </Button>
            </li>
          );
        })}
      </ul>

      <p className='text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm'>
        {t('accounts.mobileNote')}
      </p>

      <Dialog open={adding} onOpenChange={(o) => !busy && setAdding(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounts.feedTitle')}</DialogTitle>
            <DialogDescription>{t('accounts.feedBody')}</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='feed-url'>{t('accounts.feedUrl')}</Label>
              <Input
                id='feed-url'
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                placeholder='https://calendar.google.com/calendar/ical/…/basic.ics'
                autoComplete='off'
                spellCheck={false}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='feed-name'>{t('accounts.feedName')}</Label>
              <Input
                id='feed-name'
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              disabled={busy}
              onClick={() => setAdding(false)}
            >
              {t('event.cancel')}
            </Button>
            <Button disabled={busy || !feedUrl.trim()} onClick={() => void addFeed()}>
              {busy ? t('accounts.feedAdding') : t('accounts.feedAdd')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('accounts.disconnectTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {removing?.accountEmail}. {t('accounts.disconnectBody')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('event.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void remove()}>
              {t('accounts.disconnect')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
