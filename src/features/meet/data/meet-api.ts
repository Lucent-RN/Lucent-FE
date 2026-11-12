import { FunctionsHttpError } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { ApiMessage, TurnResponse } from '../core/assistant/types';
import type { NewEventInput, PushResult } from '../core/domain';

export class MeetApiError extends Error {
  constructor(
    readonly code: string,
    message?: string,
    readonly status?: number
  ) {
    super(message ?? code);
    this.name = 'MeetApiError';
  }
}

/** Calls a Supabase Edge Function and normalises its `{ error, message }` contract. */
async function call<T>(
  name: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const { data, error } = await getSupabaseBrowser().functions.invoke<T>(name, {
    body
  });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => ({}));
      throw new MeetApiError(
        payload?.error ?? 'function_error',
        payload?.message,
        error.context.status
      );
    }
    throw new MeetApiError('network_error', error.message);
  }
  return data as T;
}

const toEventBody = (i: Partial<NewEventInput>) => ({
  title: i.title,
  description: i.description,
  location: i.location,
  start_time: i.startTime?.toISOString(),
  end_time: i.endTime?.toISOString(),
  is_all_day: i.isAllDay,
  status: i.status
});

interface PushResponse {
  event: { event_id: string } | null;
  conflicts: Array<{
    schedule_conflicts:
      | { conflict_type: string; is_resolved: boolean }
      | Array<{ conflict_type: string; is_resolved: boolean }>;
  }>;
}

const conflictTypes = (r: PushResponse): string[] =>
  (r.conflicts ?? []).flatMap((c) => {
    const list = Array.isArray(c.schedule_conflicts)
      ? c.schedule_conflicts
      : [c.schedule_conflicts];
    return list.filter((x) => !x.is_resolved).map((x) => x.conflict_type);
  });

export const meetApi = {
  async createEvent(input: NewEventInput): Promise<PushResult> {
    const r = await call<PushResponse>('push-event', {
      action: 'create',
      calendar_id: input.calendarId,
      event: toEventBody(input)
    });
    return {
      eventId: r.event?.event_id ?? '',
      conflictTypes: conflictTypes(r)
    };
  },
  async updateEvent(
    eventId: string,
    patch: Partial<NewEventInput>
  ): Promise<PushResult> {
    const r = await call<PushResponse>('push-event', {
      action: 'update',
      event_id: eventId,
      event: toEventBody(patch)
    });
    return { eventId, conflictTypes: conflictTypes(r) };
  },
  async deleteEvent(eventId: string): Promise<void> {
    await call('push-event', { action: 'delete', event_id: eventId });
  },
  async syncNow(): Promise<void> {
    await call('sync-calendars', {});
  },
  async disconnectAccount(accountId: string): Promise<boolean> {
    const r = await call<{ provider_revoked: boolean }>('disconnect-account', {
      account_id: accountId
    });
    return r.provider_revoked;
  },
  assistantTurn(
    messages: ApiMessage[],
    context: { now: string; timezone: string; locale: string }
  ) {
    return call<TurnResponse>('assistant-chat', { messages, context });
  }
};
