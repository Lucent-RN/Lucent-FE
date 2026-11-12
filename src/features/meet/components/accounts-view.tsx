'use client';

import { IconBrandGoogle, IconPlugConnected } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import type { ConnectedAccount } from '../core/domain';
import { useMeet } from '../state/meet-provider';

const KNOWN_ERRORS = new Set([
  'cancelled',
  'state',
  'missing_google_client',
  'link_failed',
  'calendar_scope_missing',
  'reauth_required',
  'provider_error',
  'server_misconfigured'
]);

export function AccountsView() {
  const t = useTranslations('meet');
  const locale = useLocale();
  const m = useMeet();
  const params = useSearchParams();
  const [removing, setRemoving] = useState<ConnectedAccount | null>(null);

  // Result of the Google connect round-trip (/api/meet/google/callback redirects back here).
  const connected = params.get('connected');
  const error = params.get('error');
  useEffect(() => {
    if (connected) {
      toast.success(t('accounts.connected', { email: connected }));
      void m.refresh();
    } else if (error) {
      toast.error(
        t(`accounts.errors.${KNOWN_ERRORS.has(error) ? error : 'link_failed'}`)
      );
    }
    // run once per redirect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, error]);

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
        {m.mode === 'live' ? (
          <Button asChild>
            {/* a full navigation: this leaves the app for Google's consent screen */}
            <a href={`/api/meet/google/connect?locale=${locale}`}>
              <IconBrandGoogle />
              {t('accounts.connectGoogle')}
            </a>
          </Button>
        ) : (
          <Button disabled>
            <IconBrandGoogle />
            {t('accounts.connectGoogle')}
          </Button>
        )}
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
              {a.needsReauth && m.mode === 'live' && (
                <Button asChild variant='outline' size='sm'>
                  <a href={`/api/meet/google/connect?locale=${locale}`}>
                    {t('accounts.connectGoogle')}
                  </a>
                </Button>
              )}
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
        {t('accounts.appleNote')}
      </p>

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
