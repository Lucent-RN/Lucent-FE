import type { SoundId } from './types';

// Short synthesised chimes, so no audio files are shipped. [frequency Hz, start s, length s]
const NOTES: Record<SoundId, Array<[number, number, number]>> = {
  ting: [[1318.5, 0, 0.9]],
  harp: [[523.25, 0, 0.7], [659.25, 0.12, 0.7], [783.99, 0.24, 0.9], [1046.5, 0.36, 1.1]],
  chord: [[392, 0, 1.2], [493.88, 0, 1.2], [587.33, 0, 1.2]],
  chime: [[880, 0, 0.6], [1108.7, 0.25, 0.6], [1318.5, 0.5, 1.0]]
};

let ctx: AudioContext | null = null;

export function playSound(id: SoundId, volume: number): void {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor || volume <= 0) return;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime;
    for (const [freq, start, len] of NOTES[id]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0 + start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.25 * volume), t0 + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0 + start);
      osc.stop(t0 + start + len + 0.05);
    }
  } catch {
    /* audio is a nicety; never break the timer */
  }
}
