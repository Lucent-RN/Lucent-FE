'use client';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PLAY_STORE_URL } from '../constants/storeData';

export default function AppDownloadBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /Android/i.test(userAgent);

    // ✅ Chỉ hiển thị khi là Android + chưa ẩn
    if (isAndroid && !localStorage.getItem('hideLucentBanner')) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className='fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-white/10 bg-[#062c3b] p-3 text-[#e4f7fb] shadow-lg'>
      <div className='flex items-center gap-3'>
        <Image
          src='/assets/app-icon.png'
          alt='Lucent'
          width={48}
          height={48}
          className='rounded-xl'
        />
        <div>
          <p className='text-sm font-semibold'>Lucent</p>
          <p className='text-xs text-[#a5e3f4]'>Focus, in orbit.</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <a
          href={PLAY_STORE_URL}
          className='rounded-full bg-[#22d3ee] px-4 py-1.5 text-sm font-semibold text-[#041e29]'
          target='_blank'
          rel='noopener noreferrer'
        >
          Download
        </a>
        <button
          onClick={() => {
            setVisible(false);
            localStorage.setItem('hideLucentBanner', 'true');
          }}
        >
          <X size={16} aria-label='Close' />
        </button>
      </div>
    </div>
  );
}
