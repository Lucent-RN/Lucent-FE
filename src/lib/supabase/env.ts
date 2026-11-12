/** Same project as the mobile apps (see supabase/ at the repo root). */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseKey.length > 0;

/** The Google *web* OAuth client (same one the apps use as `webClientId`). */
export const googleWebClientId =
  process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

export const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
