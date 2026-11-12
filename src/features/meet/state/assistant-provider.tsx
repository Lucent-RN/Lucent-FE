'use client';

import { useLocale } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { CalendarSource } from '../core/domain';
import {
  executeTool,
  TOOL_ACTIVITY,
  type ToolEnv
} from '../core/assistant/tool-executor';
import { trimHistory } from '../core/assistant/history';
import type {
  ApiMessage,
  AssistantPhase,
  ContentBlock,
  Proposal,
  UiMessage
} from '../core/assistant/types';
import { meetApi } from '../data/meet-api';
import { useMeet } from './meet-provider';

const MAX_TOOL_ROUNDS = 6;

export interface AssistantValue {
  messages: UiMessage[];
  phase: AssistantPhase;
  activity: string;
  send(text: string): Promise<void>;
  retry(): Promise<void>;
  reset(): void;
  confirm(messageId: string, proposalId: string): Promise<void>;
  dismiss(messageId: string, proposalId: string): void;
}

const AssistantContext = createContext<AssistantValue | null>(null);

let counter = 0;
const nextId = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;

const textOf = (blocks: ContentBlock[]) =>
  blocks
    .filter(
      (b): b is Extract<ContentBlock, { type: 'text' }> => b.type === 'text'
    )
    .map((b) => b.text)
    .join('\n')
    .trim();

/**
 * The same assistant as the phone: Gemini (via the `assistant-chat` Edge Function) decides what to
 * look up, and every tool runs HERE, in the browser, against the loaded calendar and the shared
 * conflict engine. create/update/delete are only proposals until the user confirms.
 */
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const m = useMeet();
  const locale = useLocale();
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [phase, setPhase] = useState<AssistantPhase>('idle');
  const [activity, setActivity] = useState('thinking');

  const history = useRef<ApiMessage[]>([]);
  const notes = useRef<string[]>([]); // user actions the model has not heard about yet
  const busy = useRef(false);
  const lastUserText = useRef('');
  const meetRef = useRef(m);
  useEffect(() => {
    meetRef.current = m;
  });

  const buildEnv = useCallback((): ToolEnv => {
    const d = meetRef.current;
    return {
      events: d.events,
      allEvents: d.allEvents,
      // Apple (EventKit) calendars are read-only on the web, so new events are never proposed there.
      sources: d.sources.map((src) =>
        d.canWrite(src)
          ? src
          : new CalendarSource(
              src.calendarId,
              src.accountId,
              src.provider,
              src.externalCalendarId,
              src.calendarName,
              src.colorHex,
              src.isVisible,
              true
            )
      ),
      preference: d.preference,
      timeZone:
        d.user?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      engine: d.engine,
      now: new Date()
    };
  }, []);

  const run = useCallback(
    async (text: string, showUser: boolean) => {
      if (busy.current) return;
      busy.current = true;
      lastUserText.current = text;
      const rollbackTo = history.current.length;
      setMessages((list) => [
        ...list.filter((x) => !x.isError),
        ...(showUser ? [{ id: nextId(), role: 'user' as const, text }] : [])
      ]);
      const prefix = notes.current.length
        ? `[Context: ${notes.current.join('; ')}]\n`
        : '';
      notes.current = [];
      history.current = [
        ...history.current,
        { role: 'user', content: prefix + text }
      ];
      setPhase('thinking');
      setActivity('thinking');

      const proposals: Proposal[] = [];
      let reply = '';
      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const env = buildEnv();
          const res = await meetApi.assistantTurn(
            trimHistory(history.current),
            {
              now: env.now.toISOString(),
              timezone: env.timeZone,
              locale
            }
          );
          history.current = [
            ...history.current,
            { role: 'assistant', content: res.content }
          ];
          reply = textOf(res.content);
          const uses = res.content.filter(
            (b): b is Extract<ContentBlock, { type: 'tool_use' }> =>
              b.type === 'tool_use'
          );
          if (uses.length === 0) break;

          setPhase('acting');
          const results: ContentBlock[] = [];
          for (const use of uses) {
            setActivity(TOOL_ACTIVITY[use.name] ?? 'thinking');
            const out = executeTool(use.name, use.input, buildEnv());
            if (out.proposal)
              proposals.push({
                ...out.proposal,
                id: nextId(),
                status: 'pending'
              });
            results.push({
              type: 'tool_result',
              tool_use_id: use.id,
              content: out.content,
              ...(out.isError ? { is_error: true } : {})
            });
          }
          history.current = [
            ...history.current,
            { role: 'user', content: results }
          ];
          setPhase('thinking');
          await new Promise((r) => setTimeout(r, 0));
        }
        setMessages((list) => [
          ...list,
          {
            id: nextId(),
            role: 'assistant',
            text: reply,
            proposals: proposals.length ? proposals : undefined,
            animate: true
          }
        ]);
      } catch (e) {
        history.current = history.current.slice(0, rollbackTo);
        setMessages((list) => [
          ...list,
          {
            id: nextId(),
            role: 'assistant',
            text: (e as { code?: string })?.code ?? 'error',
            isError: true
          }
        ]);
      } finally {
        busy.current = false;
        setPhase('idle');
      }
    },
    [buildEnv, locale]
  );

  const send = useCallback((text: string) => run(text.trim(), true), [run]);
  const retry = useCallback(async () => {
    if (lastUserText.current) await run(lastUserText.current, false);
  }, [run]);
  const reset = useCallback(() => {
    if (busy.current) return;
    history.current = [];
    notes.current = [];
    setMessages([]);
  }, []);

  const patch = useCallback(
    (messageId: string, proposalId: string, change: Partial<Proposal>) =>
      setMessages((list) =>
        list.map((msg) =>
          msg.id !== messageId
            ? msg
            : {
                ...msg,
                proposals: msg.proposals?.map((p) =>
                  p.id === proposalId ? { ...p, ...change } : p
                )
              }
        )
      ),
    []
  );

  const confirm = useCallback(
    async (messageId: string, proposalId: string) => {
      const p = messages
        .find((x) => x.id === messageId)
        ?.proposals?.find((x) => x.id === proposalId);
      if (!p || p.status !== 'pending') return;
      patch(messageId, proposalId, { status: 'applying' });
      const d = meetRef.current;
      try {
        if (p.kind !== 'create') {
          const target = d.allEvents.find((e) => e.eventId === p.eventId);
          if (!target || !d.canWrite(d.sourceOf(target)))
            throw new Error('Read-only calendar: edit it on the phone');
        }
        if (p.kind === 'create' && p.start && p.end && p.calendarId) {
          await d.createEvent({
            calendarId: p.calendarId,
            title: p.title,
            location: p.location,
            startTime: p.start,
            endTime: p.end,
            isAllDay: p.allDay
          });
        } else if (p.kind === 'update' && p.eventId && p.start && p.end) {
          await d.updateEvent(p.eventId, {
            title: p.title,
            location: p.location,
            startTime: p.start,
            endTime: p.end
          });
        } else if (p.kind === 'delete' && p.eventId) {
          await d.deleteEvent(p.eventId);
        }
        patch(messageId, proposalId, { status: 'applied' });
        notes.current.push(`the user confirmed: ${p.kind} "${p.title}"`);
      } catch (e) {
        patch(messageId, proposalId, {
          status: 'failed',
          error: e instanceof Error ? e.message : ''
        });
      }
    },
    [messages, patch]
  );

  const dismiss = useCallback(
    (messageId: string, proposalId: string) => {
      patch(messageId, proposalId, { status: 'dismissed' });
      notes.current.push('the user dismissed a proposal');
    },
    [patch]
  );

  const value = useMemo<AssistantValue>(
    () => ({ messages, phase, activity, send, retry, reset, confirm, dismiss }),
    [messages, phase, activity, send, retry, reset, confirm, dismiss]
  );
  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantValue {
  const v = useContext(AssistantContext);
  if (!v)
    throw new Error('useAssistant must be used inside <AssistantProvider>');
  return v;
}
