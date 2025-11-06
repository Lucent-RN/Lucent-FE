import type { Metadata } from 'next';

import { siteDetails } from '@/features/landing/data/site-details';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';

export const metadata: Metadata = {
  title: `${siteDetails.siteName} | Legal`,
  description:
    "Privacy Policy, Terms of Use, and Imprint for Lucent. We are committed to our users' right to privacy.",
  openGraph: {
    title: `${siteDetails.siteName} | Legal`,
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
    title: `${siteDetails.siteName} | Legal`,
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
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
