'use client';

import { IconPlayerPause, IconPlayerPlay, IconPlayerSkipForward, IconRotate } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { OrbitRing } from '@/components/brand/orbit-ring';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isLongBreak, formatClock } from '../core/timer';
import { dayKey } from '../core/stats';
import { useLucent } from '../state/lucent-provider';

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

export function TimerView() {
  const t = useTranslations('lucent-web');
  const { data, remaining, running, progress, todo, dispatch, hydrated } = useLucent();
  const dark = useIsDark();
  const { mode, currentSession } = data.timer;
  const s = data.settings;
  const dots = s.pomodoroSessions;
  const activeDot = currentSession % dots;

  // Space = start / pause (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.code !== 'Space' || el?.closest('input,textarea,select,button,[role="combobox"],[contenteditable]')) return;
      e.preventDefault();
      dispatch({ type: running ? 'pause' : 'start' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, dispatch]);

  const open = data.todos.filter((x) => !x.isCompleted);
  const today = dayKey(new Date());
  const doneToday = data.sessions.filter((x) => x.status === 'focus' && x.isCompleted && dayKey(new Date(x.createdAt)) === today).length;
  const longBreak = mode === 'break' && isLongBreak(currentSession, s);
  const paused = !running && data.timer.sessionId !== null;

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-2'>
      <div className='bg-muted flex rounded-full p-1' role='tablist' aria-label='Mode'>
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

      <div className='w-full max-w-sm'>
        <Select
          value={data.timer.selectedTodoId === null ? NONE : String(data.timer.selectedTodoId)}
          onValueChange={(v) => dispatch({ type: 'selectTodo', id: v === NONE ? null : Number(v) })}
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
            {t('timer.sessionsDone', { done: todo.completedSessions, total: todo.totalSessions || '∞' })}
          </p>
        )}
      </div>

      <div className={cn('transition-opacity', !hydrated && 'opacity-0')}>
        <OrbitRing progress={progress} size={340} dark={dark}>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-5xl font-semibold tracking-tight tabular-nums'>{formatClock(remaining)}</span>
            <span className='text-muted-foreground text-xs font-medium'>
              {mode === 'focus' ? t('timer.focus') : longBreak ? t('timer.longBreak') : t('timer.shortBreak')}
            </span>
            <div className='flex items-center gap-1.5' aria-label={t('timer.sessionLabel', { n: activeDot + 1, total: dots })}>
              {Array.from({ length: dots }, (_, i) => (
                <span key={i} className={cn('h-1.5 rounded-full transition-all', i === activeDot ? 'w-5 bg-[#22d3ee]' : 'w-1.5 bg-current opacity-20')} />
              ))}
            </div>
          </div>
        </OrbitRing>
      </div>

      <div className='flex items-center gap-3'>
        <Button variant='outline' size='icon' className='size-11 rounded-full' onClick={() => dispatch({ type: 'reset' })} aria-label={t('timer.reset')} title={t('timer.reset')}>
          <IconRotate />
        </Button>
        <Button
          size='lg'
          className='h-14 min-w-36 rounded-full text-base'
          onClick={() => dispatch({ type: running ? 'pause' : 'start' })}
        >
          {running ? <IconPlayerPause className='fill-current' /> : <IconPlayerPlay className='fill-current' />}
          {running ? t('timer.pause') : paused ? t('timer.resume') : t('timer.start')}
        </Button>
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
      </div>

      <p className='text-muted-foreground text-xs'>
        {t('timer.hint')} · {t('timer.completedToday')}: {doneToday}
      </p>
    </div>
  );
}
