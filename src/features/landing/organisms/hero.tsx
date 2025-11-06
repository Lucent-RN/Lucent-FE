import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import AppStoreButton from '../atoms/app-store-button';
import PlayStoreButton from '../atoms/play-store-button';
import { localizeStrings } from '../constants/localizeString';

const Hero: React.FC = () => {
  const t = useTranslations(localizeStrings.hero.getLocal);
  return (
    <section
      id='hero'
      className='relative flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-36 lg:pt-44'
    >
      {/* Background Grid Pattern */}
      <div className='absolute inset-0 -z-10 w-full'>
        <div className='bg-hero-background absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] bg-[size:40px_40px]' />
      </div>

      {/* Subtle bottom gradient overlay */}
      <div className='absolute inset-x-0 bottom-0 h-40 from-[rgba(202,208,230,0.6)] via-[rgba(233,238,255,0.3)] to-transparent backdrop-blur-[2px]' />

      {/* Content */}
      <div className='relative z-10 text-center'>
        <h1 className='text-foreground mx-auto max-w-xs text-3xl font-bold sm:max-w-md sm:text-4xl md:max-w-2xl md:text-6xl md:leading-tight'>
          {t(localizeStrings.hero.heading)}
        </h1>

        <p className='text-muted-foreground mx-auto mt-4 max-w-sm text-sm sm:max-w-md sm:text-base md:max-w-xl md:text-lg'>
          {t(localizeStrings.hero.subheading)}
        </p>

        <div className='mx-auto mt-6 flex w-fit flex-col items-center gap-3 sm:flex-row sm:gap-4 md:mt-8'>
          <AppStoreButton />
          <PlayStoreButton />
        </div>

        <div className='mt-10 flex justify-center sm:mt-12 md:mt-16'>
          <Image
            src='/images/hero-mockup.png'
            width={480}
            height={640}
            quality={100}
            priority
            alt='App mockup'
            className='h-auto w-[80%] max-w-[400px] object-contain sm:w-[70%] sm:max-w-[440px] md:w-[60%] md:max-w-[480px] lg:w-[50%]'
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
