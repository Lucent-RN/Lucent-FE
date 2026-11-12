import type { Metadata } from 'next';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';
import MeetLanding from '@/features/landing/sections/meet-landing';

export const metadata: Metadata = {
  title: 'LucentMeet | All your calendars. One calm timeline.',
  description:
    'Merge Google and Apple calendars, catch conflicts before they happen, and let an AI assistant find the time.',
  openGraph: {
    title: 'LucentMeet',
    description: 'All your calendars. One calm timeline.',
    type: 'website'
  }
};

export default function MeetLandingPage() {
  return (
    <>
      <Header product='meet' />
      <main>
        <MeetLanding />
      </main>
      <Footer product='meet' />
    </>
  );
}
