'use client';

import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'timer', path: '/dashboard/lucent' },
  { key: 'tasks', path: '/dashboard/lucent/tasks' },
  { key: 'stats', path: '/dashboard/lucent/stats' },
  { key: 'settings', path: '/dashboard/lucent/settings' }
] as const;

/** Header and sub-navigation shared by every Lucent (Pomodoro) screen on the web. */
export function LucentShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('lucent-web');
  const pathname = usePathname();
  return (
    <div className='flex min-h-[calc(100dvh-4rem)] flex-col gap-4 p-4 md:px-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <OrbitLogo size={40} />
          <div>
            <h1 className='text-xl leading-tight font-semibold tracking-tight'>{t('title')}</h1>
            <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
          </div>
        </div>
        <nav aria-label='Lucent' className='bg-muted flex rounded-lg p-1'>
          {TABS.map((tab) => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.key}
                href={tab.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`nav.${tab.key}`)}
              </Link>
            );
          })}
        </nav>
      </div>
      <p className='text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-xs'>{t('localNote')}</p>
      {children}
    </div>
  );
}
