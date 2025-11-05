import { Focus, Star, Heart } from 'lucide-react';

import { IStats } from '../types';

export const stats: IStats[] = [
  {
    title: '1000+',
    icon: <Focus size={34} className='text-blue-500' />,
    description:
      'Focus sessions completed during early access — helping users stay consistent and mindful.'
  },
  {
    title: '4.9',
    icon: <Star size={34} className='text-yellow-500' />,
    description:
      'Average rating from our first wave of users who love Lucent’s calm and intuitive design.'
  },
  {
    title: 'Global Launch',
    icon: <Heart size={34} className='text-pink-500' />,
    description:
      'Lucent is now available worldwide — empowering anyone to build better focus habits.'
  }
];
