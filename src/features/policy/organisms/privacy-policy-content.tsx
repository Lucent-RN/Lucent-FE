const PrivacyPolicyContent = () => (
  <div className='prose prose-slate max-w-none'>
    <h2 className='manrope text-3xl font-semibold'>Privacy Policy</h2>
    <p className='text-foreground-accent mt-2'>Last updated: January 2025</p>

    <div className='mt-8 space-y-6 text-gray-700'>
      <section>
        <h3 className='manrope text-xl font-semibold'>1. Introduction</h3>
        <p>
          Welcome to Lucent. We respect your privacy and are committed to
          protecting your personal data. This privacy policy explains how we
          collect, use, and safeguard your information when you use our service.
        </p>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>
          2. Information We Collect
        </h3>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul className='ml-6 list-disc'>
          <li>Account information (name, email address)</li>
          <li>Profile information and preferences</li>
          <li>Content you create or submit through the app</li>
          <li>Payment and billing information</li>
        </ul>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>
          3. How We Use Your Information
        </h3>
        <p>We use the information we collect to:</p>
        <ul className='ml-6 list-disc'>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
        </ul>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>
          4. Information Sharing
        </h3>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We may share your information only in the following
          circumstances:
        </p>
        <ul className='ml-6 list-disc'>
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect and defend our rights</li>
          <li>With service providers who assist us in operating our service</li>
        </ul>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>5. Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal data against unauthorized access, alteration,
          disclosure, or destruction.
        </p>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>6. Your Rights</h3>
        <p>You have the right to:</p>
        <ul className='ml-6 list-disc'>
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Request deletion of your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
        </ul>
      </section>

      <section>
        <h3 className='manrope text-xl font-semibold'>7. Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
          <a href='mailto:privacy@lucent.app' className='text-primary'>
            {' '}
            privacy@lucent.app
          </a>
        </p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicyContent;
