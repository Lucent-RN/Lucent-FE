import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconSparkles,
  IconUsers
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { PhoneFrame, Scaled } from '@/features/showcase/phone-frame';
import {
  MeetAssistantScreen,
  MeetCalendarScreen,
  MeetConflictScreen,
  MeetWebScreen
} from '@/features/showcase/screens';
import { cn } from '@/lib/utils';
import AppStoreButton from '../atoms/app-store-button';
import PlayStoreButton from '../atoms/play-store-button';
import { FeatureCard, SectionHead, SpacePanel } from './section-head';

type Item = { title: string; text: string };
const ICONS = [IconCalendarEvent, IconAlertTriangle, IconSparkles, IconUsers];

/** LucentMeet: all calendars in one timeline. Web app is live; the mobile apps are "coming soon". */
export default function MeetLanding() {
  const t = useTranslations('site.meet');
  const nav = useTranslations('site.nav');
  const features = t.raw('features') as Item[];
  const steps = t.raw('steps') as Item[];
  const screens = t.raw('screens') as Item[];

  return (
    <>
      <section
        id='hero'
        className='relative isolate overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28'
      >
        <div className='cosmic-sky absolute inset-0 -z-10' />
        <div className='mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.1fr]'>
          <div className='text-center lg:text-left'>
            <p className='text-primary mb-4 text-xs font-semibold tracking-[0.35em] uppercase'>
              {t('eyebrow')}
            </p>
            <h1 className='text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl'>
              {t('title')}
            </h1>
            <p className='text-muted-foreground mx-auto mt-5 max-w-lg text-base sm:text-lg lg:mx-0'>
              {t('subtitle')}
            </p>
            <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start'>
              <Link
                href='/dashboard/meet'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 rounded-full px-7 text-base'
                )}
              >
                {nav('openWeb')}
              </Link>
              <Link
                href='/dashboard/meet?demo=1'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 rounded-full px-7 text-base'
                )}
              >
                {t('demo')}
              </Link>
            </div>
            <div className='mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start'>
              <AppStoreButton soon size='sm' />
              <PlayStoreButton soon size='sm' />
            </div>
            <p className='text-muted-foreground mt-3 text-sm'>{t('soon')}</p>
          </div>

          <div className='relative mx-auto flex w-full justify-center lg:justify-end'>
            <Scaled
              width={760}
              height={420}
              scale='var(--s)'
              className='[--s:0.44] sm:[--s:0.7] lg:[--s:0.8]'
            >
              <MeetWebScreen />
            </Scaled>
            <div className='absolute -right-2 -bottom-16 hidden sm:block lg:-right-8 lg:-bottom-20'>
              <PhoneFrame
                scale='var(--s)'
                className='rotate-[4deg] [--s:0.4] lg:[--s:0.46]'
              >
                <MeetCalendarScreen />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      <section id='features' className='mx-auto max-w-6xl px-6 py-16 lg:py-24'>
        <SectionHead title={t('featuresTitle')} />
        <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <FeatureCard
                key={f.title}
                icon={<Icon className='size-5' />}
                title={f.title}
                text={f.text}
              />
            );
          })}
        </div>
      </section>

      <section id='how' className='bg-muted/40 py-16 lg:py-24'>
        <div className='mx-auto max-w-5xl px-6'>
          <SectionHead title={t('howTitle')} />
          <ol className='mt-12 grid gap-8 md:grid-cols-3'>
            {steps.map((s, i) => (
              <li key={s.title} className='relative text-center md:text-left'>
                <span className='bg-primary text-primary-foreground mx-auto mb-4 flex size-10 items-center justify-center rounded-full text-lg font-semibold md:mx-0'>
                  {i + 1}
                </span>
                <h3 className='text-lg font-semibold'>{s.title}</h3>
                <p className='text-muted-foreground mt-1 text-sm'>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id='screens' className='mx-auto max-w-6xl px-6 py-16 lg:py-24'>
        <SectionHead title={t('screensTitle')} />
        <div className='mt-14 grid gap-14 md:grid-cols-3 md:gap-6'>
          {[MeetCalendarScreen, MeetConflictScreen, MeetAssistantScreen].map(
            (Screen, i) => (
              <figure
                key={i}
                className='flex flex-col items-center text-center'
              >
                <PhoneFrame
                  scale='var(--s)'
                  className='[--s:0.78] md:[--s:0.7] lg:[--s:0.85]'
                >
                  <Screen />
                </PhoneFrame>
                <figcaption className='mt-6 max-w-[16rem]'>
                  <h3 className='text-lg font-semibold'>{screens[i].title}</h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {screens[i].text}
                  </p>
                </figcaption>
              </figure>
            )
          )}
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-6 pb-20 lg:pb-28'>
        <SpacePanel className='rounded-3xl px-6 py-16 text-center'>
          <OrbitLogo
            size={80}
            className='mx-auto drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]'
          />
          <h2 className='mt-6 text-3xl font-semibold sm:text-4xl'>
            {t('ctaTitle')}
          </h2>
          <p className='mx-auto mt-3 max-w-md text-[#a5e3f4]'>{t('ctaText')}</p>
          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              href='/dashboard/meet'
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 rounded-full px-7 text-base'
              )}
            >
              {nav('openWeb')}
            </Link>
            <Link
              href='/dashboard/meet?demo=1'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white'
              )}
            >
              {t('demo')}
            </Link>
          </div>
        </SpacePanel>
      </section>
    </>
  );
}
