'use client';

import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotate
} from '@tabler/icons-react';
import { useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { OrbitRing } from '@/components/brand/orbit-ring';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isLongBreak, formatClock } from '../core/timer';
import { dayKey } from '../core/stats';
import { useLucent } from '../state/lucent-provider';
import { FocusSky } from './focus-sky';
import { useFocusDarkMode, useSmoothProgress } from './use-focus-effects';

const NONE = 'none';

/** Follows the `dark` class on <html> (set by the site's theme switcher), whichever provider toggles it. */
function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains('dark'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/** The ring on its own component, so the 60 fps progress only re-renders the SVG. */
function SmoothOrbit({
  endAt,
  total,
  progress,
  dark,
  orbiting,
  children
}: {
  endAt: number | null;
  total: number;
  progress: number;
  dark: boolean;
  orbiting: boolean;
  children: React.ReactNode;
}) {
  const smooth = useSmoothProgress({ endAt, total, progress });
  return (
    <OrbitRing progress={smooth} size={340} dark={dark} orbiting={orbiting}>
      {children}
    </OrbitRing>
  );
}

export function TimerView() {
  const t = useTranslations('lucent-web');
  const { data, remaining, running, progress, todo, dispatch, hydrated } =
    useLucent();
  const dark = useIsDark();
  const { mode, currentSession } = data.timer;
  const s = data.settings;
  const dots = s.pomodoroSessions;
  const activeDot = currentSession % dots;

  // Space = start / pause (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        e.code !== 'Space' ||
        el?.closest(
          'input,textarea,select,button,[role="combobox"],[contenteditable]'
        )
      )
        return;
      e.preventDefault();
      dispatch({ type: running ? 'pause' : 'start' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, dispatch]);

  const open = data.todos.filter((x) => !x.isCompleted);
  const today = dayKey(new Date());
  const doneToday = data.sessions.filter(
    (x) =>
      x.status === 'focus' &&
      x.isCompleted &&
      dayKey(new Date(x.createdAt)) === today
  ).length;
  const longBreak = mode === 'break' && isLongBreak(currentSession, s);
  const paused = !running && data.timer.sessionId !== null;
  // Like the app: a running focus session turns the page into deep space.
  const focusing = running && mode === 'focus';
  useFocusDarkMode(focusing);
  const reduceMotion = useReducedMotion();
  // Focus mode keeps only the timer, the pause button and the "stay focused" pill. Everything
  // else fades out in place (so the ring never jumps) and becomes inert (no tab stops).
  const away = {
    inert: focusing,
    'aria-hidden': focusing,
    className: cn(
      'transition-all duration-500',
      focusing && 'pointer-events-none opacity-0'
    )
  } as const;

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-2'>
      <div
        {...away}
        className={cn('bg-muted flex rounded-full p-1', away.className)}
        role='tablist'
        aria-label='Mode'
      >
        {(['focus', 'break'] as const).map((m) => (
          <button
            key={m}
            role='tab'
            aria-selected={mode === m}
            disabled={running}
            onClick={() => dispatch({ type: 'setMode', mode: m })}
            className={cn(
              'rounded-full px-5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed',
              mode === m ? 'bg-background shadow-sm' : 'text-muted-foreground'
            )}
          >
            {t(`timer.${m}`)}
          </button>
        ))}
      </div>

      <div {...away} className={cn('w-full max-w-sm', away.className)}>
        <Select
          value={
            data.timer.selectedTodoId === null
              ? NONE
              : String(data.timer.selectedTodoId)
          }
          onValueChange={(v) =>
            dispatch({ type: 'selectTodo', id: v === NONE ? null : Number(v) })
          }
          disabled={running || paused}
        >
          <SelectTrigger aria-label={t('timer.chooseTask')}>
            <SelectValue placeholder={t('timer.chooseTask')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>{t('timer.freeFocus')}</SelectItem>
            {open.map((x) => (
              <SelectItem key={x.id} value={String(x.id)}>
                {x.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {todo && (
          <p className='text-muted-foreground mt-1.5 text-center text-xs'>
            {t('timer.sessionsDone', {
              done: todo.completedSessions,
              total: todo.totalSessions || '∞'
            })}
          </p>
        )}
      </div>

      <FocusSky active={focusing} />

      <div
        className={cn(
          'transition-opacity duration-500 max-sm:scale-[0.8]',
          !hydrated && 'opacity-0'
        )}
      >
        <div className={cn(running && 'lucent-breathe')}>
          <SmoothOrbit
            endAt={data.timer.endAt}
            total={data.timer.total}
            progress={progress}
            dark={dark}
            orbiting={focusing && !reduceMotion}
          >
            <div className='flex flex-col items-center gap-2'>
              <span className='text-5xl font-semibold tracking-tight tabular-nums'>
                {formatClock(remaining)}
              </span>
              <span className='text-muted-foreground text-xs font-medium'>
                {mode === 'focus'
                  ? t('timer.focus')
                  : longBreak
                    ? t('timer.longBreak')
                    : t('timer.shortBreak')}
              </span>
              <div
                className='flex items-center gap-1.5'
                aria-label={t('timer.sessionLabel', {
                  n: activeDot + 1,
                  total: dots
                })}
              >
                {Array.from({ length: dots }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === activeDot
                        ? 'w-5 bg-[#22d3ee]'
                        : 'w-1.5 bg-current opacity-20'
                    )}
                  />
                ))}
              </div>
            </div>
          </SmoothOrbit>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        {/* faded via a wrapper: Button's `disabled:opacity-50` would beat `opacity-0` */}
        <span {...away} className={cn('inline-flex', away.className)}>
          <Button
            variant='outline'
            size='icon'
            className='size-11 rounded-full'
            onClick={() => dispatch({ type: 'reset' })}
            aria-label={t('timer.reset')}
            title={t('timer.reset')}
          >
            <IconRotate />
          </Button>
        </span>
        <Button
          size='lg'
          className='h-14 min-w-36 rounded-full text-base'
          onClick={() => dispatch({ type: running ? 'pause' : 'start' })}
        >
          {running ? (
            <IconPlayerPause className='fill-current' />
          ) : (
            <IconPlayerPlay className='fill-current' />
          )}
          {running
            ? t('timer.pause')
            : paused
              ? t('timer.resume')
              : t('timer.start')}
        </Button>
        <span {...away} className={cn('inline-flex', away.className)}>
          <Button
            variant='outline'
            size='icon'
            className='size-11 rounded-full'
            disabled={mode !== 'break'}
            onClick={() => dispatch({ type: 'skip' })}
            aria-label={t('timer.skip')}
            title={t('timer.skip')}
          >
            <IconPlayerSkipForward />
          </Button>
        </span>
      </div>

      <div className='flex h-8 items-center' aria-live='polite'>
        {running && (
          <span
            key={mode}
            className='lucent-pill-in border-border/60 bg-background/60 text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-md'
          >
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-[#22d3ee] opacity-60 motion-reduce:hidden' />
              <span className='relative inline-flex size-2 rounded-full bg-[#22d3ee]' />
            </span>
            {mode === 'focus' ? t('timer.stayFocused') : t('timer.breakTime')}
            {/* the task select is hidden while focusing: keep its name here */}
            {focusing && todo && (
              <span className='text-muted-foreground max-w-48 truncate'>
                · {todo.title}
              </span>
            )}
          </span>
        )}
      </div>

      <p
        {...away}
        className={cn('text-muted-foreground text-xs', away.className)}
      >
        {t('timer.hint')} · {t('timer.completedToday')}: {doneToday}
      </p>
    </div>
  );
}
