import Container from '../atoms/container';
import Stats from '../atoms/stats';
import CTA from '../moleculus/cta';
import Section from '../moleculus/section';
import Testimonials from '../moleculus/testimonials';
import Benefits from '../organisms/benefits';
import FAQ from '../organisms/faq';
import Hero from '../organisms/hero';
import Pricing from '../organisms/pricing';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Container className='mt-60'>
        <Benefits />

        <Section
          id='pricing'
          title='Pricing'
          description='Simple, transparent pricing. No surprises.'
        >
          <Pricing />
        </Section>

        <Section
          id='testimonials'
          title='What Our Clients Say'
          description='Hear from those who have partnered with us.'
        >
          <Testimonials />
        </Section>

        <FAQ />

        <Stats />

        <CTA />
      </Container>
    </>
  );
};

export default LandingPage;
