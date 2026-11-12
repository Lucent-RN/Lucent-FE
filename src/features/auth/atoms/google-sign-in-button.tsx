'use client';

import { IconBrandGoogle } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Signs in with Google through Supabase. Only basic profile scopes: your calendars are connected
 * separately (Meet → Accounts), so signing in never depends on — or changes — which calendars you use.
 */
export default function GoogleSignInButton() {
  const t = useTranslations('signin');
  const locale = useLocale();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    const next = params.get('next') ?? `/${locale}/dashboard/meet`;
    const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: 'select_account' }
      }
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
    }
  };

  return (
    <Button
      className='h-11 w-full'
      disabled={busy || !isSupabaseConfigured}
      onClick={() => void go()}
    >
      <IconBrandGoogle />
      {t('google')}
    </Button>
  );
}
