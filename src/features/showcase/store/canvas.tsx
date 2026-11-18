import { OrbitTabIcon } from '@/components/brand/orbit-system';
import { cn } from '@/lib/utils';
import { PhoneFrame } from '../phone-frame';
import { DEVICES, SHOTS, type StoreDevice, type StoreProduct, type StoreTheme } from './shots';
import { TAB_H, TAB_W } from './ui';

const BEZEL = 14;

/** iPad-style frame around a TAB_W × TAB_H screen. */
function TabletFrame({ scale, children }: { scale: number; children: React.ReactNode }) {
  const w = TAB_W + BEZEL * 2;
  const h = TAB_H + BEZEL * 2;
  return (
    <div className='relative shrink-0' style={{ width: w * scale, height: h * scale }}>
      <div
        className='absolute top-0 left-0 origin-top-left rounded-[46px] bg-[#0b0b0d] shadow-[0_40px_100px_-20px_rgba(4,30,41,0.6),inset_0_0_0_2px_#2a2f33]'
        style={{ width: w, height: h, padding: BEZEL, transform: `scale(${scale})` }}
      >
        <div className='relative h-full w-full overflow-hidden rounded-[32px]'>{children}</div>
        <span className='absolute top-[5px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-[#1c2226]' />
      </div>
    </div>
  );
}

const THEMES: Record<StoreTheme, { bg: string; fg: string; sub: string; accent: string }> = {
  space: { bg: 'bg-[#041e29]', fg: 'text-[#e4f7fb]', sub: 'text-[#a5e3f4]', accent: 'from-[#67e8f9] to-[#a78bfa]' },
  light: { bg: 'bg-[#eaf9fd]', fg: 'text-[#062c3b]', sub: 'text-[#3d7a8e]', accent: 'from-[#0891b2] to-[#22d3ee]' },
  aurora: { bg: 'bg-[#062c3b]', fg: 'text-white', sub: 'text-[#bdeefa]', accent: 'from-[#5eead4] to-[#67e8f9]' }
};

function Backdrop({ theme, u }: { theme: StoreTheme; u: number }) {
  const rings = (color: string) => (
    <svg className='absolute inset-0 -z-10 size-full' viewBox='0 0 100 100' preserveAspectRatio='none' aria-hidden>
      <g fill='none' stroke={color} strokeWidth='0.18' vectorEffect='non-scaling-stroke'>
        <ellipse cx='50' cy='64' rx='62' ry='20' transform='rotate(-14 50 64)' />
        <ellipse cx='50' cy='64' rx='80' ry='28' transform='rotate(-14 50 64)' opacity='0.6' />
        <ellipse cx='50' cy='64' rx='98' ry='36' transform='rotate(-14 50 64)' opacity='0.35' />
      </g>
    </svg>
  );
  if (theme === 'space')
    return (
      <>
        <div className='cosmic-sky absolute inset-0 -z-20 scale-150' />
        <div className='cosmic-stars absolute inset-0 -z-20 scale-[2.2] opacity-80' />
        <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.5),transparent)]' style={{ width: 1100 * u, height: 1100 * u, left: -380 * u, top: 500 * u }} />
        <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.35),transparent)]' style={{ width: 1000 * u, height: 1000 * u, right: -420 * u, bottom: -120 * u }} />
        {rings('rgba(165,227,244,0.35)')}
      </>
    );
  if (theme === 'aurora')
    return (
      <>
        <div className='absolute inset-0 -z-20 bg-[linear-gradient(160deg,#062c3b_0%,#0b4a63_45%,#3b1f7a_100%)]' />
        <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.5),transparent)]' style={{ width: 1200 * u, height: 1200 * u, left: -300 * u, top: -300 * u }} />
        <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,247,0.45),transparent)]' style={{ width: 1100 * u, height: 1100 * u, right: -450 * u, bottom: 100 * u }} />
        {rings('rgba(255,255,255,0.28)')}
      </>
    );
  return (
    <>
      <div className='absolute inset-0 -z-20 bg-[linear-gradient(180deg,#d6f4fc_0%,#eaf9fd_45%,#f7fdff_100%)]' />
      <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.4),transparent)]' style={{ width: 1300 * u, height: 1300 * u, left: -450 * u, top: -450 * u }} />
      <div className='absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.28),transparent)]' style={{ width: 1100 * u, height: 1100 * u, right: -450 * u, bottom: 150 * u }} />
      {rings('rgba(8,145,178,0.28)')}
    </>
  );
}

/** One store screenshot: headline, caption, floating callouts and the app in a device frame. */
export function StoreCanvas({ product, index, device }: { product: StoreProduct; index: number; device: StoreDevice }) {
  const spec = SHOTS[product][index];
  const { w: W, h: H, kind } = DEVICES[device];
  const u = W / 1290; // design unit: everything below is authored for a 1290-wide canvas
  const th = THEMES[spec.theme];
  const top = (kind === 'phone' ? 0.3 : 0.36) * H;

  let frame: React.ReactNode;
  if (kind === 'phone') {
    const bleed = 0.055 * H;
    const s = Math.min(((H - top + bleed) / 670), (W * 0.86) / 320);
    frame = (
      <PhoneFrame dark={spec.darkScreen} scale={s}>
        <spec.Phone />
      </PhoneFrame>
    );
  } else {
    const s = Math.min((W * 0.9) / (TAB_W + BEZEL * 2), (H - top + 0.04 * H) / (TAB_H + BEZEL * 2));
    frame = (
      <TabletFrame scale={s}>
        <spec.Tablet />
      </TabletFrame>
    );
  }

  return (
    <div className={cn('relative isolate overflow-hidden', th.bg, th.fg, spec.theme !== 'light' && 'dark')} style={{ width: W, height: H }}>
      <Backdrop theme={spec.theme} u={u} />

      <div className='absolute inset-x-0 text-center' style={{ top: 0.075 * H, paddingInline: 100 * u }}>
        <div className='mx-auto mb-[34px] flex items-center justify-center gap-3 opacity-90' style={{ gap: 18 * u, marginBottom: 40 * u }}>
          <OrbitTabIcon size={Math.round(64 * u)} />
          <span className='font-semibold tracking-[0.28em] uppercase' style={{ fontSize: 34 * u }}>
            {product === 'meet' ? 'LucentMeet' : 'Lucent'}
          </span>
        </div>
        <h2 className={cn('bg-gradient-to-r bg-clip-text font-semibold tracking-tight text-transparent', th.accent)} style={{ fontSize: (kind === 'tablet' ? 112 : 138) * u, lineHeight: 1.04 }}>
          {spec.title}
        </h2>
        <p className={cn('mx-auto leading-snug', th.sub)} style={{ marginTop: 34 * u, maxWidth: (kind === 'tablet' ? 1180 : 940) * u, fontSize: (kind === 'tablet' ? 40 : 52) * u }}>
          {spec.text}
        </p>
      </div>

      <div
        className='absolute left-1/2'
        style={{
          top,
          transform: `translateX(-50%) ${spec.tilt && kind === 'phone' ? `translateX(6%) rotate(-4deg)` : ''}`,
          transformOrigin: '50% 100%'
        }}
      >
        {frame}
      </div>

      {kind === 'phone' && spec.chips?.map(([text, x, y]) => (
        <div
          key={text}
          className='absolute rounded-full bg-white font-semibold whitespace-nowrap text-[#062c3b] shadow-[0_20px_50px_-10px_rgba(4,30,41,0.5)]'
          style={{ left: `${x}%`, top: `${y}%`, fontSize: 46 * u, padding: `${22 * u}px ${40 * u}px` }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

/** Google Play feature graphic, 1024 × 500. */
export function FeatureGraphic({ product }: { product: StoreProduct }) {
  const shots = SHOTS[product];
  const [a, b] = [shots[0], shots[2]];
  const th = product === 'lucent' ? THEMES.space : THEMES.aurora;
  const copy =
    product === 'lucent'
      ? { title: 'Focus, in orbit.', text: 'A calm Pomodoro timer for study and deep work.' }
      : { title: 'All your calendars. One timeline.', text: 'Catch conflicts early. Let AI find the time.' };
  return (
    <div className={cn('relative isolate overflow-hidden', th.bg, th.fg, 'dark')} style={{ width: 1024, height: 500 }}>
      <Backdrop theme={product === 'lucent' ? 'space' : 'aurora'} u={0.5} />
      <div className='absolute top-1/2 left-[56px] w-[460px] -translate-y-1/2'>
        <div className='mb-4 flex items-center gap-3'>
          <OrbitTabIcon size={44} />
          <span className='text-[18px] font-semibold tracking-[0.28em] uppercase'>{product === 'meet' ? 'LucentMeet' : 'Lucent'}</span>
        </div>
        <div className={cn('bg-gradient-to-r bg-clip-text text-[54px] leading-[1.05] font-semibold tracking-tight text-transparent', th.accent)}>{copy.title}</div>
        <div className={cn('mt-4 text-[22px] leading-snug', th.sub)}>{copy.text}</div>
      </div>
      <div className='absolute top-[44px] left-[560px] rotate-[6deg]'><PhoneFrame scale={0.62} dark={a.darkScreen}><a.Phone /></PhoneFrame></div>
      <div className='absolute top-[110px] left-[760px] rotate-[-5deg]'><PhoneFrame scale={0.62} dark={b.darkScreen}><b.Phone /></PhoneFrame></div>
    </div>
  );
}
