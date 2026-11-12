import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

/** Supabase OAuth (Google sign-in) lands here: exchange the code, then go where the user was heading. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? `/${locale}/dashboard/meet`;
  // only same-site paths: never an open redirect
  const next =
    rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : `/${locale}/dashboard/meet`;

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/${locale}/auth/sign-in?error=oauth`);
}
