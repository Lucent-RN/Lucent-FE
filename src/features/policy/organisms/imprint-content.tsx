const ImprintContent = () => (
  <div className='prose prose-slate max-w-none'>
    <h2 className='manrope text-3xl font-semibold'>Imprint</h2>
    <p className='text-foreground-accent mt-2'>Last updated: January 2025</p>

    <div className='mt-8 space-y-6 text-gray-700'>
      <section>
        <h3 className='manrope text-xl font-semibold'>Company Information</h3>
        <p>
          <strong>Company Name:</strong> Lucent Inc.
        </p>
        <p>
          <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA
          94103, United States
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href='mailto:contact@lucent.app' className='text-primary'>
            contact@lucent.app
          </a>
        </p>
        <p>
          <strong>Phone:</strong> +1 (555) 123-4567
        </p>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>Represented By</h3>
        <p>The company is represented by its Chief Executive Officer.</p>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>Contact for Privacy</h3>
        <p>
          For privacy-related inquiries, please contact:{' '}
          <a href='mailto:privacy@lucent.app' className='text-primary'>
            privacy@lucent.app
          </a>
        </p>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>Regulatory Authority</h3>
        <p>
          This imprint is provided in accordance with applicable US federal and
          state laws governing online services and digital marketplaces.
        </p>
      </section>
    </div>
  </div>
);

export default ImprintContent;
