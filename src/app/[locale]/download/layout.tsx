import type { Metadata } from 'next';
import { Manrope, Source_Sans_3 } from 'next/font/google';

import { siteDetails } from '@/features/landing/data/site-details';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';

const manrope = Manrope({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${siteDetails.siteName} | Download`,
  description: 'Download Lucent for free.',
  openGraph: {
    title: `${siteDetails.siteName} | Download`,
    description: 'Download Lucent for free.',
    url: `${siteDetails.siteUrl}download`,
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 675,
        alt: siteDetails.siteName
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteDetails.siteName} | Download`,
    description: 'Download Lucent for free.',
    images: ['/images/twitter-image.jpg']
  }
};

export default function DownloadLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
