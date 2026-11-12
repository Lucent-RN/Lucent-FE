import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

const PrivacyPolicyContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);

  return (
    <div className='space-y-8'>
      {/* 1. Introduction */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            1
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.introduction)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent.introductionDescription
          )}
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            2
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.informationWeCollect)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent
              .informationWeCollectDescription
          )}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.privacyPolicyContent.informationWeCollectItem1),
            t(policyLocalizeStrings.privacyPolicyContent.informationWeCollectItem2),
            t(policyLocalizeStrings.privacyPolicyContent.informationWeCollectItem3),
            t(policyLocalizeStrings.privacyPolicyContent.informationWeCollectItem4)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. How We Use Your Information */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            3
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(
              policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformation
            )}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent
              .howWeUseYourInformationDescription
          )}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformationItem1),
            t(policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformationItem2),
            t(policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformationItem3),
            t(policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformationItem4)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Information Sharing */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            4
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.informationSharing)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent
              .informationSharingDescription
          )}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.privacyPolicyContent.informationSharingItem1),
            t(policyLocalizeStrings.privacyPolicyContent.informationSharingItem2),
            t(policyLocalizeStrings.privacyPolicyContent.informationSharingItem3),
            t(policyLocalizeStrings.privacyPolicyContent.informationSharingItem4)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Data Security */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            5
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.dataSecurity)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent.dataSecurityDescription
          )}
        </p>
      </section>

      {/* 6. Your Rights */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            6
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.yourRights)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(
            policyLocalizeStrings.privacyPolicyContent.yourRightsDescription
          )}
        </p>
        <ul className='mt-4 space-y-2.5 pl-0 sm:pl-11'>
          {[
            t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem1),
            t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem2),
            t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem3),
            t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem4),
            t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem5)
          ].map((item, idx) => (
            <li key={idx} className='flex items-start gap-3 text-sm sm:text-base text-[#cffafe]/85 leading-relaxed'>
              <span className='mt-2 size-1.5 shrink-0 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Google API Services User Data Policy Compliance Card */}
      <section className='relative overflow-hidden rounded-2xl border border-[#22d3ee]/40 bg-gradient-to-br from-[#062c3b] via-[#083a4d] to-[#041e29] p-6 sm:p-8 shadow-[0_12px_40px_rgba(6,182,212,0.25)]'>
        <div className='pointer-events-none absolute top-0 right-0 size-64 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.2),transparent)] blur-2xl' />

        <div className='relative flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3.5'>
            <span className='flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] text-xs font-bold text-[#041e29] shadow-[0_0_15px_rgba(34,211,238,0.4)]'>
              7
            </span>
            <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
              Google API Services User Data Policy
            </h3>
          </div>
          <span className='hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-3.5 py-1 text-xs font-medium text-[#67e8f9]'>
            <ShieldCheck className='size-3.5' />
            Verified Limited Use
          </span>
        </div>

        <p className='relative mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/95'>
          Lucent integrates with Google Calendar API to allow users to view their schedules and synchronize calendar events with their Pomodoro and focus sessions.
        </p>

        <div className='relative mt-6 space-y-4 pl-0 sm:pl-11'>
          {/* Compliance Statement */}
          <div className='rounded-xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-4.5'>
            <h4 className='font-semibold text-white text-sm sm:text-base flex items-center gap-2'>
              <span className='size-1.5 rounded-full bg-[#22d3ee]' />
              Compliance Statement
            </h4>
            <p className='mt-1.5 text-xs sm:text-sm text-[#cffafe]/85 leading-relaxed'>
              Lucent&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#22d3ee] font-medium underline underline-offset-4 decoration-[#22d3ee]/50 hover:text-[#67e8f9] hover:decoration-[#22d3ee] transition-colors'
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>

          {/* Data Accessed & Purpose */}
          <div className='rounded-xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-4.5'>
            <h4 className='font-semibold text-white text-sm sm:text-base flex items-center gap-2'>
              <span className='size-1.5 rounded-full bg-[#22d3ee]' />
              Data Accessed & Purpose
            </h4>
            <p className='mt-1.5 text-xs sm:text-sm text-[#cffafe]/85 leading-relaxed'>
              Lucent only accesses user Google Calendar data (such as event titles, start times, end times, and event IDs) when explicitly authorized by the user. This data is used solely to display your calendar events inside the app and to align your focus sessions with your scheduled meetings.
            </p>
          </div>

          {/* No Advertising & No Sale of Data */}
          <div className='rounded-xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-4.5'>
            <h4 className='font-semibold text-white text-sm sm:text-base flex items-center gap-2'>
              <span className='size-1.5 rounded-full bg-[#22d3ee]' />
              No Advertising & No Sale of Data
            </h4>
            <p className='mt-1.5 text-xs sm:text-sm text-[#cffafe]/85 leading-relaxed'>
              Lucent does not sell, rent, or transfer your Google Calendar data to any third parties or data brokers. Google user data is never used for serving advertisements, retargeting, or personalized advertising.
            </p>
          </div>

          {/* No AI Model Training */}
          <div className='rounded-xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-4.5'>
            <h4 className='font-semibold text-white text-sm sm:text-base flex items-center gap-2'>
              <span className='size-1.5 rounded-full bg-[#22d3ee]' />
              No AI Model Training
            </h4>
            <p className='mt-1.5 text-xs sm:text-sm text-[#cffafe]/85 leading-relaxed'>
              Lucent does not use or transfer user data obtained through Google APIs to train, retrain, or improve generalized machine learning (ML) or artificial intelligence (AI) models.
            </p>
          </div>

          {/* Data Retention and Revocation */}
          <div className='rounded-xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-4.5'>
            <h4 className='font-semibold text-white text-sm sm:text-base flex items-center gap-2'>
              <span className='size-1.5 rounded-full bg-[#22d3ee]' />
              Data Retention and Revocation
            </h4>
            <p className='mt-1.5 text-xs sm:text-sm text-[#cffafe]/85 leading-relaxed'>
              You can disconnect your Google Account and revoke Lucent&apos;s access at any time through the in-app settings or via your{' '}
              <a
                href='https://myaccount.google.com/permissions'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#22d3ee] font-medium underline underline-offset-4 decoration-[#22d3ee]/50 hover:text-[#67e8f9] hover:decoration-[#22d3ee] transition-colors'
              >
                Google Account Security Settings
              </a>
              . Upon disconnection, access to your calendar data is immediately terminated.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Contact Us */}
      <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/60 p-6 sm:p-7 backdrop-blur-md transition-all hover:border-[#22d3ee]/30'>
        <div className='flex items-center gap-3.5'>
          <span className='flex size-8 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9] shadow-[0_0_12px_rgba(34,211,238,0.25)]'>
            8
          </span>
          <h3 className='font-sans text-lg sm:text-xl font-semibold text-white'>
            {t(policyLocalizeStrings.privacyPolicyContent.contactUs)}
          </h3>
        </div>
        <p className='mt-3.5 pl-0 sm:pl-11 text-sm sm:text-base leading-relaxed text-[#cffafe]/90'>
          {t(policyLocalizeStrings.privacyPolicyContent.contactUsDescription)}
        </p>
        <div className='mt-5 grid gap-3 sm:grid-cols-3 pl-0 sm:pl-11'>
          <a
            href='mailto:trungkiennguyen0310@gmail.com'
            className='flex items-center gap-3 rounded-xl border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-4 transition-all hover:border-[#22d3ee] hover:bg-[#073648] group'
          >
            <div className='size-9 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center text-[#22d3ee] shrink-0 group-hover:bg-[#22d3ee] group-hover:text-[#041e29] transition-colors'>
              <Mail className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs text-[#a5e3f4]'>Email</p>
              <p className='truncate text-xs sm:text-sm font-medium text-white'>trungkiennguyen0310@gmail.com</p>
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
              <p className='truncate text-xs sm:text-sm font-medium text-white'>+84 974 102 437</p>
            </div>
          </a>

          <div className='flex items-center gap-3 rounded-xl border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-4'>
            <div className='size-9 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center text-[#22d3ee] shrink-0'>
              <MapPin className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs text-[#a5e3f4]'>Location</p>
              <p className='truncate text-xs sm:text-sm font-medium text-white'>Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
