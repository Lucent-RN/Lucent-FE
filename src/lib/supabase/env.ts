/** Same project as the mobile apps (see supabase/ at the repo root). */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseKey.length > 0;
