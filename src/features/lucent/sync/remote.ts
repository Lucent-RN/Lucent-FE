import type { SupabaseClient } from '@supabase/supabase-js';
import type { Change, Remote, RemoteRow } from './engine';

const iso = (ms: number) => new Date(ms).toISOString();

/** The two RPCs from supabase/migrations/20261119000001_lucent_sync.sql. */
export function createSupabaseRemote(supabase: SupabaseClient): Remote {
  return {
    async push(deviceId, changes: Change[]) {
      const { data, error } = await supabase.rpc('lucent_push', {
        p_device_id: deviceId,
        p_changes: changes.map((c) => ({
          entity: c.entity,
          id: c.id,
          data: c.data,
          updated_at: iso(c.updatedAt),
          deleted_at: c.deletedAt === null ? null : iso(c.deletedAt),
        })),
      });
      if (error) throw error;
      return data as { applied: number; skipped: number };
    },
    async pull(after, limit) {
      const { data, error } = await supabase.rpc('lucent_pull', { p_after: after, p_limit: limit });
      if (error) throw error;
      return (data ?? []).map((r: any): RemoteRow => ({
        entity: r.entity,
        id: r.id,
        data: r.data ?? {},
        updatedAt: Date.parse(r.updated_at),
        deletedAt: r.deleted_at ? Date.parse(r.deleted_at) : null,
        deviceId: r.device_id,
        seq: Number(r.seq),
      }));
    },
  };
}
