'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { ctaDetails } from '../data/cta';
import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

const AppStoreButton = ({ dark }: { dark?: boolean }) => {
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
    <a href={ctaDetails.appStoreUrl}>
      <button
        type='button'
        className={clsx(
          'mt-3 flex h-14 w-full min-w-[205px] items-center justify-center rounded-full px-6 transition-colors sm:w-fit',
          {
            // Dark mode: white background, dark text
            'bg-white text-black': isDark,
            // Light mode: black background, white text
            'bg-foreground text-white': !isDark
          }
        )}
      >
        <div className='mr-3'>
          <svg viewBox='0 0 384 512' width='30'>
            <path
              fill='currentColor'
              d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z'
            ></path>
          </svg>
        </div>
        <div>
          <div className='text-xs'>
            {t(landingLocalizeStrings.common.app_store_button.download_on_the)}
          </div>
          <div className='-mt-1 font-sans text-xl font-semibold'>
            {t(landingLocalizeStrings.common.app_store_button.app_store)}
          </div>
        </div>
      </button>
    </a>
  );
};

export default AppStoreButton;
