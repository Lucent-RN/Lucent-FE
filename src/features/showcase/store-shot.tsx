import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { PhoneFrame } from './phone-frame';
import {
  FocusScreen,
  LockScreen,
  MeetAssistantScreen,
  MeetCalendarScreen,
  MeetConflictScreen,
  TimerScreen
} from './screens';

export type StoreProduct = 'lucent' | 'meet';
export const STORE_W = 1290; // App Store 6.9" portrait
export const STORE_H = 2796;

const SHOTS = {
  lucent: [
    { Screen: TimerScreen, dark: false, space: true },
    { Screen: FocusScreen, dark: true, space: true },
    { Screen: LockScreen, dark: true, space: true }
  ],
  meet: [
    { Screen: MeetCalendarScreen, dark: false, space: false },
    { Screen: MeetConflictScreen, dark: false, space: false },
    { Screen: MeetAssistantScreen, dark: false, space: false }
  ]
} as const;

export const storeShotCount = (p: StoreProduct) => SHOTS[p].length;

/** One App Store / Google Play screenshot: headline, caption and the app screen in a device frame. */
export function StoreShot({
  product,
  index
}: {
  product: StoreProduct;
  index: number;
}) {
  const t = useTranslations(`site.${product === 'meet' ? 'meet' : 'lucent'}`);
  const items = t.raw('screens') as Array<{ title: string; text: string }>;
  const { Screen, dark, space } = SHOTS[product][index];
  const item = items[index];

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        space
          ? 'dark bg-[#041e29] text-[#e4f7fb]'
          : 'bg-[#f2fbfd] text-[#062c3b]'
      )}
      style={{ width: STORE_W, height: STORE_H }}
    >
      {space ? (
        <>
          <div className='cosmic-sky absolute inset-0 -z-10 scale-150' />
          <div className='cosmic-stars absolute inset-0 -z-10 scale-[2.2] opacity-80' />
        </>
      ) : (
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(34,211,238,0.28),transparent)]' />
      )}
      <div className='px-[110px] pt-[210px] text-center'>
        <h2 className='text-[132px] leading-[1.05] font-semibold tracking-tight'>
          {item.title}
        </h2>
        <p
          className={cn(
            'mx-auto mt-8 max-w-[960px] text-[54px] leading-snug',
            space ? 'text-[#a5e3f4]' : 'text-[#3d7a8e]'
          )}
        >
          {item.text}
        </p>
      </div>
      <div className='absolute bottom-[-150px] left-1/2 -translate-x-1/2'>
        <PhoneFrame dark={dark} scale={3.25}>
          <Screen />
        </PhoneFrame>
      </div>
    </div>
  );
}
