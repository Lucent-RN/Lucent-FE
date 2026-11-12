import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import {
  isSupabaseConfigured,
  supabaseKey,
  supabaseUrl
} from './lib/supabase/env';

const intl = createMiddleware(routing);

/** LucentMeet web needs a signed-in user (except ?demo=1, which only shows sample data). */
const PROTECTED = /^\/(en|vi|jp|de)\/dashboard\/meet(\/|$)/;

export default async function middleware(request: NextRequest) {
  const response = intl(request);
  const { pathname, searchParams } = request.nextUrl;
  const needsSession =
    PROTECTED.test(pathname) || /^\/(en|vi|jp|de)\/auth(\/|$)/.test(pathname);
  if (!isSupabaseConfigured || !needsSession) return response;

  // Keep the Supabase session fresh and forward refreshed cookies on whatever we return.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) =>
        list.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        })
    }
  });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && PROTECTED.test(pathname) && searchParams.get('demo') !== '1') {
    const locale = pathname.split('/')[1];
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/sign-in`;
    url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  return response;
}

export const config = {
  // pages only: skip Next internals, files with an extension and API routes
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
