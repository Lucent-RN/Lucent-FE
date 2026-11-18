import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    product: 'lucent',
    title: 'Timer',
    url: '/dashboard/lucent',
    icon: 'timer',
    shortcut: ['t', 't'],
    items: []
  },
  {
    product: 'lucent',
    title: 'Tasks',
    url: '/dashboard/lucent/tasks',
    icon: 'post',
    shortcut: ['k', 'k'],
    items: []
  },
  {
    product: 'lucent',
    title: 'Statistics',
    url: '/dashboard/lucent/stats',
    icon: 'dashboard',
    shortcut: ['s', 's'],
    items: []
  },
  {
    product: 'lucent',
    title: 'Settings',
    url: '/dashboard/lucent/settings',
    icon: 'settings',
    shortcut: ['g', 'g'],
    items: []
  },
  {
    product: 'meet',
    title: 'Calendar',
    url: '/dashboard/meet',
    icon: 'dashboard',
    shortcut: ['c', 'c'],
    items: []
  },
  {
    product: 'meet',
    title: 'AI Assistant',
    url: '/dashboard/meet/assistant',
    icon: 'post',
    shortcut: ['a', 'a'],
    items: []
  },
  {
    product: 'meet',
    title: 'Accounts',
    url: '/dashboard/meet/accounts',
    icon: 'user',
    shortcut: ['u', 'u'],
    items: []
  },
  {
    product: 'meet',
    title: 'Settings',
    url: '/dashboard/meet/settings',
    icon: 'settings',
    shortcut: ['g', 'g'],
    items: []
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
