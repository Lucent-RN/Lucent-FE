'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { landingLocalizeStrings } from '@/i18n/localize-strings';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { siteDetails } from '../data/site-details';
import { IMenuItem } from '../types';
import { cn } from '@/lib/utils';

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
    <header className='fixed inset-x-0 top-0 z-50 w-full'>
      <div className='relative w-full pt-4 sm:px-6 lg:px-8'>
        <nav
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-4 py-1 transition-all duration-300 md:px-6',
            isScrolled
              ? 'border-white/30 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5'
              : 'border-white/20 bg-white/60 shadow-[0_15px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/5 dark:bg-white/10'
          )}
        >
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center gap-3 rounded-full px-3 py-2 transition-all'
          >
            <Image
              src='/assets/app-icon.png'
              alt={siteDetails.siteName}
              width={60}
              height={60}
              className='h-11 w-11 rounded-2xl object-contain sm:h-12 sm:w-12 md:h-14 md:w-14'
            />

            <span className='text-foreground hidden font-sans text-lg font-semibold sm:inline-block md:text-xl lg:text-2xl'>
              {siteDetails.siteName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className='hidden items-center gap-2 md:flex'>
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.url}
                  className='text-foreground/80 hover:text-foreground relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-base font-medium transition-all duration-300'
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
                    className='text-foreground flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold tracking-[0.3em] uppercase transition-all hover:border-white/60 hover:bg-white/70 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
                className='text-foreground flex h-9 w-10 items-center justify-center rounded-2xl border border-white/30 bg-white/30 shadow-[0_10px_25px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
                className='bg-accent-foreground rounded-full border-white/30 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:border-white/60'
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
              className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 transition-all hover:-translate-y-0.5 focus:outline-none'
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
            className='dark:bg-background mt-1 rounded-3xl border-white/10 bg-white/95 pt-4 shadow-[0_35px_80px_rgba(15,23,42,0.25)] backdrop-blur-2xl md:hidden'
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <motion.ul
              className='flex flex-col gap-4 px-6 pt-2 pb-6'
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
                    className='text-foreground block rounded-2xl bg-white/40 px-4 py-3 text-base font-medium shadow-sm backdrop-blur hover:bg-white/70 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
                      className='text-foreground flex items-center gap-2 rounded-2xl border border-white/20 bg-white/30 px-4 py-3 text-sm font-semibold tracking-[0.3em] uppercase transition-all hover:border-white/40 hover:bg-white/60 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
                  className='text-foreground flex items-center gap-3 rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-base font-medium backdrop-blur transition-all hover:border-white/40 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
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
                  className='bg-accent-foreground block w-full rounded-2xl px-5 py-3 text-center text-base font-semibold text-white transition-all hover:-translate-y-0.5'
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
