import {
  IconChartBar,
  IconDeviceMobile,
  IconMoonStars,
  IconPlanet
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { PhoneFrame } from '@/features/showcase/phone-frame';
import {
  FocusScreen,
  LockScreen,
  TimerScreen
} from '@/features/showcase/screens';
import AppStoreButton from '../atoms/app-store-button';
import PlayStoreButton from '../atoms/play-store-button';
import { FeatureCard, SectionHead, SpacePanel } from './section-head';

type Item = { title: string; text: string };
const ICONS = [IconPlanet, IconMoonStars, IconDeviceMobile, IconChartBar];

/** Lucent: a short, calm introduction — hero, four ideas, three screens, download. */
export default function LucentLanding() {
  const t = useTranslations('site.lucent');
  const features = t.raw('features') as Item[];
  const screens = t.raw('screens') as Item[];
  const phone = '[--s:0.72] sm:[--s:0.85] lg:[--s:1]';

  return (
    <>
      <SpacePanel className='pt-28 pb-20 lg:pt-36 lg:pb-28'>
        <section
          id='hero'
          className='mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr]'
        >
          <div className='text-center lg:text-left'>
            <p className='mb-4 text-xs font-semibold tracking-[0.35em] text-[#a5e3f4] uppercase'>
              {t('eyebrow')}
            </p>
            <h1 className='bg-gradient-to-br from-white via-[#e4f7fb] to-[#67e8f9] bg-clip-text text-5xl leading-[1.05] font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl'>
              {t('title')}
            </h1>
            <p className='mx-auto mt-5 max-w-lg text-base text-[#a5e3f4] sm:text-lg lg:mx-0'>
              {t('subtitle')}
            </p>
            <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start'>
              <AppStoreButton dark />
              <PlayStoreButton dark />
            </div>
          </div>

          <div className='relative mx-auto flex justify-center'>
            <div className='absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.35),transparent)] blur-2xl' />
            <PhoneFrame
              dark
              scale='var(--s)'
              className={`${phone} mt-10 -mr-16 hidden rotate-[-6deg] sm:block`}
            >
              <FocusScreen />
            </PhoneFrame>
            <PhoneFrame
              scale='var(--s)'
              className={`${phone} relative z-10 rotate-[3deg]`}
            >
              <TimerScreen />
            </PhoneFrame>
          </div>
        </section>
      </SpacePanel>

      <section id='features' className='mx-auto max-w-6xl px-6 py-20 lg:py-28'>
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

      <section id='screens' className='bg-muted/40 py-20 lg:py-28'>
        <div className='mx-auto max-w-6xl px-6'>
          <SectionHead
            title={t('screensTitle')}
            subtitle={t('screensSubtitle')}
          />
          <div className='mt-14 grid gap-14 md:grid-cols-3 md:gap-6'>
            {[TimerScreen, FocusScreen, LockScreen].map((Screen, i) => (
              <figure
                key={i}
                className='flex flex-col items-center text-center'
              >
                <PhoneFrame
                  dark={i > 0}
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
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-6 py-20 lg:py-28'>
        <SpacePanel className='rounded-3xl px-6 py-16 text-center'>
          <OrbitLogo
            size={88}
            className='mx-auto drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]'
          />
          <h2 className='mt-6 text-3xl font-semibold sm:text-4xl'>
            {t('ctaTitle')}
          </h2>
          <p className='mx-auto mt-3 max-w-md text-[#a5e3f4]'>{t('ctaText')}</p>
          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <AppStoreButton dark />
            <PlayStoreButton dark />
          </div>
        </SpacePanel>
      </section>
    </>
  );
}
