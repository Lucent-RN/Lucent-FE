import { LucentShell } from '@/features/lucent/components/lucent-shell';
import { LucentProvider } from '@/features/lucent/state/lucent-provider';

export default function LucentLayout({ children }: { children: React.ReactNode }) {
  return (
    <LucentProvider>
      <LucentShell>{children}</LucentShell>
    </LucentProvider>
  );
}
