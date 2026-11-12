'use client';

import { IconArrowUp, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Proposal, UiMessage } from '../core/assistant/types';
import { dayLabel, timeLabel } from '../lib/datetime';
import { useAssistant } from '../state/assistant-provider';
import { useMeet } from '../state/meet-provider';

const SUGGESTIONS = ['today', 'free', 'conflicts', 'create'] as const;

function Avatar({ pulse = false }: { pulse?: boolean }) {
  return (
    <span className='relative flex size-8 shrink-0 items-center justify-center'>
      {pulse && (
        <span className='bg-primary/40 absolute inset-0 animate-ping rounded-full' />
      )}
      <span className='bg-primary text-primary-foreground relative flex size-8 items-center justify-center rounded-full'>
        <IconSparkles className='size-4' />
      </span>
    </span>
  );
}

function Thinking({ activity }: { activity: string }) {
  const t = useTranslations('meet.assistant');
  const known = ['checking', 'finding', 'conflicts', 'drafting'];
  const label = known.includes(activity)
    ? t(`activity.${activity}`)
    : t('thinking');
  return (
    <div
      className='animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2'
      role='status'
      aria-label={label}
    >
      <Avatar pulse />
      <div className='bg-card flex items-center gap-3 rounded-2xl border px-3 py-2'>
        <span className='flex gap-1' aria-hidden>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className='bg-primary size-1.5 animate-bounce rounded-full'
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span className='text-muted-foreground text-sm'>{label}</span>
      </div>
    </div>
  );
}

function ProposalCard({ messageId, p }: { messageId: string; p: Proposal }) {
  const t = useTranslations('meet');
  const a = useAssistant();
  const del = p.kind === 'delete';
  const pending =
    p.status === 'pending' || p.status === 'applying' || p.status === 'failed';
  const when =
    p.start && p.end
      ? `${dayLabel(p.start)} · ${p.allDay ? t('event.allDay') : `${timeLabel(p.start)} – ${timeLabel(p.end)}`}`
      : '';
  return (
    <div
      className={cn(
        'bg-card animate-in fade-in slide-in-from-bottom-2 mt-2 space-y-1.5 rounded-xl border p-3 transition-opacity',
        p.status === 'applied' && 'border-emerald-500',
        p.status === 'dismissed' && 'opacity-50'
      )}
    >
      <div className='text-muted-foreground flex items-center justify-between text-[11px] font-bold tracking-wide uppercase'>
        <span>{t(`assistant.proposal.${p.kind}`)}</span>
        {p.status === 'applied' && (
          <span className='text-emerald-600'>
            ✓{' '}
            {del
              ? t('assistant.proposal.deleted')
              : t('assistant.proposal.done')}
          </span>
        )}
        {p.status === 'dismissed' && (
          <span>{t('assistant.proposal.dismissed')}</span>
        )}
      </div>
      <div className={cn('font-semibold', del && 'line-through')}>
        {p.title}
      </div>
      {p.kind === 'update' && p.before && (
        <div className='text-muted-foreground text-xs line-through'>
          {dayLabel(p.before.start)} · {timeLabel(p.before.start)} –{' '}
          {timeLabel(p.before.end)}
        </div>
      )}
      <div className='text-muted-foreground text-sm'>{when}</div>
      {p.location && (
        <div className='text-muted-foreground text-sm'>📍 {p.location}</div>
      )}
      {p.calendarName && (
        <div className='text-muted-foreground text-xs'>{p.calendarName}</div>
      )}
      {pending && p.warnings.length > 0 && (
        <div className='rounded-lg bg-amber-500/10 p-2 text-xs font-medium text-amber-700 dark:text-amber-400'>
          {Array.from(new Set(p.warnings)).map((w) => (
            <div key={w}>⚠ {t(`conflict.${w}`)}</div>
          ))}
        </div>
      )}
      {p.status === 'failed' && (
        <div className='text-destructive text-xs'>{p.error}</div>
      )}
      {pending && (
        <div className='flex gap-2 pt-1'>
          <Button
            size='sm'
            variant={del ? 'destructive' : 'default'}
            disabled={p.status === 'applying'}
            onClick={() => void a.confirm(messageId, p.id)}
          >
            {p.status === 'failed'
              ? t('assistant.proposal.retry')
              : del
                ? t('assistant.proposal.confirmDelete')
                : t('assistant.proposal.confirm')}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            disabled={p.status === 'applying'}
            onClick={() => a.dismiss(messageId, p.id)}
          >
            {t('assistant.proposal.dismiss')}
          </Button>
        </div>
      )}
    </div>
  );
}

function Message({ m }: { m: UiMessage }) {
  const t = useTranslations('meet.assistant');
  const a = useAssistant();
  if (m.role === 'user') {
    return (
      <div className='animate-in fade-in slide-in-from-bottom-2 flex justify-end'>
        <div className='bg-primary text-primary-foreground max-w-[82%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm whitespace-pre-wrap'>
          {m.text}
        </div>
      </div>
    );
  }
  const errorText =
    m.text === 'rate_limited' || m.text === 'upstream_busy'
      ? t('error.rate')
      : m.text === 'server_misconfigured'
        ? t('error.setup')
        : m.text === 'network_error'
          ? t('error.network')
          : t('error.generic');
  return (
    <div className='animate-in fade-in slide-in-from-bottom-2 flex items-start gap-2'>
      <Avatar />
      <div className='max-w-[88%] min-w-0'>
        {m.isError ? (
          <div className='bg-destructive/10 text-destructive rounded-2xl rounded-tl-sm px-3.5 py-2 text-sm'>
            {errorText}
            <Button
              size='sm'
              variant='ghost'
              className='mt-1 h-7 px-0'
              onClick={() => void a.retry()}
            >
              {t('retryBtn')}
            </Button>
          </div>
        ) : (
          <>
            {m.text && (
              <div className='bg-card rounded-2xl rounded-tl-sm border px-3.5 py-2 text-sm whitespace-pre-wrap'>
                {m.text
                  .replace(/\*\*(.+?)\*\*/g, '$1')
                  .replace(/^#{1,6}\s+/gm, '')}
              </div>
            )}
            {m.proposals?.map((p) => (
              <ProposalCard key={p.id} messageId={m.id} p={p} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function AssistantView() {
  const t = useTranslations('meet.assistant');
  const a = useAssistant();
  const meet = useMeet();
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const busy = a.phase !== 'idle';
  const disabled = meet.mode === 'demo';

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [a.messages, a.phase]);

  const submit = () => {
    const v = text.trim();
    if (!v || busy || disabled) return;
    setText('');
    void a.send(v);
  };

  return (
    <div className='bg-card mx-auto flex h-[calc(100dvh-15rem)] min-h-[480px] w-full max-w-3xl flex-col overflow-hidden rounded-xl border'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-3'>
          <Avatar />
          <div>
            <h2 className='text-sm leading-tight font-semibold'>
              {t('title')}
            </h2>
            <p className='text-muted-foreground text-xs'>{t('subtitle')}</p>
          </div>
        </div>
        {a.messages.length > 0 && (
          <Button variant='ghost' size='sm' disabled={busy} onClick={a.reset}>
            {t('newChat')}
          </Button>
        )}
      </div>

      <div className='flex-1 space-y-3 overflow-y-auto p-4'>
        {a.messages.length === 0 && !busy ? (
          <div className='flex h-full flex-col items-center justify-center gap-5 text-center'>
            <div className='relative flex size-20 items-center justify-center'>
              <span className='bg-primary/15 absolute inset-0 animate-pulse rounded-full' />
              <span className='bg-primary/25 absolute inset-3 animate-pulse rounded-full [animation-delay:300ms]' />
              <span className='bg-primary text-primary-foreground relative flex size-12 items-center justify-center rounded-full'>
                <IconSparkles className='size-6' />
              </span>
            </div>
            <div>
              <p className='font-semibold'>{t('welcome')}</p>
              <p className='text-muted-foreground text-sm'>
                {t('welcomeHint')}
              </p>
            </div>
            <div className='grid w-full max-w-md gap-2'>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => void a.send(t(`suggest.${s}`))}
                  className='hover:bg-muted animate-in fade-in slide-in-from-bottom-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50'
                  style={{
                    animationDelay: `${i * 80}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  {t(`suggest.${s}`)}
                </button>
              ))}
            </div>
            {disabled && (
              <p className='text-muted-foreground text-xs'>{t('error.demo')}</p>
            )}
          </div>
        ) : (
          <>
            {a.messages.map((m) => (
              <Message key={m.id} m={m} />
            ))}
            {busy && <Thinking activity={a.activity} />}
          </>
        )}
        <div ref={end} />
      </div>

      <form
        className='flex items-end gap-2 border-t p-3'
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          maxLength={1000}
          disabled={disabled}
          placeholder={t('placeholder')}
          className='border-input bg-background focus-visible:ring-ring/50 max-h-32 min-h-10 flex-1 resize-none rounded-2xl border px-4 py-2 text-sm outline-none focus-visible:ring-[3px] disabled:opacity-50'
        />
        <Button
          type='submit'
          size='icon'
          className='size-10 rounded-full'
          disabled={!text.trim() || busy || disabled}
          aria-label={t('send')}
        >
          <IconArrowUp />
        </Button>
      </form>
    </div>
  );
}
