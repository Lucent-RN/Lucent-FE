import {
  IconCalendarEvent,
  IconSparkles,
  IconUsers
} from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { cn } from '@/lib/utils';
import GoogleSignInButton from '../atoms/google-sign-in-button';

export default async function SignInViewPage({ error }: { error?: string }) {
  const t = await getTranslations('signin');

  return (
    <div className='relative grid min-h-screen lg:grid-cols-2'>
      {/* brand panel: always the dark "space" look, in both themes */}
      <div className='dark relative hidden flex-col justify-between overflow-hidden bg-[#041e29] p-10 text-[#e4f7fb] lg:flex'>
        <div className='cosmic-sky absolute inset-0' />
        <div className='cosmic-stars absolute inset-0 opacity-80' />
        <div className='cosmic-stars cosmic-stars-twinkle absolute inset-0' />
        <div className='relative flex items-center gap-3 text-lg font-semibold'>
          <OrbitLogo size={36} /> Lucent
        </div>
        <div className='relative space-y-6'>
          <OrbitLogo
            size={168}
            className='drop-shadow-[0_0_40px_rgba(34,211,238,0.35)]'
          />
          <p className='text-sm font-semibold tracking-[0.3em] text-[#a5e3f4] uppercase'>
            {t('tagline')}
          </p>
          <h2 className='max-w-md text-3xl leading-tight font-semibold'>
            {t('hero')}
          </h2>
          <ul className='space-y-2 text-sm text-[#a5e3f4]'>
            <li className='flex items-center gap-2'>
              <IconCalendarEvent className='size-4' /> Google + Apple calendars,
              merged
            </li>
            <li className='flex items-center gap-2'>
              <IconUsers className='size-4' /> Connect as many accounts as you
              like
            </li>
            <li className='flex items-center gap-2'>
              <IconSparkles className='size-4' /> An assistant that finds the
              free time for you
            </li>
          </ul>
        </div>
        <p className='relative text-xs text-[#a5e3f4]/70'>© Lucent</p>
      </div>

      <div className='flex items-center justify-center p-6 lg:p-10'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='flex flex-col items-center gap-3 text-center lg:items-start lg:text-left'>
            <OrbitLogo size={56} className='lg:hidden' />
            <h1 className='text-2xl font-semibold tracking-tight'>
              {t('title')}
            </h1>
            <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
          </div>

          {error && (
            <p
              role='alert'
              className='border-destructive/40 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-sm'
            >
              {t('error')}
            </p>
          )}
          {!isSupabaseConfigured && (
            <p className='bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm'>
              {t('notConfigured')}
            </p>
          )}

          <div className='space-y-3'>
            <Suspense fallback={null}>
              <GoogleSignInButton />
            </Suspense>
            <Link
              href='/dashboard/meet?demo=1'
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-11 w-full'
              )}
            >
              {t('demo')}
            </Link>
          </div>

          <p className='text-muted-foreground text-center text-xs lg:text-left'>
            {t('terms')}
          </p>
        </div>
      </div>
    </div>
  );
}
