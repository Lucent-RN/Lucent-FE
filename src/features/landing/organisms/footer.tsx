import Link from 'next/link';
import React from 'react';

import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { getPlatformIconByName } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AppStoreButton from '../atoms/app-store-button';
import PlayStoreButton from '../atoms/play-store-button';
import { siteDetails } from '../data/site-details';
import { IMenuItem, ISocials } from '../types';

const Footer: React.FC = () => {
  const t = useTranslations(landingLocalizeStrings.footer.getLocal);
  const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
  } = {
    subheading: t(landingLocalizeStrings.footer.subheading),
    quickLinks: t
      .raw(landingLocalizeStrings.footer.quick_links)
      .map((link: { text: string }, index: number) => ({
        text: link.text,
        url: index === 0 ? '#features' : index === 1 ? '#pricing' : '/policy'
      })),
    email: 'kanent.tech@gmail.com',
    telephone: '+84 974 102 437',
    socials: {
      github: 'https://github.com/Lucent-RN',
      facebook: 'https://www.facebook.com/lucentapp',
      threads: 'https://www.threads.net/@lucent.rn.app',
      instagram: 'https://instagram.com/lucent.rn.app'
    }
  };

  return (
    <footer className='bg-hero-background text-foreground py-10'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-3'>
        <div>
          <div className='flex items-center gap-2'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/assets/app-icon.png'
                alt='logo'
                width={60}
                height={60}
                className='h-10 w-10 object-contain md:h-14 md:w-14'
              />
            </Link>
            <span className='text-foreground font-sans text-lg font-semibold'>
              {siteDetails.siteName}
            </span>
          </div>
          <p className='text-foreground-accent text-base'>
            {footerDetails.subheading}
          </p>
          <div className='mt-4 flex flex-row gap-2'>
            <AppStoreButton size='md' />
            <PlayStoreButton size='md' />
          </div>
        </div>
        <div>
          <h4 className='mb-4 text-lg font-semibold'>
            {t(landingLocalizeStrings.footer.quick_links_label)}
          </h4>
          <ul className='text-foreground-accent'>
            {footerDetails.quickLinks.map((link) => (
              <li key={link.text} className='mb-2'>
                <Link href={link.url} className='hover:text-foreground'>
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className='mb-4 text-lg font-semibold'>
            {t(landingLocalizeStrings.footer.contact_us_label)}
          </h4>

          {footerDetails.email && (
            <a
              href={`mailto:${footerDetails.email}`}
              className='text-foreground-accent hover:text-foreground block'
            >
              Email: {footerDetails.email}
            </a>
          )}

          {footerDetails.telephone && (
            <a
              href={`tel:${footerDetails.telephone}`}
              className='text-foreground-accent hover:text-foreground block'
            >
              Phone: {footerDetails.telephone}
            </a>
          )}

          {footerDetails.socials && (
            <div className='mt-5 flex flex-wrap items-center gap-5'>
              {Object.keys(footerDetails.socials).map((platformName) => {
                if (platformName && footerDetails.socials[platformName]) {
                  return (
                    <Link
                      href={footerDetails.socials[platformName]}
                      key={platformName}
                      aria-label={platformName}
                    >
                      {getPlatformIconByName(platformName)}
                    </Link>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
      <div className='text-foreground-accent mt-8 px-6 md:text-center'>
        <p>
          Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}.
          All rights reserved.
        </p>
        <p className='mt-2 text-sm text-gray-500'>
          Made with &hearts; by{' '}
          <a href='https://kanent.id.vn' target='_blank'>
            Kane Nguyen
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
