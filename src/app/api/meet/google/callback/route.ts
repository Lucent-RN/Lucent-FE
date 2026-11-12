import { NextResponse, type NextRequest } from 'next/server';
import { supabaseKey, supabaseUrl } from '@/lib/supabase/env';
import { getSupabaseServer } from '@/lib/supabase/server';

/** Google sends the user back here with a one-time code; the backend exchanges and stores it encrypted. */
export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  let saved: { state?: string; locale?: string } = {};
  try {
    saved = JSON.parse(request.cookies.get('meet_oauth')?.value ?? '{}');
  } catch {
    /* ignore */
  }
  const locale = saved.locale ?? 'en';
  const back = (query: string) => {
    const res = NextResponse.redirect(
      `${origin}/${locale}/dashboard/meet/accounts?${query}`
    );
    res.cookies.delete({ name: 'meet_oauth', path: '/api/meet/google' });
    return res;
  };

  if (searchParams.get('error')) return back('error=cancelled');
  const code = searchParams.get('code');
  if (!code || !saved.state || searchParams.get('state') !== saved.state)
    return back('error=state');

  const supabase = await getSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!user || !session)
    return NextResponse.redirect(`${origin}/${locale}/auth/sign-in`);

  const res = await fetch(`${supabaseUrl}/functions/v1/link-google-account`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session.access_token}`,
      apikey: supabaseKey
    },
    body: JSON.stringify({
      auth_code: code,
      redirect_uri: `${origin}/api/meet/google/callback`,
      defer_sync: true // respond fast; events arrive through Realtime
    })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    return back(`error=${encodeURIComponent(body?.error ?? 'link_failed')}`);
  return back(
    `connected=${encodeURIComponent(body?.account?.account_email ?? '')}`
  );
}
