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

const policySections: PolicySection[] = ['privacy', 'terms', 'imprint'];

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

  const activePolicy = policies[activeSection];

  return (
    <Container className='relative min-h-screen overflow-hidden px-4 pt-24 pb-24 sm:px-6 sm:pt-28 md:px-10 md:pt-36 lg:px-12'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='from-primary/25 via-background to-background absolute inset-x-0 top-0 h-[420px] bg-linear-to-b blur-3xl' />
        <div className='bg-secondary/30 absolute top-1/3 right-[-12%] h-72 w-72 rounded-full blur-[140px]' />
        <div className='bg-primary/20 absolute bottom-10 left-[-5%] h-64 w-64 rounded-full blur-[160px]' />
      </div>

      <div className='relative mx-auto flex max-w-6xl flex-col gap-12'>
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='from-background via-background/70 to-background/40 relative overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:p-10'
        >
          <div className=',transparent_55%)] pointer-events-none absolute inset-0 opacity-70' />
          <div className='relative space-y-6'>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className='text-foreground font-sans text-4xl font-bold sm:text-5xl md:text-6xl'
            >
              {t(policyLocalizeStrings.legal)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-foreground-accent mx-auto max-w-2xl text-base sm:text-lg'
            >
              {t(policyLocalizeStrings.legalDescription)}
            </motion.p>

            <div className='text-foreground-accent flex flex-wrap justify-center gap-3 text-xs tracking-[0.35em] uppercase'>
              {policySections.map((section) => (
                <span
                  key={section}
                  className='rounded-full border border-white/20 px-4 py-2 text-[11px]'
                >
                  {policies[section].title}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <div className='grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]'>
          {/* Navigation Sidebar */}
          <aside className='space-y-5 lg:sticky lg:top-32 lg:self-start'>
            {policySections.map((section) => (
              <SectionCard
                Icon={policies[section].icon}
                title={policies[section].title}
                lastUpdated={policies[section].lastUpdated}
                key={section}
                section={section}
                isActive={activeSection === section}
                onSectionClick={setActiveSection}
              />
            ))}
          </aside>

          {/* Content Area */}
          <motion.section
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='relative overflow-hidden rounded-[28px] border border-white/10 bg-white/80 shadow-[0_25px_70px_rgba(15,23,42,0.15)] backdrop-blur dark:bg-white/5'
          >
            <div className='to-secondary/10 pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 via-transparent opacity-80' />

            <div className='relative'>
              <div className='border-b border-white/10 px-6 sm:px-6 sm:py-6'>
                <div className='mt-2 flex flex-wrap items-center justify-between gap-4'>
                  <h2 className='text-foreground font-sans text-2xl font-semibold'>
                    {activePolicy.title}
                  </h2>
                  <span className='text-foreground-accent rounded-full border border-white/20 px-4 py-2 text-xs font-medium'>
                    {activePolicy.lastUpdated}
                  </span>
                </div>
              </div>

              <div className='policy-content px-6 sm:px-6 sm:pb-10'>
                {activeSection === 'privacy' && <PrivacyPolicyContent />}
                {activeSection === 'terms' && <TermsOfUseContent />}
                {activeSection === 'imprint' && <ImprintContent />}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </Container>
  );
};

export default PolicyPage;
