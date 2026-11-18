'use client';

import { IconCheck, IconPencil, IconPlayerPlay, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PRIORITIES, TAGS } from '../core/defaults';
import type { NewTodo } from '../core/engine';
import type { Todo } from '../core/types';
import { useLucent } from '../state/lucent-provider';

type Filter = 'active' | 'done' | 'all';
const NO_TAG = 'none';

const blank = (): NewTodo => ({ title: '', note: '', duration: null, totalSessions: 4, priorityId: 2, tagId: null });

export function TasksView() {
  const t = useTranslations('lucent-web');
  const router = useRouter();
  const { data, dispatch } = useLucent();
  const [filter, setFilter] = useState<Filter>('active');
  const [editing, setEditing] = useState<{ id: number | null; form: NewTodo } | null>(null);
  const [removing, setRemoving] = useState<Todo | null>(null);

  const list = data.todos.filter((x) => (filter === 'all' ? true : filter === 'done' ? x.isCompleted : !x.isCompleted));

  const submit = () => {
    if (!editing) return;
    if (!editing.form.title.trim()) {
      toast.error(t('tasks.titleRequired'));
      return;
    }
    const { duration } = editing.form;
    const form = {
      ...editing.form,
      title: editing.form.title.trim(),
      duration: duration ? Math.max(5 * 60, duration) : null
    };
    if (editing.id === null) dispatch({ type: 'addTodo', todo: form });
    else dispatch({ type: 'updateTodo', id: editing.id, patch: form });
    setEditing(null);
  };

  const patch = (p: Partial<NewTodo>) => setEditing((e) => (e ? { ...e, form: { ...e.form, ...p } } : e));

  return (
    <div className='mx-auto w-full max-w-3xl space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='bg-muted flex rounded-lg p-1 text-sm'>
          {(['active', 'done', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn('rounded-md px-3 py-1 font-medium', filter === f ? 'bg-background shadow-sm' : 'text-muted-foreground')}
            >
              {t(`tasks.${f}`)}
            </button>
          ))}
        </div>
        <Button onClick={() => setEditing({ id: null, form: blank() })}>
          <IconPlus /> {t('tasks.add')}
        </Button>
      </div>

      {list.length === 0 ? (
        <div className='bg-card text-muted-foreground rounded-xl border p-10 text-center'>
          <p className='text-foreground font-medium'>{t('tasks.empty')}</p>
          <p className='mt-1 text-sm'>{t('tasks.emptyHint')}</p>
        </div>
      ) : (
        <ul className='bg-card divide-y rounded-xl border'>
          {list.map((x) => {
            const tag = TAGS.find((g) => g.id === x.tagId);
            const pr = PRIORITIES.find((p) => p.id === x.priorityId);
            const selected = data.timer.selectedTodoId === x.id;
            return (
              <li key={x.id} className='flex flex-wrap items-center gap-3 p-4'>
                <button
                  onClick={() => dispatch({ type: 'toggleTodo', id: x.id })}
                  aria-label={x.isCompleted ? t('tasks.active') : t('tasks.done')}
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    x.isCompleted ? 'border-[#0891b2] bg-[#0891b2] text-white' : 'border-[#0e7490] text-transparent hover:text-[#0e7490]'
                  )}
                >
                  <IconCheck className='size-4' />
                </button>
                <div className='min-w-0 flex-1'>
                  <div className={cn('truncate font-medium', x.isCompleted && 'text-muted-foreground line-through')}>{x.title}</div>
                  <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs'>
                    {tag && (
                      <Badge variant='outline' className='gap-1.5'>
                        <span className='size-2 rounded-full' style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </Badge>
                    )}
                    {pr && (
                      <Badge variant='outline' style={{ borderColor: pr.color, color: pr.color }}>
                        {t(`tasks.${pr.name.toLowerCase()}`)}
                      </Badge>
                    )}
                    <span>{t('tasks.progress', { done: x.completedSessions, total: x.totalSessions || '∞' })}</span>
                    {x.duration && <span>· {Math.round(x.duration / 60)} min</span>}
                  </div>
                  {x.note && <p className='text-muted-foreground mt-1 truncate text-xs'>{x.note}</p>}
                </div>
                {!x.isCompleted && (
                  <Button
                    size='sm'
                    variant={selected ? 'secondary' : 'outline'}
                    onClick={() => {
                      dispatch({ type: 'selectTodo', id: x.id });
                      router.push('/dashboard/lucent');
                    }}
                  >
                    <IconPlayerPlay className='fill-current' />
                    {selected ? t('tasks.selected') : t('tasks.focus')}
                  </Button>
                )}
                <Button
                  size='icon'
                  variant='ghost'
                  aria-label={t('tasks.edit')}
                  onClick={() =>
                    setEditing({
                      id: x.id,
                      form: { title: x.title, note: x.note, duration: x.duration, totalSessions: x.totalSessions, priorityId: x.priorityId, tagId: x.tagId }
                    })
                  }
                >
                  <IconPencil />
                </Button>
                <Button size='icon' variant='ghost' className='text-destructive' aria-label={t('tasks.delete')} onClick={() => setRemoving(x)}>
                  <IconTrash />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id === null ? t('tasks.create') : t('tasks.edit')}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              className='space-y-3'
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className='space-y-1.5'>
                <Label htmlFor='task-title'>{t('tasks.titleLabel')}</Label>
                <Input id='task-title' autoFocus value={editing.form.title} maxLength={120} onChange={(e) => patch({ title: e.target.value })} />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='task-duration'>{t('tasks.duration')}</Label>
                  <Input
                    id='task-duration'
                    type='number'
                    min={5}
                    max={120}
                    placeholder={String(Math.round(data.settings.focusDuration / 60))}
                    value={editing.form.duration ? Math.round(editing.form.duration / 60) : ''}
                    // Only cap the maximum while typing ("25" passes through "2"); enforce the minimum on blur.
                    onChange={(e) => patch({ duration: e.target.value ? Math.min(120, Math.max(1, Number(e.target.value))) * 60 : null })}
                    onBlur={() => editing.form.duration && editing.form.duration < 5 * 60 && patch({ duration: 5 * 60 })}
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='task-sessions'>{t('tasks.sessions')}</Label>
                  <Input
                    id='task-sessions'
                    type='number'
                    min={1}
                    max={20}
                    value={editing.form.totalSessions}
                    onChange={(e) => patch({ totalSessions: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label>{t('tasks.priority')}</Label>
                  <Select value={String(editing.form.priorityId)} onValueChange={(v) => patch({ priorityId: Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>{t(`tasks.${p.name.toLowerCase()}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>{t('tasks.tag')}</Label>
                  <Select value={editing.form.tagId === null ? NO_TAG : String(editing.form.tagId)} onValueChange={(v) => patch({ tagId: v === NO_TAG ? null : Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_TAG}>{t('tasks.noTag')}</SelectItem>
                      {TAGS.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='task-note'>{t('tasks.note')}</Label>
                <Textarea id='task-note' rows={3} maxLength={500} value={editing.form.note} onChange={(e) => patch({ note: e.target.value })} />
              </div>
              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setEditing(null)}>{t('tasks.cancel')}</Button>
                <Button type='submit'>{t('tasks.save')}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tasks.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{removing?.title}. {t('tasks.deleteBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('tasks.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removing) dispatch({ type: 'deleteTodo', id: removing.id });
                setRemoving(null);
              }}
            >
              {t('tasks.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
