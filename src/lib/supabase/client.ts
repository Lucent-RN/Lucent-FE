import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from './env';

let client: SupabaseClient | null = null;

/** Browser client (cookie-backed session, shared with the server via @supabase/ssr). */
export function getSupabaseBrowser(): SupabaseClient {
  client ??= createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
