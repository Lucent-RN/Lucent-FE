'use client';

import AppStoreButton from '@/features/landing/atoms/app-store-button';
import Container from '@/features/landing/atoms/container';
import PlayStoreButton from '@/features/landing/atoms/play-store-button';
import CTA from '@/features/landing/moleculus/cta';
import { Monitor, Smartphone, TabletSmartphone, Watch } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const DEVICE_ICONS = [
  { Icon: Smartphone, label: 'Smartphone' },
  { Icon: TabletSmartphone, label: 'Tablet' },
  { Icon: Monitor, label: 'Mac' },
  { Icon: Watch, label: 'Wearable' }
];

const DownloadPage = () => {
  return (
    <Container className='flex min-h-screen flex-col items-center justify-center px-6 pt-30 sm:px-8'>
      <div className='mx-auto w-full max-w-4xl rounded-[32px] p-8 text-center shadow-[0_35px_80px_rgba(15,23,42,0.1)]'>
        <h1 className='text-foreground mt-6 font-sans text-4xl font-semibold sm:text-5xl'>
          Stay focused, reduce stress, and get more done effortlessly.
        </h1>
        <p className='text-foreground-accent mx-auto mt-4 max-w-2xl text-base sm:text-lg'>
          Stay focused, reduce stress, and get more done effortlessly. Flow
          keeps you on track with clarity—no subscriptions, just better
          productivity whenever you need it.
        </p>

        <div className='mt-10 flex flex-col md:flex-row md:items-stretch md:justify-center md:text-left'>
          <div className='flex flex-1 flex-col items-center md:items-start'>
            <AppStoreButton size='lg' />
            <PlayStoreButton size='lg' />
            <div className='text-foreground-accent mt-4 space-y-3 text-sm'>
              <p className='text-foreground font-semibold'>Available on</p>
              <div className='flex flex-wrap items-center justify-center gap-5 md:justify-start'>
                {DEVICE_ICONS.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className='text-foreground/70 flex flex-col items-center text-xs'
                  >
                    <Icon className='mb-1 h-5 w-5' />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-1 flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.1)] md:max-w-[280px] dark:border-white/10 dark:bg-slate-900/50'>
            <Image
              src='/assets/qr-code-download.png'
              alt='QR code to download the app'
              width={180}
              height={180}
              className='mx-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-inner'
              priority
            />
            <p className='text-foreground-accent text-sm'>
              Scan to download on your iPhone or iPad
            </p>
            <p className='text-foreground/70 text-xs'>
              v2.9.0 · iOS 17+ / macOS Sonoma
            </p>
          </div>
        </div>
      </div>

      <CTA isShowingButtons={false} />
    </Container>
  );
};

export default DownloadPage;
