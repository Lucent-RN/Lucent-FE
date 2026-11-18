'use client';

import { FunctionsHttpError } from '@supabase/supabase-js';
import { CheckCircle2, Globe, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Link } from '@/i18n/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { useSupabaseUser } from '@/lib/supabase/use-user';

type Status = 'idle' | 'deleting' | 'deleted' | 'error';

/** Web self-service deletion: sign in with Google, confirm, then call the `delete-account` edge function. */
export default function MeetDeleteAccountAction() {
  const t = useTranslations('meet-delete-account.web');
  const locale = useLocale();
  const { user, loading } = useSupabaseUser();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deleteAccount = async () => {
    setStatus('deleting');
    setErrorMessage(null);
    const sb = getSupabaseBrowser();
    const { error } = await sb.functions.invoke('delete-account', {
      body: { confirm: true }
    });
    if (error) {
      let message = error.message;
      if (error instanceof FunctionsHttpError) {
        const payload = await error.context.json().catch(() => ({}));
        message = payload?.message ?? message;
      }
      setErrorMessage(message);
      setStatus('error');
      return;
    }
    // The auth user no longer exists: drop the local session too.
    await sb.auth.signOut().catch(() => undefined);
    setStatus('deleted');
  };

  const signInHref = `/auth/sign-in?next=${encodeURIComponent(`/${locale}/meet/delete-account`)}`;

  return (
    <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-6 text-[#cffafe]/90 backdrop-blur-md sm:p-7'>
      <div className='flex items-center gap-3.5'>
        <span className='flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9]'>
          <Globe className='size-4' />
        </span>
        <h2 className='text-lg font-semibold text-white sm:text-xl'>
          {t('title')}
        </h2>
      </div>

      <div className='mt-3.5 space-y-4 text-sm leading-relaxed sm:pl-11 sm:text-base'>
        {status === 'deleted' ? (
          <p
            role='status'
            className='flex items-start gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-200'
          >
            <CheckCircle2 className='mt-0.5 size-4 shrink-0' />
            {t('success')}
          </p>
        ) : !isSupabaseConfigured ? (
          <p className='text-[#a5e3f4]'>{t('unavailable')}</p>
        ) : loading ? (
          <p className='flex items-center gap-2 text-[#a5e3f4]'>
            <Loader2 className='size-4 animate-spin' />
            {t('checking')}
          </p>
        ) : !user ? (
          <>
            <p>{t('signedOut')}</p>
            <Link
              href={signInHref}
              className='inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-5 py-2.5 text-sm font-semibold text-[#67e8f9] hover:bg-[#22d3ee]/20'
            >
              {t('signIn')}
            </Link>
          </>
        ) : (
          <>
            <p>
              {t.rich('signedInAs', {
                email: user.email ?? user.id,
                b: (chunks) => (
                  <span className='font-semibold text-white'>{chunks}</span>
                )
              })}
            </p>
            {status === 'error' && (
              <p
                role='alert'
                className='rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200'
              >
                {t('error')}
                {errorMessage ? ` (${errorMessage})` : ''}
              </p>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type='button'
                  disabled={status === 'deleting'}
                  className='inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60'
                >
                  {status === 'deleting' && (
                    <Loader2 className='size-4 animate-spin' />
                  )}
                  {t('button')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirmBody')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-red-500 text-white hover:bg-red-600'
                    onClick={() => void deleteAccount()}
                  >
                    {t('confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </section>
  );
}
