import { Noto_Sans, Noto_Sans_JP } from 'next/font/google';

export const notoSans = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
  preload: true
});

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans-ja',
  display: 'swap',
  adjustFontFallback: true,
  preload: true
});
