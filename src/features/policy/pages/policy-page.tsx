'use client';

import Container from '@/features/landing/atoms/container';
import { FileText, Info, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SectionCard from '../atoms/section-card';
import ImprintContent from '../organisms/imprint-content';
import PrivacyPolicyContent from '../organisms/privacy-policy-content';
import TermsOfUseContent from '../organisms/terms-of-use-content';
import { policyLocalizeStrings } from '@/i18n/localize-strings';

export type PolicySection = 'privacy' | 'terms' | 'imprint';

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState<PolicySection>('privacy');
  const t = useTranslations(policyLocalizeStrings.getLocal);

  const policies = {
    privacy: {
      icon: Shield,
      title: t(policyLocalizeStrings.privacyPolicyContent.title),
      lastUpdated: t(policyLocalizeStrings.privacyPolicyContent.lastUpdated)
    },
    terms: {
      icon: FileText,
      title: t(policyLocalizeStrings.termOfUseContent.title),
      lastUpdated: t(policyLocalizeStrings.termOfUseContent.lastUpdated)
    },
    imprint: {
      icon: Info,
      title: t(policyLocalizeStrings.imprintContent.title),
      lastUpdated: t(policyLocalizeStrings.imprintContent.lastUpdated)
    }
  };

  return (
    <Container className='min-h-screen pt-24 pb-20 sm:pt-28 md:pt-36 lg:pt-44'>
      {/* Header */}
      <div className='mb-12 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='manrope text-4xl font-bold md:text-5xl'
        >
          {t(policyLocalizeStrings.legal)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-foreground-accent mt-4 text-lg'
        >
          {t(policyLocalizeStrings.legalDescription)}
        </motion.p>
      </div>

      <div className='mx-auto grid max-w-7xl gap-8 md:grid-cols-3'>
        {/* Navigation Sidebar */}
        <div className='space-y-4'>
          {(['privacy', 'terms', 'imprint'] as PolicySection[]).map(
            (section) => (
              <SectionCard
                Icon={policies[section].icon}
                title={policies[section].title}
                lastUpdated={policies[section].lastUpdated}
                key={section}
                section={section}
                isActive={activeSection === section}
                onSectionClick={setActiveSection}
              />
            )
          )}
        </div>

        {/* Content Area */}
        <div className='md:col-span-2'>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-card rounded-lg border border-gray-200 p-8 shadow-sm'
          >
            {activeSection === 'privacy' && <PrivacyPolicyContent />}
            {activeSection === 'terms' && <TermsOfUseContent />}
            {activeSection === 'imprint' && <ImprintContent />}
          </motion.div>
        </div>
      </div>
    </Container>
  );
};

export default PolicyPage;
