import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { Building2, Mail, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ImprintContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);

  return (
    <div className='space-y-8'>
      {/* 1. Company Information */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <div className='size-8 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9] flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.25)] shrink-0'>
            <Building2 className='size-4' />
          </div>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.imprintContent.companyInformation)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.imprintContent.companyInformationDescription
          )}
        </p>
        <p className='mt-2 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/85'>
          {t(policyLocalizeStrings.imprintContent.companyInformationAddress)}
        </p>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 pl-0 sm:pl-11'>
          <a
            href='mailto:trungkiennguyen0310@gmail.com'
            className='flex items-center gap-3 rounded-xl border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-4 transition-all hover:border-[#22d3ee] hover:bg-[#073648] group'
          >
            <div className='size-9 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center text-[#22d3ee] shrink-0 group-hover:bg-[#22d3ee] group-hover:text-[#041e29] transition-colors'>
              <Mail className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs text-[#a5e3f4]'>Email</p>
              <p className='truncate text-xs sm:text-sm font-medium text-white'>
                {t(policyLocalizeStrings.imprintContent.companyInformationEmail)}
              </p>
            </div>
          </a>

          <a
            href='tel:+84974102437'
            className='flex items-center gap-3 rounded-xl border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-4 transition-all hover:border-[#22d3ee] hover:bg-[#073648] group'
          >
            <div className='size-9 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center text-[#22d3ee] shrink-0 group-hover:bg-[#22d3ee] group-hover:text-[#041e29] transition-colors'>
              <Phone className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs text-[#a5e3f4]'>Phone</p>
              <p className='truncate text-xs sm:text-sm font-medium text-white'>
                {t(policyLocalizeStrings.imprintContent.companyInformationPhone)}
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* 2. Represented By */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <div className='size-8 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9] flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.25)] shrink-0'>
            <UserCheck className='size-4' />
          </div>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.imprintContent.representedBy)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(policyLocalizeStrings.imprintContent.representedByDescription)}
        </p>
      </section>

      {/* 3. Contact for Privacy */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <div className='size-8 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9] flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.25)] shrink-0'>
            <ShieldCheck className='size-4' />
          </div>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            Contact for Privacy
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.imprintContent.contactForPrivacyDescription
          )}
          :{' '}
          <a
            href='mailto:trungkiennguyen0310@gmail.com'
            className='text-[#22d3ee] font-medium underline underline-offset-4 decoration-[#22d3ee]/50 hover:text-[#67e8f9] transition-colors'
          >
            {t(policyLocalizeStrings.imprintContent.contactForPrivacyItem1)}
          </a>
        </p>
      </section>

      {/* 4. Regulatory Authority */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            4
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.imprintContent.regulatoryAuthority)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.imprintContent
              .regulatoryAuthorityDescription
          )}
        </p>
      </section>
    </div>
  );
};

export default ImprintContent;
