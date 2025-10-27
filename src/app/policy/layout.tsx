import type { Metadata } from 'next';
import { Manrope, Source_Sans_3 } from 'next/font/google';

import { siteDetails } from '@/features/landing/data/site-details';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';

const manrope = Manrope({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Legal - ${siteDetails.siteName}`,
  description:
    "Privacy Policy, Terms of Use, and Imprint for Lucent. We are committed to our users' right to privacy.",
  openGraph: {
    title: `Legal - ${siteDetails.siteName}`,
    description: 'Privacy Policy, Terms of Use, and Imprint for Lucent',
    url: `${siteDetails.siteUrl}policy`,
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
    title: `Legal - ${siteDetails.siteName}`,
    description: 'Privacy Policy, Terms of Use, and Imprint for Lucent',
    images: ['/images/twitter-image.jpg']
  }
};

export default function PolicyLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${manrope.className} ${sourceSans.className} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
