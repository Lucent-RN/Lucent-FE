import {
  Timer,
  BarChart3,
  CalendarDays,
  Bell,
  Target,
  Brain,
  Zap,
  Moon,
  Heart
} from 'lucide-react';

import { IBenefit } from '../types';

export const benefits: IBenefit[] = [
  {
    title: 'Mindful Focus Sessions',
    description:
      'Lucent helps you cultivate deep focus and balance through beautifully designed Pomodoro sessions — empowering you to work with clarity, not pressure.',
    bullets: [
      {
        title: 'Smart Pomodoro Timer',
        description:
          'Stay focused and recharge effectively with structured work and break intervals.',
        icon: <Timer size={26} />
      },
      {
        title: 'Adaptive Focus Modes',
        description:
          'Switch between study, work, or creative modes that fit your current mindset.',
        icon: <Brain size={26} />
      },
      {
        title: 'Progressive Reminders',
        description:
          'Gentle notifications keep you consistent without disrupting your flow.',
        icon: <Bell size={26} />
      }
    ],
    imageSrc: '/images/mockup-timer.png'
  },
  {
    title: 'Track Your Progress',
    description:
      'Visualize your growth with detailed analytics that turn every focus session into measurable progress.',
    bullets: [
      {
        title: 'Insightful Statistics',
        description:
          'View total sessions, time spent, and performance across days or weeks.',
        icon: <BarChart3 size={26} />
      },
      {
        title: 'Calendar Overview',
        description:
          'See your productivity trends and streaks at a glance through an integrated calendar.',
        icon: <CalendarDays size={26} />
      },
      {
        title: 'Goal Tracking',
        description:
          'Set focus milestones and celebrate your achievements along the way.',
        icon: <Target size={26} />
      }
    ],
    imageSrc: '/images/mockup-statistic.png'
  },
  {
    title: 'Wellness Meets Productivity',
    description:
      'Lucent brings a holistic approach to focus — combining productivity tools with mindful habits for a healthier workflow.',
    bullets: [
      {
        title: 'Focus Mode',
        description:
          'Silence distractions and stay immersed in deep work automatically.',
        icon: <Zap size={26} />
      },
      {
        title: 'Sleep & Energy Balance',
        description:
          'Sync your breaks with natural rhythms for sustained mental energy.',
        icon: <Moon size={26} />
      },
      {
        title: 'Apple Health Integration',
        description:
          'Track mindful minutes and focus time as part of your overall well-being.',
        icon: <Heart size={26} />
      }
    ],
    imageSrc: '/images/mockup-calendar.png'
  }
];
