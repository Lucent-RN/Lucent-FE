'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

import { siteDetails } from '../data/site-details';
import { menuItems } from '../data/menu-items';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header className='fixed top-0 right-0 left-0 z-50 w-full bg-white'>
      <div className='w-full'>
        <nav
          className={`flex items-center justify-between px-5 py-2 transition-all duration-300 md:py-4 ${
            isScrolled ? 'shadow-md' : 'shadow-none'
          }`}
        >
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/assets/app-icon.svg'
              alt={siteDetails.siteName}
              className='h-24 w-24 rounded-full md:h-16 md:w-16'
              width={96}
              height={96}
            />
            <span className='manrope text-foreground cursor-pointer text-lg font-semibold md:text-xl'>
              {siteDetails.siteName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className='hidden space-x-6 md:flex'>
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.url}
                  className='text-foreground hover:text-foreground-accent transition-colors'
                >
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href='#cta'
                className='bg-primary hover:bg-primary-accent rounded-full px-8 py-3 text-black transition-colors'
              >
                Download
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={toggleMenu}
              type='button'
              className='bg-primary flex h-10 w-10 items-center justify-center rounded-full text-black focus:outline-none'
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
            className='bg-white shadow-lg md:hidden'
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
                <Link
                  href='#cta'
                  className='bg-primary hover:bg-primary-accent block w-fit rounded-full px-5 py-2 text-black'
                  onClick={toggleMenu}
                >
                  Get Started
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
