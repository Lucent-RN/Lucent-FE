'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

import { ctaDetails } from '../data/cta';
import { useTranslations } from 'next-intl';
import { landingLocalizeStrings } from '@/i18n/localize-strings';

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

const PlayStoreButton = ({
  dark,
  size = 'md'
}: {
  dark?: boolean;
  size?: StoreButtonSize;
}) => {
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
    <a
      href={ctaDetails.googlePlayUrl}
      target='_blank'
      rel='noopener noreferrer'
    >
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
            viewBox='30 336.7 120.9 129.2'
            className={clsx(sizeVariants[size].icon)}
            aria-hidden='true'
          >
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
          <div className={clsx(sizeVariants[size].tagline)}>
            {t(landingLocalizeStrings.common.google_play_button.get_it_on)}
          </div>
          <div
            className={clsx(
              '-mt-1 font-sans font-semibold',
              sizeVariants[size].label
            )}
          >
            {t(landingLocalizeStrings.common.google_play_button.google_play)}
          </div>
        </div>
      </button>
    </a>
  );
};

export default PlayStoreButton;
