import {
  BarChart3,
  Briefcase,
  DollarSign,
  Lock,
  PieChart,
  Shield,
  Target,
  TrendingUp,
  User
} from 'lucide-react';

import { IBenefit } from '../types';

export const benefits: IBenefit[] = [
  {
    title: 'Smart Budgeting',
    description:
      'Take the guesswork out of managing your money. Our AI-powered budgeting tool adapts to your lifestyle and helps you stay on track.',
    bullets: [
      {
        title: 'Intelligent Categorization',
        description:
          'Automatically sorts your transactions for crystal-clear insights.',
        icon: <BarChart3 size={26} />
      },
      {
        title: 'Customizable Goals',
        description: 'Set and track financial objectives that matter to you.',
        icon: <Target size={26} />
      },
      {
        title: 'Predictive Analysis',
        description:
          'Get ahead of your finances with spending forecasts and alerts.',
        icon: <TrendingUp size={26} />
      }
    ],
    imageSrc: '/images/mockup-1.webp'
  },
  {
    title: 'Seamless Investing',
    description:
      'Start building wealth today, no financial degree required. Finwise makes investing accessible and straightforward.',
    bullets: [
      {
        title: 'Micro-Investing',
        description: 'Begin with as little as $1 and watch your money grow.',
        icon: <DollarSign size={26} />
      },
      {
        title: 'Expert Portfolios',
        description:
          'Choose from investment strategies tailored to your risk tolerance.',
        icon: <Briefcase size={26} />
      },
      {
        title: 'Real-Time Performance',
        description:
          'Track your investments with easy-to-understand metrics and visuals.',
        icon: <PieChart size={26} />
      }
    ],
    imageSrc: '/images/mockup-2.webp'
  },
  {
    title: 'Bank-Grade Security',
    description:
      'Your financial data deserves the best protection. Rest easy knowing Finwise employs cutting-edge security measures.',
    bullets: [
      {
        title: 'Military-Grade Encryption',
        description:
          'Your information is safeguarded with the highest level of encryption.',
        icon: <Lock size={26} />
      },
      {
        title: 'Biometric Authentication',
        description:
          'Access your account securely with fingerprint or facial recognition.',
        icon: <User size={26} />
      },
      {
        title: 'Real-Time Fraud Detection',
        description:
          'Our system constantly monitors for suspicious activity to keep your money safe.',
        icon: <Shield size={26} />
      }
    ],
    imageSrc: '/images/mockup-1.webp'
  }
];
