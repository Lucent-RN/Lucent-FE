import React from 'react';
import Image from 'next/image';

import AppStoreButton from '../atoms/app-store-button';
import PlayStoreButton from '../atoms/play-store-button';

import { heroDetails } from '../data/hero';

const Hero: React.FC = () => {
  return (
    <section
      id='hero'
      className='relative flex items-center justify-center px-5 pt-32 pb-20 md:pt-40 md:pb-32'
    >
      <div className='absolute top-0 bottom-0 left-0 -z-10 w-full'>
        <div className='bg-hero-background absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] bg-[size:40px_40px]'></div>
      </div>

      <div className='absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)] backdrop-blur-[2px]'></div>

      <div className='text-center'>
        <h1 className='text-foreground mx-auto max-w-lg text-4xl font-bold md:max-w-2xl md:text-6xl md:leading-tight'>
          {heroDetails.heading}
        </h1>
        <p className='text-foreground mx-auto mt-4 max-w-lg'>
          {heroDetails.subheading}
        </p>
        <div className='mx-auto mt-6 flex w-fit flex-col items-center sm:flex-row sm:gap-4'>
          <AppStoreButton dark />
          <PlayStoreButton dark />
        </div>
        <Image
          src={heroDetails.centerImageSrc}
          width={480}
          height={640}
          quality={100}
          sizes='(max-width: 768px) 100vw, 640px'
          priority={true}
          unoptimized={true}
          alt='app mockup'
          className='relative z-10 mx-auto mt-12 h-auto w-auto max-w-[480px] md:mt-16 md:max-w-[440px]'
        />
      </div>
    </section>
  );
};

export default Hero;
