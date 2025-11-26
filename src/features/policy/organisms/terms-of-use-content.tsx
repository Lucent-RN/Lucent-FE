import { policyLocalizeStrings } from '@/i18n/localize-strings';
import { useTranslations } from 'next-intl';

const TermsOfUseContent = () => {
  const t = useTranslations(policyLocalizeStrings.getLocal);
  return (
    <div className='prose prose-slate max-w-none'>
      {/* <h2 className='manrope text-3xl font-semibold'>
        {t(policyLocalizeStrings.termOfUseContent.title)}
      </h2>
      <p className='text-foreground-accent mt-2'>
        {t(policyLocalizeStrings.termOfUseContent.lastUpdated)}
      </p> */}

      <div className='space-y-6'>
        <section>
          <h3 className='font-sans text-xl font-semibold'>
            1. {t(policyLocalizeStrings.termOfUseContent.acceptanceOfTerms)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.termOfUseContent
                .acceptanceOfTermsDescription
            )}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            2. {t(policyLocalizeStrings.termOfUseContent.descriptionOfService)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.termOfUseContent
                .descriptionOfServiceDescription
            )}
          </p>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            3. {t(policyLocalizeStrings.termOfUseContent.userAccounts)}
          </h3>
          <p>
            {t(policyLocalizeStrings.termOfUseContent.userAccountsDescription)}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.userAccountsDescription1
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.userAccountsDescription2
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.userAccountsDescription3
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.userAccountsDescription4
              )}
            </li>
          </ul>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            4. {t(policyLocalizeStrings.termOfUseContent.acceptableUse)}
          </h3>
          <p>
            {t(policyLocalizeStrings.termOfUseContent.acceptableUseDescription)}
          </p>
          <ul className='ml-6 list-disc'>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.acceptableUseDescription1
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.acceptableUseDescription2
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.acceptableUseDescription3
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.acceptableUseDescription4
              )}
            </li>
            <li>
              {t(
                policyLocalizeStrings.termOfUseContent.acceptableUseDescription5
              )}
            </li>
          </ul>
        </section>

        <section>
          <h3 className='font-sans text-xl font-semibold'>
            5.{' '}
            {t(
              policyLocalizeStrings.termOfUseContent.intellectualPropertyRights
            )}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.termOfUseContent
                .intellectualPropertyRightsDescription
            )}
          </p>
        </section>
        <section>
          <h3 className='font-sans text-xl font-semibold'>
            6. {t(policyLocalizeStrings.termOfUseContent.changesToTerms)}
          </h3>
          <p>
            {t(
              policyLocalizeStrings.termOfUseContent.changesToTermsDescription
            )}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUseContent;
