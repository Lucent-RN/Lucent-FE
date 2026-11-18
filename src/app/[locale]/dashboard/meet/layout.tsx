import { Suspense } from 'react';
import { redirect } from '@/i18n/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getSupabaseServer } from '@/lib/supabase/server';
import { MeetShell } from '@/features/meet/components/meet-shell';
import { AssistantProvider } from '@/features/meet/state/assistant-provider';
import { MeetProvider } from '@/features/meet/state/meet-provider';

export default async function MeetLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Like the mobile app, LucentMeet opens only after sign-in. The middleware already redirects
  // signed-out visitors (keeping the exact page in `next`); this is the server-side backstop.
  if (isSupabaseConfigured) {
    const { locale } = await params;
    const {
      data: { user }
    } = await (await getSupabaseServer()).auth.getUser();
    if (!user) {
      redirect({
        href: `/auth/sign-in?next=${encodeURIComponent(`/${locale}/dashboard/meet`)}`,
        locale
      });
    }
  }

  return (
    <Suspense fallback={null}>
      <MeetProvider>
        <AssistantProvider>
          <MeetShell>{children}</MeetShell>
        </AssistantProvider>
      </MeetProvider>
    </Suspense>
  );
}
