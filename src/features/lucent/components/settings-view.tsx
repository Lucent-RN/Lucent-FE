'use client';

import { IconDownload, IconPlayerPlay, IconTrash, IconUpload } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { MAX_BREAK, MAX_FOCUS, MIN_BREAK, MIN_FOCUS } from '../core/defaults';
import { exportJson, importJson } from '../core/storage';
import { playSound } from '../core/sound';
import type { Settings, SoundId } from '../core/types';
import { useLucent } from '../state/lucent-provider';

const SOUNDS: SoundId[] = ['ting', 'harp', 'chord', 'chime'];
const LANG_NAMES: Record<string, string> = { en: 'English', vi: 'Tiếng Việt', jp: '日本語', de: 'Deutsch' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='bg-card space-y-4 rounded-xl border p-5'>
    <h2 className='text-sm font-semibold'>{title}</h2>
    {children}
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='flex flex-wrap items-center justify-between gap-3'>
    <span className='text-sm'>{label}</span>
    {children}
  </div>
);

function Minutes({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (seconds: number) => void }) {
  const t = useTranslations('lucent-web');
  return (
    <div className='space-y-2'>
      <Row label={label}>
        <span className='text-muted-foreground text-sm tabular-nums'>{t('settings.minutes', { n: Math.round(value / 60) })}</span>
      </Row>
      <Slider min={min / 60} max={max / 60} step={step} value={[Math.round(value / 60)]} onValueChange={([m]) => onChange(m * 60)} aria-label={label} />
    </div>
  );
}

export function SettingsView() {
  const t = useTranslations('lucent-web');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data, dispatch } = useLucent();
  const s = data.settings;
  const file = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (patch: Partial<Settings>) => dispatch({ type: 'settings', patch });

  const toggleNotifications = async (on: boolean) => {
    if (!on) return set({ notifications: false });
    if (typeof Notification === 'undefined' || Notification.permission === 'denied') {
      toast.error(t('settings.notificationsDenied'));
      return;
    }
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (perm === 'granted') set({ notifications: true });
    else toast.error(t('settings.notificationsDenied'));
  };

  const onExport = () => {
    const url = URL.createObjectURL(new Blob([exportJson(data)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `lucent-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      dispatch({ type: 'replace', data: importJson(await f.text()) });
      toast.success(t('settings.imported'));
    } catch {
      toast.error(t('settings.importFailed'));
    }
    if (file.current) file.current.value = '';
  };

  const soundPicker = (label: string, key: 'completeFocusSound' | 'completeBreakSound') => (
    <Row label={label}>
      <div className='flex items-center gap-2'>
        <Select value={s[key]} onValueChange={(v) => set({ [key]: v as SoundId })}>
          <SelectTrigger className='w-32 capitalize'><SelectValue /></SelectTrigger>
          <SelectContent>
            {SOUNDS.map((x) => <SelectItem key={x} value={x} className='capitalize'>{x}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size='icon' variant='outline' aria-label={t('settings.test')} title={t('settings.test')} onClick={() => playSound(s[key], s.volume)}>
          <IconPlayerPlay className='fill-current' />
        </Button>
      </div>
    </Row>
  );

  return (
    <div className='mx-auto w-full max-w-2xl space-y-4'>
      <Section title={t('settings.timer')}>
        <Minutes label={t('settings.focusDuration')} value={s.focusDuration} min={MIN_FOCUS} max={MAX_FOCUS} step={5} onChange={(v) => set({ focusDuration: v })} />
        <Minutes label={t('settings.shortBreak')} value={s.shortBreakDuration} min={MIN_BREAK} max={MAX_BREAK} onChange={(v) => set({ shortBreakDuration: v })} />
        <Row label={t('settings.useLongBreak')}>
          <Switch checked={s.useLongBreak} onCheckedChange={(v) => set({ useLongBreak: v })} />
        </Row>
        {s.useLongBreak && (
          <>
            <Minutes label={t('settings.longBreak')} value={s.longBreakDuration} min={MIN_BREAK} max={MAX_BREAK} onChange={(v) => set({ longBreakDuration: v })} />
            <div className='space-y-2'>
              <Row label={t('settings.sessionsBeforeLong')}>
                <span className='text-muted-foreground text-sm tabular-nums'>{s.pomodoroSessions}</span>
              </Row>
              <Slider min={2} max={8} step={1} value={[s.pomodoroSessions]} onValueChange={([n]) => set({ pomodoroSessions: n })} aria-label={t('settings.sessionsBeforeLong')} />
            </div>
          </>
        )}
        <Row label={t('settings.autoBreak')}>
          <Switch checked={s.startBreakAutomatically} onCheckedChange={(v) => set({ startBreakAutomatically: v })} />
        </Row>
        <Row label={t('settings.autoFocus')}>
          <Switch checked={s.startFocusAutomatically} onCheckedChange={(v) => set({ startFocusAutomatically: v })} />
        </Row>
      </Section>

      <Section title={t('settings.sounds')}>
        {soundPicker(t('settings.focusSound'), 'completeFocusSound')}
        {soundPicker(t('settings.breakSound'), 'completeBreakSound')}
        <div className='space-y-2'>
          <Row label={t('settings.volume')}>
            <span className='text-muted-foreground text-sm tabular-nums'>{Math.round(s.volume * 100)}%</span>
          </Row>
          <Slider min={0} max={100} step={5} value={[Math.round(s.volume * 100)]} onValueChange={([v]) => set({ volume: v / 100 })} aria-label={t('settings.volume')} />
        </div>
        <Row label={t('settings.notifications')}>
          <Switch checked={s.notifications} onCheckedChange={(v) => void toggleNotifications(v)} />
        </Row>
        <p className='text-muted-foreground -mt-2 text-xs'>{t('settings.notificationsHint')}</p>
      </Section>

      <Section title={t('settings.appearance')}>
        <Row label={t('settings.theme')}>
          <Select value={theme ?? 'system'} onValueChange={setTheme}>
            <SelectTrigger className='w-40'><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['light', 'dark', 'system'] as const).map((x) => <SelectItem key={x} value={x}>{t(`settings.${x}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row label={t('settings.language')}>
          <Select value={locale} onValueChange={(l) => router.replace(pathname, { locale: l })}>
            <SelectTrigger className='w-40'><SelectValue /></SelectTrigger>
            <SelectContent>
              {routing.locales.map((l) => <SelectItem key={l} value={l}>{LANG_NAMES[l] ?? l}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
      </Section>

      <Section title={t('settings.data')}>
        <p className='text-muted-foreground text-xs'>{t('settings.dataHint')}</p>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={onExport}><IconDownload /> {t('settings.export')}</Button>
          <Button variant='outline' onClick={() => file.current?.click()}><IconUpload /> {t('settings.import')}</Button>
          <input ref={file} type='file' accept='application/json,.json' className='hidden' onChange={(e) => void onImport(e.target.files?.[0])} />
          <Button variant='outline' className='text-destructive' onClick={() => setConfirmReset(true)}><IconTrash /> {t('settings.reset')}</Button>
        </div>
      </Section>

      <Section title={t('settings.unavailable')}>
        <p className='text-muted-foreground text-sm'>{t('settings.unavailableBody')}</p>
      </Section>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.resetTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('settings.resetBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('tasks.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => dispatch({ type: 'clear' })}>{t('settings.reset')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
