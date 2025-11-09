'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { ctaDetails } from '../data/cta';
import { useTranslations } from 'next-intl';
import { landingLocalizeStrings } from '@/i18n/localize-strings';

const PlayStoreButton = ({ dark }: { dark?: boolean }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations(
    landingLocalizeStrings.common.google_play_button.getLocal
  );
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use explicit dark prop if provided, otherwise use theme
  const isDark =
    dark !== undefined ? dark : mounted && resolvedTheme === 'dark';

  return (
    <a href={ctaDetails.googlePlayUrl}>
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
          <svg viewBox='30 336.7 120.9 129.2' width='30'>
            <path
              fill='#FFD400'
              d='M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z'
            ></path>
            <path
              fill='#FF3333'
              d='M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z'
            ></path>
            <path
              fill='#48FF48'
              d='M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z'
            ></path>
            <path
              fill='#3BCCFF'
              d='M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z'
            ></path>
          </svg>
        </div>
        <div>
          <div className='text-xs'>
            {t(landingLocalizeStrings.common.google_play_button.get_it_on)}
          </div>
          <div className='-mt-1 font-sans text-xl font-semibold'>
            {t(landingLocalizeStrings.common.google_play_button.google_play)}
          </div>
        </div>
      </button>
    </a>
  );
};

export default PlayStoreButton;
