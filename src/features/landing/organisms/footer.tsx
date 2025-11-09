import Link from 'next/link';
import React from 'react';

import { getPlatformIconByName } from '@/lib/utils';
import Image from 'next/image';
import { siteDetails } from '../data/site-details';
import { IMenuItem, ISocials } from '../types';
import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

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
    telephone: '',
    socials: {
      github: 'https://github.com',
      // x: 'https://twitter.com/x',
      twitter: 'https://twitter.com/Twitter',
      facebook: 'https://facebook.com',
      // youtube: 'https://youtube.com',
      linkedin: 'https://www.linkedin.com',
      // threads: 'https://www.threads.net',
      instagram: 'https://www.instagram.com'
    }
  };

  return (
    <footer className='bg-hero-background text-foreground py-10'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-3'>
        <div>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/assets/app-icon.png'
              alt='logo'
              width={96}
              height={96}
              className='h-14 w-14 md:h-16 md:w-16'
            />
          </Link>
          <p className='text-foreground-accent mt-3.5'>
            {footerDetails.subheading}
          </p>
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
