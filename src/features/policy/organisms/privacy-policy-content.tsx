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

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            7. {t(policyLocalizeStrings.privacyPolicyContent.contactUs)}
          </h3>
          <p>
            {t(policyLocalizeStrings.privacyPolicyContent.contactUsDescription)}
            <a href='mailto:privacy@lucent.app' className='text-primary'>
              {t(policyLocalizeStrings.privacyPolicyContent.contactUsItem1)}
            </a>
          </p>
          <p>
            {t(policyLocalizeStrings.privacyPolicyContent.contactUsItem2)}
            <a href='tel:privacy@lucent.app' className='text-primary'>
              {t(policyLocalizeStrings.privacyPolicyContent.contactUsItem2)}
            </a>
          </p>
          <p>
            {t(policyLocalizeStrings.privacyPolicyContent.contactUsItem3)}
            <a
              href='https://maps.app.goo.gl/1234567890'
              className='text-primary'
            >
              {t(policyLocalizeStrings.privacyPolicyContent.contactUsItem3)}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
