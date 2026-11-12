'use client';

import Container from '@/features/landing/atoms/container';
import CTA from '@/features/landing/moleculus/cta';
import { SpacePanel } from '@/features/landing/sections/section-head';
import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { cn } from '@/lib/utils';
import { FileText, Info, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import SectionCard from '../atoms/section-card';
import ImprintContent from '../organisms/imprint-content';
import PrivacyPolicyContent from '../organisms/privacy-policy-content';
import TermsOfUseContent from '../organisms/terms-of-use-content';

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

  const handleScrollToSection = (section: PolicySection) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offsets = policySections.map((sec) => {
        const el = document.getElementById(sec);
        return {
          section: sec,
          top: el ? el.offsetTop - 160 : 0
        };
      });

      for (let i = offsets.length - 1; i >= 0; i--) {
        if (scrollY >= offsets[i].top) {
          setActiveSection(offsets[i].section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SpacePanel className='min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28'>
      {/* Ambient background glow */}
      <div className='pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 size-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent)] blur-3xl -z-10' />
      <div className='pointer-events-none absolute top-1/2 right-[-8%] size-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(8,145,178,0.14),transparent)] blur-3xl -z-10' />

      <Container className='relative px-4 sm:px-6 md:px-10 lg:px-12'>
        <div className='relative mx-auto flex max-w-6xl flex-col gap-12'>
          {/* Hero Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='relative overflow-hidden rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-8 text-center shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl sm:p-12'
          >
            <div className='relative space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.3em] text-[#67e8f9] uppercase backdrop-blur-md'>
                <Shield className='size-3.5' />
                <span>Lucent Legal & Transparency</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className='bg-gradient-to-br from-white via-[#e4f7fb] to-[#67e8f9] bg-clip-text font-sans text-4xl font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl'
              >
                {t(policyLocalizeStrings.legal)}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className='mx-auto max-w-2xl text-base text-[#a5e3f4] sm:text-lg leading-relaxed'
              >
                {t(policyLocalizeStrings.legalDescription)}
              </motion.p>

              {/* Navigation Pill Buttons */}
              <div className='flex flex-wrap justify-center gap-3 pt-2'>
                {policySections.map((section) => {
                  const isActive = activeSection === section;
                  const Icon = policies[section].icon;
                  return (
                    <button
                      key={section}
                      onClick={() => handleScrollToSection(section)}
                      className={cn(
                        'flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 backdrop-blur-md',
                        isActive
                          ? 'border border-[#22d3ee] bg-[#0891b2]/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                          : 'border border-[#a5e3f4]/20 bg-[#062c3b]/60 text-[#a5e3f4] hover:border-[#22d3ee]/50 hover:text-white'
                      )}
                    >
                      <Icon className='size-3.5 text-[#22d3ee]' />
                      <span>{policies[section].title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* Grid Layout: Sidebar + Continuous Content Area */}
          <div className='grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]'>
            {/* Sticky Navigation Sidebar */}
            <aside className='space-y-4 lg:sticky lg:top-32 lg:self-start'>
              {policySections.map((section) => (
                <SectionCard
                  Icon={policies[section].icon}
                  title={policies[section].title}
                  lastUpdated={policies[section].lastUpdated}
                  key={section}
                  section={section}
                  isActive={activeSection === section}
                  onSectionClick={handleScrollToSection}
                />
              ))}
            </aside>

            {/* Continuous Content Area */}
            <div className='flex flex-col gap-10'>
              {/* Privacy Policy Section */}
              <section
                id='privacy'
                className='scroll-mt-32 relative overflow-hidden rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/80 p-6 sm:p-10 shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl text-[#e4f7fb]'
              >
                <div className='border-b border-[#a5e3f4]/15 pb-6 mb-8'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='size-11 rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] p-2.5 text-white shadow-[0_4px_16px_rgba(6,182,212,0.35)] flex items-center justify-center shrink-0'>
                        <Shield className='size-5' />
                      </div>
                      <h2 className='text-2xl sm:text-3xl font-semibold text-white tracking-tight'>
                        {policies.privacy.title}
                      </h2>
                    </div>
                    <span className='rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-medium text-[#67e8f9]'>
                      {policies.privacy.lastUpdated}
                    </span>
                  </div>
                </div>
                <div className='policy-content'>
                  <PrivacyPolicyContent />
                </div>
              </section>

              {/* Terms of Use Section */}
              <section
                id='terms'
                className='scroll-mt-32 relative overflow-hidden rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/80 p-6 sm:p-10 shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl text-[#e4f7fb]'
              >
                <div className='border-b border-[#a5e3f4]/15 pb-6 mb-8'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='size-11 rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] p-2.5 text-white shadow-[0_4px_16px_rgba(6,182,212,0.35)] flex items-center justify-center shrink-0'>
                        <FileText className='size-5' />
                      </div>
                      <h2 className='text-2xl sm:text-3xl font-semibold text-white tracking-tight'>
                        {policies.terms.title}
                      </h2>
                    </div>
                    <span className='rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-medium text-[#67e8f9]'>
                      {policies.terms.lastUpdated}
                    </span>
                  </div>
                </div>
                <div className='policy-content'>
                  <TermsOfUseContent />
                </div>
              </section>

              {/* Imprint Section */}
              <section
                id='imprint'
                className='scroll-mt-32 relative overflow-hidden rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/80 p-6 sm:p-10 shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl text-[#e4f7fb]'
              >
                <div className='border-b border-[#a5e3f4]/15 pb-6 mb-8'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='size-11 rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] p-2.5 text-white shadow-[0_4px_16px_rgba(6,182,212,0.35)] flex items-center justify-center shrink-0'>
                        <Info className='size-5' />
                      </div>
                      <h2 className='text-2xl sm:text-3xl font-semibold text-white tracking-tight'>
                        {policies.imprint.title}
                      </h2>
                    </div>
                    <span className='rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-medium text-[#67e8f9]'>
                      {policies.imprint.lastUpdated}
                    </span>
                  </div>
                </div>
                <div className='policy-content'>
                  <ImprintContent />
                </div>
              </section>
            </div>
          </div>
        </div>
        <CTA isShowingButtons={false} />
      </Container>
    </SpacePanel>
  );
};

export default PolicyPage;
