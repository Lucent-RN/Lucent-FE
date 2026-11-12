import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

const TermsOfUseContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);

  return (
    <div className='space-y-8'>
      {/* 1. Acceptance of Terms */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            1
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.acceptanceOfTerms)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.termOfUseContent
              .acceptanceOfTermsDescription
          )}
        </p>
      </section>

      {/* 2. Description of Service */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            2
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.descriptionOfService)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.termOfUseContent
              .descriptionOfServiceDescription
          )}
        </p>
      </section>

      {/* 3. User Accounts */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            3
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.userAccounts)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(policyLocalizeStrings.termOfUseContent.userAccountsDescription)}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.termOfUseContent.userAccountsDescription1),
            t(policyLocalizeStrings.termOfUseContent.userAccountsDescription2),
            t(policyLocalizeStrings.termOfUseContent.userAccountsDescription3),
            t(policyLocalizeStrings.termOfUseContent.userAccountsDescription4)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Acceptable Use */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            4
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.acceptableUse)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription)}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription1),
            t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription2),
            t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription3),
            t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription4),
            t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription5)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Intellectual Property Rights */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            5
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.intellectualPropertyRights)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.termOfUseContent
              .intellectualPropertyRightsDescription
          )}
        </p>
      </section>

      {/* 6. Changes to Terms */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            6
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.termOfUseContent.changesToTerms)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.termOfUseContent.changesToTermsDescription
          )}
        </p>
      </section>
    </div>
  );
};

export default TermsOfUseContent;
