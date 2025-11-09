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
    <div className='fixed bottom-0 left-0 z-50 flex w-full items-center justify-between bg-white p-3 shadow-lg'>
      <div className='flex items-center gap-3'>
        <Image
          src='/assets/app-icon.png'
          alt='Lucent'
          width={48}
          height={48}
          className='rounded-xl border border-gray-200 p-1'
        />
        <div>
          <p className='text-sm font-semibold'>Lucent – Pomodoro Focus Timer</p>
          <p className='text-xs text-gray-500'>Stay focused, be present</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <a
          href={PLAY_STORE_URL}
          className='rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white'
        >
          Download
        </a>
        <button
          onClick={() => {
            setVisible(false);
            localStorage.setItem('hideLucentBanner', 'true');
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
