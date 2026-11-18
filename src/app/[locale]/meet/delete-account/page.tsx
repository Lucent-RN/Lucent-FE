import type { Metadata } from 'next';
import Footer from '@/features/landing/organisms/footer';
import Header from '@/features/landing/organisms/header';
import MeetDeleteAccountPage from '@/features/policy/pages/meet-delete-account-page';

export const metadata: Metadata = {
  title: 'LucentMeet | Delete your account',
  description:
    'How to permanently delete your LucentMeet account and all associated data, in the app or on the web.',
  openGraph: {
    title: 'LucentMeet | Delete your account',
    description: 'Permanently delete your LucentMeet account and data.',
    type: 'website'
  }
};

export default function MeetDeleteAccountRoute() {
  return (
    <>
      <Header product='meet' />
      <main>
        <MeetDeleteAccountPage />
      </main>
      <Footer product='meet' />
    </>
  );
}
