'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { ctaDetails } from '../data/cta';
import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

type StoreButtonSize = 'sm' | 'md' | 'lg';

const sizeVariants: Record<
  StoreButtonSize,
  { button: string; label: string; tagline: string; icon: string }
> = {
  sm: {
    button: 'h-12 min-w-[180px] px-5 text-sm',
    label: 'text-lg',
    tagline: 'text-[10px]',
    icon: 'h-5 w-5'
  },
  md: {
    button: 'h-14 min-w-[205px] px-6 text-base',
    label: 'text-xl',
    tagline: 'text-xs',
    icon: 'h-6 w-6'
  },
  lg: {
    button: 'h-16 min-w-[230px] px-7 text-lg',
    label: 'text-2xl',
    tagline: 'text-sm',
    icon: 'h-7 w-7'
  }
};

const AppStoreButton = ({
  dark,
  size = 'md'
}: {
  dark?: boolean;
  size?: StoreButtonSize;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations(
    landingLocalizeStrings.common.app_store_button.getLocal
  );
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use explicit dark prop if provided, otherwise use theme
  const isDark =
    dark !== undefined ? dark : mounted && resolvedTheme === 'dark';

  return (
    <a href={ctaDetails.appStoreUrl} target='_blank' rel='noopener noreferrer'>
      <button
        type='button'
        className={clsx(
          'mt-3 flex w-full items-center justify-center rounded-full transition-colors sm:w-fit',
          sizeVariants[size].button,
          {
            'bg-white text-black': isDark,
            'bg-foreground text-white': !isDark
          }
        )}
      >
        <div className='mr-3'>
          <svg
            viewBox='0 0 384 512'
            className={clsx(sizeVariants[size].icon)}
            aria-hidden='true'
          >
            <path
              fill='currentColor'
              d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z'
            ></path>
          </svg>
        </div>
        <div>
          <div className={clsx(sizeVariants[size].tagline)}>
            {t(landingLocalizeStrings.common.app_store_button.download_on_the)}
          </div>
          <div
            className={clsx(
              '-mt-1 font-sans font-semibold',
              sizeVariants[size].label
            )}
          >
            {t(landingLocalizeStrings.common.app_store_button.app_store)}
          </div>
        </div>
      </button>
    </a>
  );
};

export default AppStoreButton;
