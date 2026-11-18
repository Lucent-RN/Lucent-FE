import type { Metadata } from 'next';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';
import MeetPrivacyPage from '@/features/policy/pages/meet-privacy-page';

export const metadata: Metadata = {
  title: 'LucentMeet | Privacy Policy',
  description:
    'How the LucentMeet app and website handle your calendar data: what we collect, why, and the choices you have.',
  openGraph: {
    title: 'LucentMeet | Privacy Policy',
    description: 'How LucentMeet handles your calendar data.',
    type: 'website'
  }
};

export default function MeetPrivacyRoute() {
  return (
    <>
      <Header product='meet' />
      <main>
        <MeetPrivacyPage />
      </main>
      <Footer product='meet' />
    </>
  );
}
