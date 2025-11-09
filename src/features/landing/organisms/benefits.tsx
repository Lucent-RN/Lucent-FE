import {
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  Heart,
  Moon,
  Target,
  Timer,
  Zap
} from 'lucide-react';
import BenefitSection from '../atoms/benefit-section';

import { IBenefit } from '../types';
import { useTranslations } from 'next-intl';
import { landingLocalizeStrings } from '@/i18n/localize-strings';

const Benefits: React.FC = () => {
  const t = useTranslations(landingLocalizeStrings.benefits.getLocal);

  // Read the localized items array defined under landing.benefits.items in messages
  const localizedItems =
    (t.raw(landingLocalizeStrings.benefits.items) as Array<{
      title: string;
      description: string;
      bullets: Array<{ title: string; description: string }>;
    }>) || [];

  const pickIcon = (sectionIndex: number, bulletIndex: number) => {
    const iconSize = 26;
    if (sectionIndex === 0) {
      if (bulletIndex === 0) return <Timer size={iconSize} />;
      if (bulletIndex === 1) return <Brain size={iconSize} />;
      return <Bell size={iconSize} />;
    }
    if (sectionIndex === 1) {
      if (bulletIndex === 0) return <BarChart3 size={iconSize} />;
      if (bulletIndex === 1) return <CalendarDays size={iconSize} />;
      return <Target size={iconSize} />;
    }
    if (bulletIndex === 0) return <Zap size={iconSize} />;
    if (bulletIndex === 1) return <Moon size={iconSize} />;
    return <Heart size={iconSize} />;
  };

  const pickImage = (sectionIndex: number) => {
    const images = [
      '/images/mockup-timer.png',
      '/images/mockup-statistic.png',
      '/images/mockup-calendar.png'
    ];
    return images[sectionIndex] || images[0];
  };

  const data: IBenefit[] = localizedItems.map((item, sectionIndex) => ({
    title: item.title,
    description: item.description,
    bullets: item.bullets.map((b, bulletIndex) => ({
      title: b.title,
      description: b.description,
      icon: pickIcon(sectionIndex, bulletIndex)
    })),
    imageSrc: pickImage(sectionIndex)
  }));

  return (
    <div id='features'>
      <h2 className='sr-only'>Features</h2>
      {data.map((item, index) => {
        return (
          <BenefitSection
            key={index}
            benefit={item}
            imageAtRight={index % 2 !== 0}
          />
        );
      })}
    </div>
  );
};

export default Benefits;
