import { notFound } from 'next/navigation';
import {
  StoreShot,
  STORE_H,
  STORE_W,
  storeShotCount,
  type StoreProduct
} from '@/features/showcase/store-shot';

export const metadata = {
  title: 'Store screenshots',
  robots: { index: false, follow: false }
};

/**
 * Store-listing screenshots rendered from the real UI components.
 *   /en/store/lucent            preview of all shots
 *   /en/store/lucent?shot=1&full=1   one shot at 1290×2796 (what scripts/export-store-shots.mjs captures)
 */
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ product: string }>;
  searchParams: Promise<{ shot?: string; full?: string }>;
}) {
  const { product } = await params;
  const { shot, full } = await searchParams;
  if (product !== 'lucent' && product !== 'meet') notFound();
  const p = product as StoreProduct;
  const n = storeShotCount(p);

  if (full === '1') {
    const i = Math.min(Math.max(Number(shot ?? 1) - 1, 0), n - 1);
    return <StoreShot product={p} index={i} />;
  }

  const scale = 0.22;
  return (
    <div className='flex flex-wrap items-start justify-center gap-6 bg-neutral-100 p-8'>
      {Array.from({ length: n }, (_, i) => (
        <a
          key={i}
          href={`?shot=${i + 1}&full=1`}
          className='block shrink-0 overflow-hidden rounded-xl shadow-lg'
          style={{ width: STORE_W * scale, height: STORE_H * scale }}
        >
          <div
            style={{
              width: STORE_W,
              height: STORE_H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
            <StoreShot product={p} index={i} />
          </div>
        </a>
      ))}
    </div>
  );
}
