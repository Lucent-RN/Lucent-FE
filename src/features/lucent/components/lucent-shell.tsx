'use client';

import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { ModeToggle } from '@/components/layout/ThemeToggle/theme-toggle';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useLucent } from '../state/lucent-provider';

const TABS = [
  { key: 'timer', path: '/dashboard/lucent' },
  { key: 'tasks', path: '/dashboard/lucent/tasks' },
  { key: 'stats', path: '/dashboard/lucent/stats' },
  { key: 'settings', path: '/dashboard/lucent/settings' }
] as const;

/**
 * Standalone frame for every Lucent (Pomodoro) screen on the web: a slim top bar with the
 * brand, the four tabs and the theme toggle — no dashboard sidebar. While a focus session
 * runs, the bar and the storage note fade away (and become inert) so only the timer remains.
 */
export function LucentShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('lucent-web');
  const pathname = usePathname();
  const { running, data } = useLucent();
  const focusing = running && data.timer.mode === 'focus';

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-6xl min-w-0 flex-col gap-4 overflow-x-clip p-4 md:px-8 md:py-6'>
      <header
        inert={focusing}
        aria-hidden={focusing}
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 transition-all duration-500',
          focusing && 'pointer-events-none -translate-y-3 opacity-0'
        )}
      >
        <Link href='/' className='flex items-center gap-3 rounded-xl'>
          <OrbitLogo size={40} />
          <div>
            <p className='text-xl leading-tight font-semibold tracking-tight'>
              {t('title')}
            </p>
            <p className='text-muted-foreground hidden text-sm sm:block'>
              {t('subtitle')}
            </p>
          </div>
        </Link>
        <div className='flex items-center gap-2'>
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
          <ModeToggle />
        </div>
      </header>
      <p
        inert={focusing}
        aria-hidden={focusing}
        className={cn(
          'text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-xs transition-all duration-500',
          focusing && 'pointer-events-none opacity-0'
        )}
      >
        {t('localNote')}
      </p>
      <main className='flex flex-1 flex-col'>{children}</main>
    </div>
  );
}
