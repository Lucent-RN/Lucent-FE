import Container from '../atoms/container';
import Stats from '../atoms/stats';
import CTA from '../moleculus/cta';
import Benefits from '../organisms/benefits';
import FAQ from '../organisms/faq';
import Hero from '../organisms/hero';

const LandingPage = () => {
  return (
    <div className='px-10'>
      <Hero />
      <Container className='mt-60'>
        <Benefits />

        {/* <Section
          id='pricing'
          title='Pricing'
          description='Simple, transparent pricing. No surprises.'
        >
          <Pricing />
        </Section> */}

        {/* <Section
          id='testimonials'
          title='What Our Clients Say'
          description='Hear from those who have partnered with us.'
        >
          <Testimonials />
        </Section> */}

        <FAQ />

        <Stats />

        <CTA />
      </Container>
    </div>
  );
};

export default LandingPage;
