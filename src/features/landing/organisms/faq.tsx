'use client';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react';
import { Minus, Plus } from 'lucide-react';

import SectionTitle from '../atoms/section-title';
import { faqs } from '../data/faq';
import { useTranslations } from 'next-intl';

const FAQ: React.FC = () => {
  const t = useTranslations('landing.faq');
  return (
    <section id='faq' className='py-10 lg:py-20'>
      <div className='flex flex-col gap-10 lg:flex-row'>
        <div className=''>
          <p className='text-foreground-accent hidden lg:block'>{t('label')}</p>
          <SectionTitle>
            <h2 className='my-3 text-center !leading-snug lg:max-w-sm lg:text-left'>
              {t('title')}
            </h2>
          </SectionTitle>
          <p className='text-foreground-accent text-center lg:mt-10 lg:text-left'>
            {t('subtitle')}
          </p>
          <a
            href='mailto:'
            className='mt-3 block text-center text-xl font-semibold hover:underline lg:text-left lg:text-4xl'
          >
            {t('email')}
          </a>
        </div>

        <div className='mx-auto w-full border-b lg:max-w-2xl'>
          {faqs.map((faq, index) => (
            <div key={index} className='mb-7'>
              <Disclosure>
                {({ open }) => (
                  <div key={index}>
                    <DisclosureButton className='flex w-full items-center justify-between border-t px-4 pt-7 text-left text-lg'>
                      <span className='text-2xl font-semibold'>
                        {faq.question}
                      </span>
                      {open ? (
                        <Minus className='text-secondary h-5 w-5' />
                      ) : (
                        <Plus className='text-secondary h-5 w-5' />
                      )}
                    </DisclosureButton>
                    <DisclosurePanel className='text-foreground-accent px-4 pt-4 pb-2'>
                      {faq.answer}
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
