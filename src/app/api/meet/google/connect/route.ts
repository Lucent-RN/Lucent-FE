import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { GOOGLE_CALENDAR_SCOPE, googleWebClientId } from '@/lib/supabase/env';
import { getSupabaseServer } from '@/lib/supabase/server';

/**
 * Starts "Connect a Google calendar". This is deliberately NOT Supabase sign-in: it is a
 * plain Google OAuth code flow, so you can connect as many Google accounts as you like
 * without touching the account you are signed in with.
 */
export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  const locale = /^(en|vi|jp|de)$/.test(searchParams.get('locale') ?? '')
    ? searchParams.get('locale')!
    : 'en';
  const back = `${origin}/${locale}/dashboard/meet/accounts`;

  const supabase = await getSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/${locale}/auth/sign-in`);
  if (!googleWebClientId)
    return NextResponse.redirect(`${back}?error=missing_google_client`);

  const state = randomBytes(16).toString('hex');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: googleWebClientId,
    redirect_uri: `${origin}/api/meet/google/callback`,
    response_type: 'code',
    scope: `openid email profile ${GOOGLE_CALENDAR_SCOPE}`,
    access_type: 'offline', // we need a refresh token: the server syncs in the background
    prompt: 'consent select_account', // let the user pick *which* Google account to add
    include_granted_scopes: 'true',
    state
  }).toString();

  const res = NextResponse.redirect(url);
  res.cookies.set('meet_oauth', JSON.stringify({ state, locale }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: origin.startsWith('https'),
    path: '/api/meet/google',
    maxAge: 600
  });
  return res;
}
