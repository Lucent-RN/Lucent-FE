'use client';

import { usePathname } from 'next/navigation';
import { CosmicSky } from '@/components/brand/cosmic-sky';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const LUCENT_AREA = /\/dashboard\/lucent(\/|$)/;

/**
 * Lucent (Pomodoro) is a standalone, distraction-free page with its own top bar (LucentShell),
 * so it gets no sidebar or dashboard header. Everything else (LucentMeet) keeps the sidebar.
 */
export function DashboardFrame({
  defaultOpen,
  children
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';

  if (LUCENT_AREA.test(pathname)) {
    return (
      <>
        <CosmicSky />
        {children}
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CosmicSky />
      <AppSidebar />
      <SidebarInset className='bg-transparent'>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
