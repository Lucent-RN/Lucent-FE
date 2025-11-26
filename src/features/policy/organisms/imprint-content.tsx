import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

const ImprintContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);

  return (
    <div className='prose prose-slate max-w-none'>
      {/* <h2 className='manrope text-3xl font-semibold'>
        {t(policyLocalizeStrings.imprintContent.title)}
      </h2>
      <p className='text-foreground-accent mt-2'>
        {t(policyLocalizeStrings.imprintContent.lastUpdated)}
      </p> */}

      <div className='space-y-6'>
        <section>
          <h3 className='font-sans text-xl font-semibold'>
            {t(policyLocalizeStrings.imprintContent.companyInformation)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.imprintContent.companyInformationDescription
            )}
          </p>
          <p>
            {t(policyLocalizeStrings.imprintContent.companyInformationAddress)}
          </p>
          <p>
            <a href='mailto:contact@lucent.app' className='text-primary'>
              {t(policyLocalizeStrings.imprintContent.companyInformationEmail)}
            </a>
          </p>
          <p>
            {t(policyLocalizeStrings.imprintContent.companyInformationPhone)}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            {t(policyLocalizeStrings.imprintContent.representedBy)}
          </h3>
          <p>
            {t(policyLocalizeStrings.imprintContent.representedByDescription)}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            Contact for Privacy
          </h3>
          <p>
            {t(
              policyLocalizeStrings.imprintContent.contactForPrivacyDescription
            )}
            :{' '}
            <a href='mailto:privacy@lucent.app' className='text-primary'>
              {t(policyLocalizeStrings.imprintContent.contactForPrivacyItem1)}
            </a>
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            {t(policyLocalizeStrings.imprintContent.regulatoryAuthority)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.imprintContent
                .regulatoryAuthorityDescription
            )}
          </p>
        </section>
      </div>
    </div>
  );
};

export default ImprintContent;
