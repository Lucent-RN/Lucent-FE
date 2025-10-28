'use client';

import Container from '@/features/landing/atoms/container';
import { FileText, Info, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import SectionCard from '../atoms/section-card';
import ImprintContent from '../organisms/imprint-content';
import PrivacyPolicyContent from '../organisms/privacy-policy-content';
import TermsOfUseContent from '../organisms/terms-of-use-content';

export type PolicySection = 'privacy' | 'terms' | 'imprint';

export const policies = {
  privacy: {
    icon: Shield,
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2025'
  },
  terms: {
    icon: FileText,
    title: 'Terms of Use',
    lastUpdated: 'Last updated: January 2025'
  },
  imprint: {
    icon: Info,
    title: 'Imprint',
    lastUpdated: 'Last updated: January 2025'
  }
};

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState<PolicySection>('privacy');

  return (
    <Container className='min-h-screen pt-12 pb-20'>
      {/* Header */}
      <div className='mb-12 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='manrope text-4xl font-bold md:text-5xl'
        >
          Legal
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-foreground-accent mt-4 text-lg'
        >
          We are committed to our users&apos; right to privacy. We are
          transparent about all aspects of how the app and website work in
          regards to privacy, terms, and personal data.
        </motion.p>
      </div>

      <div className='mx-auto grid max-w-7xl gap-8 md:grid-cols-3'>
        {/* Navigation Sidebar */}
        <div className='space-y-4'>
          {(['privacy', 'terms', 'imprint'] as PolicySection[]).map(
            (section) => (
              <SectionCard
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
