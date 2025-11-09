'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { siteDetails } from '../data/site-details';
import { IMenuItem } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const t = useTranslations(landingLocalizeStrings.header.getLocal);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const localizedMenuItems =
    (t.raw(landingLocalizeStrings.header.menu_items) as Array<{
      text: string;
    }>) || [];

  const menuItems: IMenuItem[] = localizedMenuItems.map((item, index) => ({
    text: item.text,
    url: index === 0 ? '#features' : index === 1 ? '#pricing' : '/policy'
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const switchLocale = (newLocale: 'en' | 'vi' | 'jp' | 'de') => {
    if (!pathname) return;
    const segments = pathname.split('/');
    const supported = ['en', 'vi', 'jp', 'de'];
    let target = '';
    if (supported.includes(segments[1])) {
      segments[1] = newLocale;
      target = segments.join('/');
    } else {
      target = `/${newLocale}${pathname}`;
    }
    router.push(target);
  };

  const handleThemeToggle = (e?: React.MouseEvent) => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    if (!document.startViewTransition) {
      setTheme(newMode);
      return;
    }

    // Set coordinates from the click event for view transition animation
    if (e) {
      root.style.setProperty('--x', `${e.clientX}px`);
      root.style.setProperty('--y', `${e.clientY}px`);
    }

    document.startViewTransition(() => {
      setTheme(newMode);
    });
  };

  return (
    <header className='bg-background fixed top-0 right-0 left-0 z-50 w-full'>
      <div className='w-full'>
        <nav
          className={`flex items-center justify-between px-5 py-2 transition-all duration-300 md:py-4 ${
            isScrolled ? 'shadow-md' : 'shadow-none'
          }`}
        >
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3 md:gap-4'
          >
            <Image
              src='/assets/app-icon.png'
              alt={siteDetails.siteName}
              width={60}
              height={60}
              className='h-12 w-12 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16'
            />
            <span className='manrope text-foreground text-base font-semibold sm:text-lg md:text-xl lg:text-2xl'>
              {siteDetails.siteName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className='hidden space-x-6 md:flex md:items-center'>
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.url}
                  className='text-foreground hover:text-accent-foreground transition-colors'
                >
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type='button'
                    className='text-foreground hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-2 transition-colors focus:outline-none'
                    aria-label='Select language'
                  >
                    <Image
                      src={`/assets/countries/${locale}.png`}
                      alt={`${locale} flag`}
                      width={20}
                      height={20}
                      className='size-5 object-cover'
                    />
                    <span className='uppercase'>{locale}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => switchLocale('en')}>
                    <Image
                      src='/assets/countries/en.png'
                      alt='English flag'
                      width={18}
                      height={18}
                      className='mr-2 size-4 object-cover'
                    />
                    {t(landingLocalizeStrings.header.language.en)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('vi')}>
                    <Image
                      src='/assets/countries/vi.png'
                      alt='Vietnam flag'
                      width={18}
                      height={18}
                      className='mr-2 size-4 object-cover'
                    />
                    {t(landingLocalizeStrings.header.language.vi)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('jp')}>
                    <Image
                      src='/assets/countries/jp.png'
                      alt='Japanese flag'
                      width={18}
                      height={18}
                      className='mr-2 size-4 object-cover'
                    />
                    {t(landingLocalizeStrings.header.language.jp)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('de')}>
                    <Image
                      src='/assets/countries/de.png'
                      alt='German flag'
                      width={18}
                      height={18}
                      className='mr-2 size-4 object-cover'
                    />
                    {t(landingLocalizeStrings.header.language.de)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <button
                onClick={handleThemeToggle}
                type='button'
                className='text-foreground hover:text-accent-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none'
                aria-label='Toggle theme'
              >
                {mounted && resolvedTheme === 'dark' ? (
                  <Sun className='h-5 w-5' />
                ) : (
                  <Moon className='h-5 w-5' />
                )}
              </button>
            </li>
            <li>
              <Link
                href='#cta'
                className='bg-accent-foreground rounded-full px-8 py-3 text-white transition-colors hover:opacity-90'
              >
                {t(landingLocalizeStrings.header.download)}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMenu}
              type='button'
              className='bg-accent-foreground flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:opacity-90 focus:outline-none'
              aria-controls='mobile-menu'
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
              <span className='sr-only'>Toggle navigation</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu with Motion Transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id='mobile-menu'
            className='bg-background shadow-lg md:hidden'
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <motion.ul
              className='flex flex-col space-y-4 px-6 pt-1 pb-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.url}
                    className='text-foreground hover:text-primary block'
                    onClick={toggleMenu}
                  >
                    {item.text}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + menuItems.length * 0.05,
                  duration: 0.3
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      className='text-foreground hover:text-primary flex items-center gap-2 rounded-full px-3 py-2 transition-colors focus:outline-none'
                      aria-label='Select language'
                    >
                      <Image
                        src={`/assets/countries/${locale}.png`}
                        alt={`${locale} flag`}
                        width={20}
                        height={20}
                        className='size-5 object-cover'
                      />
                      <span className='uppercase'>{locale}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuItem
                      onClick={() => {
                        switchLocale('en');
                        toggleMenu();
                      }}
                    >
                      <Image
                        src='/assets/countries/en.png'
                        alt='English flag'
                        width={18}
                        height={18}
                        className='mr-2 size-4 object-cover'
                      />
                      {t(landingLocalizeStrings.header.language.en)}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        switchLocale('vi');
                        toggleMenu();
                      }}
                    >
                      <Image
                        src='/assets/countries/vi.png'
                        alt='Vietnam flag'
                        width={18}
                        height={18}
                        className='mr-2 size-4 object-cover'
                      />
                      {t(landingLocalizeStrings.header.language.vi)}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        switchLocale('jp');
                        toggleMenu();
                      }}
                    >
                      <Image
                        src='/assets/countries/jp.png'
                        alt='Japanese flag'
                        width={18}
                        height={18}
                        className='mr-2 size-4 object-cover'
                      />
                      {t(landingLocalizeStrings.header.language.jp)}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        switchLocale('de');
                        toggleMenu();
                      }}
                    >
                      <Image
                        src='/assets/countries/de.png'
                        alt='German flag'
                        width={18}
                        height={18}
                        className='mr-2 size-4 object-cover'
                      />
                      {t(landingLocalizeStrings.header.language.de)}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + (menuItems.length + 1) * 0.05,
                  duration: 0.3
                }}
              >
                <button
                  onClick={(e) => {
                    handleThemeToggle(e);
                    toggleMenu();
                  }}
                  type='button'
                  className='text-foreground hover:text-primary flex items-center gap-2'
                  aria-label='Toggle theme'
                >
                  {mounted && resolvedTheme === 'dark' ? (
                    <>
                      <Sun className='h-5 w-5' />
                      <span>{t(landingLocalizeStrings.header.light_mode)}</span>
                    </>
                  ) : (
                    <>
                      <Moon className='h-5 w-5' />
                      <span>{t(landingLocalizeStrings.header.dark_mode)}</span>
                    </>
                  )}
                </button>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + (menuItems.length + 1) * 0.05,
                  duration: 0.3
                }}
              >
                <Link
                  href='#cta'
                  className='bg-accent-foreground block w-fit rounded-full px-5 py-2 text-white transition-colors hover:opacity-90'
                  onClick={toggleMenu}
                >
                  {t(landingLocalizeStrings.header.get_started)}
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
