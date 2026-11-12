'use client';

import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useMeet } from '../state/meet-provider';

const TABS = [
  { key: 'calendar', path: '/dashboard/meet' },
  { key: 'assistant', path: '/dashboard/meet/assistant' },
  { key: 'accounts', path: '/dashboard/meet/accounts' },
  { key: 'settings', path: '/dashboard/meet/settings' }
] as const;

/** Header, sub-navigation and load/error states shared by every LucentMeet screen. */
export function MeetShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('meet');
  const m = useMeet();
  const pathname = usePathname();

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col gap-4 p-4 md:px-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <OrbitLogo size={40} />
          <div>
            <h1 className='text-xl leading-tight font-semibold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
          </div>
          {m.mode === 'demo' && <Badge variant='secondary'>Demo</Badge>}
        </div>
        <nav aria-label='LucentMeet' className='bg-muted flex rounded-lg p-1'>
          {TABS.map((tab) => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.key}
                href={m.href(tab.path)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`nav.${tab.key}`)}
              </Link>
            );
          })}
        </nav>
      </div>

      {m.mode === 'demo' && (
        <div className='bg-accent text-accent-foreground flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-2 text-sm'>
          <span>{t('demo.banner')}</span>
          <Button asChild size='sm' variant='outline'>
            <Link href='/auth/sign-in'>{t('demo.signIn')}</Link>
          </Button>
        </div>
      )}

      {m.status === 'loading' && (
        <div className='space-y-3' aria-busy='true' aria-label={t('loading')}>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-[420px] w-full' />
        </div>
      )}

      {m.status === 'error' && (
        <div className='border-destructive/40 bg-destructive/5 flex flex-col items-start gap-3 rounded-lg border p-4'>
          <div>
            <p className='font-medium'>{t('error.title')}</p>
            <p className='text-muted-foreground text-sm'>{m.error}</p>
          </div>
          <Button variant='outline' size='sm' onClick={() => void m.refresh()}>
            {t('error.retry')}
          </Button>
        </div>
      )}

      {m.status === 'ready' && children}
    </div>
  );
}
