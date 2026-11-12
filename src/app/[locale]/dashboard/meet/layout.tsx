import { Suspense } from 'react';
import { MeetShell } from '@/features/meet/components/meet-shell';
import { AssistantProvider } from '@/features/meet/state/assistant-provider';
import { MeetProvider } from '@/features/meet/state/meet-provider';

export default function MeetLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // useSearchParams (demo flag) needs a Suspense boundary
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
