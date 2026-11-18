import KBar from '@/components/kbar';
import { DashboardFrame } from '@/components/layout/dashboard-frame';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Lucent',
  description: 'Your focus and calendars, in one place'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  // open on the first visit; afterwards respect the user's choice
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';
  return (
    <KBar>
      <DashboardFrame defaultOpen={defaultOpen}>{children}</DashboardFrame>
    </KBar>
  );
}
