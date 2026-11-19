/** The settings that follow the user across devices. Theme, language, biometrics etc. stay per device. */
export interface SyncedSettings {
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  use_long_break: boolean;
  pomodoro_sessions: number;
  start_break_automatically: boolean;
  start_focus_automatically: boolean;
  focus_sound: string;
  break_sound: string;
  volume: number;
}

export const SETTINGS_ROW_ID = '00000000-0000-4000-8000-000000000001';

const SOUNDS = ['ting', 'harp', 'chord', 'chime'];
const num = (v: unknown, lo: number, hi: number): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : undefined;
const bool = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined);
const sound = (v: unknown): string | undefined => (typeof v === 'string' && SOUNDS.includes(v) ? v : undefined);

/** Validates whatever the server sent: another (older/newer/buggy) client must not be able to corrupt this one. */
export function sanitizeSettings(raw: Record<string, unknown>): Partial<SyncedSettings> {
  const out: Partial<SyncedSettings> = {
    focus_duration: num(raw.focus_duration, 60, 6 * 3600),
    short_break_duration: num(raw.short_break_duration, 60, 3600),
    long_break_duration: num(raw.long_break_duration, 60, 7200),
    use_long_break: bool(raw.use_long_break),
    pomodoro_sessions: num(raw.pomodoro_sessions, 1, 12),
    start_break_automatically: bool(raw.start_break_automatically),
    start_focus_automatically: bool(raw.start_focus_automatically),
    focus_sound: sound(raw.focus_sound),
    break_sound: sound(raw.break_sound),
    volume: num(raw.volume, 0, 1),
  };
  for (const k of Object.keys(out) as (keyof SyncedSettings)[]) if (out[k] === undefined) delete out[k];
  return out;
}

/** Key-order independent, so equal settings always hash equal. */
export const stableJson = (o: Record<string, unknown>): string =>
  JSON.stringify(
    Object.keys(o)
      .sort()
      .map((k) => [k, o[k]])
  );
