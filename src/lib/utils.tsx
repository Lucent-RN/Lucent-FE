import { IconBrandThreads } from '@tabler/icons-react';
import { type ClassValue, clsx } from 'clsx';
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  X,
  Youtube
} from 'lucide-react';
import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export const getPlatformIconByName = (
  platformName: string
): JSX.Element | null => {
  switch (platformName) {
    case 'facebook': {
      return <Facebook size={24} className='min-w-fit' />;
    }
    case 'github': {
      return <Github size={24} className='min-w-fit' />;
    }
    case 'instagram': {
      return <Instagram size={24} className='min-w-fit' />;
    }
    case 'linkedin': {
      return <Linkedin size={24} className='min-w-fit' />;
    }
    case 'twitter': {
      return <Twitter size={24} className='min-w-fit' />;
    }
    case 'youtube': {
      return <Youtube size={24} className='min-w-fit' />;
    }
    case 'x': {
      return <X size={24} className='min-w-fit' />;
    }
    case 'threads': {
      return <IconBrandThreads size={24} className='min-w-fit' />;
    }
    default:
      console.log(
        'Platform name not supported, no icon is returned:',
        platformName
      );
      return null;
  }
};
