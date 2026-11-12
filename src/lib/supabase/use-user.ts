'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from './client';
import { isSupabaseConfigured } from './env';

/** The signed-in Supabase user (null when signed out or when Supabase is not configured). */
export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = getSupabaseBrowser();
    let alive = true;
    sb.auth.getUser().then(({ data }) => {
      if (alive) {
        setUser(data.user);
        setLoading(false);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
