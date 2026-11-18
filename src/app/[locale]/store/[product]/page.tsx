import { notFound } from 'next/navigation';
import {
  DEVICES,
  FeatureGraphic,
  StoreCanvas,
  storeShotCount,
  type StoreDevice,
  type StoreProduct
} from '@/features/showcase/store-shot';

export const metadata = {
  title: 'Store screenshots',
  robots: { index: false, follow: false }
};

/**
 * Store-listing screenshots (v2), rendered from the UI mock components.
 *   /en/store/lucent                              preview of every shot on every device
 *   /en/store/lucent?shot=1&device=iphone&full=1  one shot at full size (captured by scripts/export-store-shots.mjs)
 *   /en/store/lucent?feature=1&full=1             Google Play feature graphic (1024×500)
 * device: iphone (1290×2796) · android (1080×1920) · ipad (2064×2752) · tablet (1600×2560)
 */
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ product: string }>;
  searchParams: Promise<{
    shot?: string;
    device?: string;
    full?: string;
    feature?: string;
  }>;
}) {
  const { product } = await params;
  const { shot, device, full, feature } = await searchParams;
  if (product !== 'lucent' && product !== 'meet') notFound();
  const p = product as StoreProduct;
  const n = storeShotCount(p);

  if (feature === '1' && full === '1') return <FeatureGraphic product={p} />;
  if (full === '1') {
    const d = (device && device in DEVICES ? device : 'iphone') as StoreDevice;
    const i = Math.min(Math.max(Number(shot ?? 1) - 1, 0), n - 1);
    return <StoreCanvas product={p} index={i} device={d} />;
  }

  return (
    <div className='space-y-10 bg-neutral-100 p-8'>
      {(Object.keys(DEVICES) as StoreDevice[]).map((d) => {
        const { w, h } = DEVICES[d];
        const scale = 280 / w;
        return (
          <section key={d}>
            <h2 className='mb-3 text-sm font-semibold'>
              {d} · {w}×{h}
            </h2>
            <div className='flex flex-wrap items-start gap-4'>
              {Array.from({ length: n }, (_, i) => (
                <a
                  key={i}
                  href={`?shot=${i + 1}&device=${d}&full=1`}
                  className='block shrink-0 overflow-hidden rounded-xl shadow-lg'
                  style={{ width: w * scale, height: h * scale }}
                >
                  <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                    <StoreCanvas product={p} index={i} device={d} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
      <section>
        <h2 className='mb-3 text-sm font-semibold'>feature graphic · 1024×500</h2>
        <FeatureGraphic product={p} />
      </section>
    </div>
  );
}
