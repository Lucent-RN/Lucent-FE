import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

const PrivacyPolicyContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);
  return (
    <div className='prose prose-slate max-w-none'>
      {/* <h2 className='manrope text-3xl font-semibold'>
        {t(policyLocalizeStrings.privacyPolicyContent.title)}
      </h2>
      <p className='text-foreground-accent mt-2'>
        {t(policyLocalizeStrings.privacyPolicyContent.lastUpdated)}
      </p> */}

      <div className='space-y-6'>
        <section>
          <h3 className='font-sans text-xl font-semibold'>
            1. {t(policyLocalizeStrings.privacyPolicyContent.introduction)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent.introductionDescription
            )}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            2.{' '}
            {t(policyLocalizeStrings.privacyPolicyContent.informationWeCollect)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent
                .informationWeCollectDescription
            )}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationWeCollectItem1
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationWeCollectItem2
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationWeCollectItem3
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationWeCollectItem4
              )}
            </li>
          </ul>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            3.{' '}
            {t(
              policyLocalizeStrings.privacyPolicyContent.howWeUseYourInformation
            )}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent
                .howWeUseYourInformationDescription
            )}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .howWeUseYourInformationItem1
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .howWeUseYourInformationItem2
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .howWeUseYourInformationItem3
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .howWeUseYourInformationItem4
              )}
            </li>
          </ul>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            4.{' '}
            {t(policyLocalizeStrings.privacyPolicyContent.informationSharing)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent
                .informationSharingDescription
            )}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationSharingItem1
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationSharingItem2
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationSharingItem3
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.privacyPolicyContent
                  .informationSharingItem4
              )}
            </li>
          </ul>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            5. {t(policyLocalizeStrings.privacyPolicyContent.dataSecurity)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent.dataSecurityDescription
            )}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            6. {t(policyLocalizeStrings.privacyPolicyContent.yourRights)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.privacyPolicyContent.yourRightsDescription
            )}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem1)}
            </li>
            <li>
              {t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem2)}
            </li>
            <li>
              {t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem3)}
            </li>
            <li>
              {t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem4)}
            </li>
            <li>
              {t(policyLocalizeStrings.privacyPolicyContent.yourRightsItem5)}
            </li>
          </ul>
        </section>

        <section className='rounded-2xl border border-primary/30 bg-primary/5 p-6'>
          <h3 className='font-sans text-xl font-semibold text-foreground'>
            7. Google API Services User Data Policy
          </h3>
          <p className='mt-2'>
            Lucent integrates with Google Calendar API to allow users to view their schedules and synchronize calendar events with their Pomodoro and focus sessions.
          </p>
          <div className='mt-3 space-y-3 text-sm leading-relaxed'>
            <p>
              <strong>Compliance Statement:</strong> Lucent&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary font-medium underline'
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <p>
              <strong>Data Accessed & Purpose:</strong> Lucent only accesses user Google Calendar data (such as event titles, start times, end times, and event IDs) when explicitly authorized by the user. This data is used solely to display your calendar events inside the app and to align your focus sessions with your scheduled meetings.
            </p>
            <p>
              <strong>No Advertising & No Sale of Data:</strong> Lucent does not sell, rent, or transfer your Google Calendar data to any third parties or data brokers. Google user data is never used for serving advertisements, retargeting, or personalized advertising.
            </p>
            <p>
              <strong>No AI Model Training:</strong> Lucent does not use or transfer user data obtained through Google APIs to train, retrain, or improve generalized machine learning (ML) or artificial intelligence (AI) models.
            </p>
            <p>
              <strong>Data Retention and Revocation:</strong> You can disconnect your Google Account and revoke Lucent&apos;s access at any time through the in-app settings or via your{' '}
              <a
                href='https://myaccount.google.com/permissions'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary font-medium underline'
              >
                Google Account Security Settings
              </a>
              . Upon disconnection, access to your calendar data is immediately terminated.
            </p>
          </div>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            8. {t(policyLocalizeStrings.privacyPolicyContent.contactUs)}
          </h3>
          <p>
            {t(policyLocalizeStrings.privacyPolicyContent.contactUsDescription)}
          </p>
          <ul className='ml-6 list-disc space-y-1'>
            <li>
              Email:{' '}
              <a href='mailto:trungkiennguyen0310@gmail.com' className='text-primary font-medium underline'>
                trungkiennguyen0310@gmail.com
              </a>
            </li>
            <li>
              Phone:{' '}
              <a href='tel:+84974102437' className='text-primary font-medium underline'>
                +84 974 102 437
              </a>
            </li>
            <li>
              Address: Ho Chi Minh City, Vietnam
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
