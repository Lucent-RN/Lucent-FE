import { stats } from '../data/stats';
import { useTranslations } from 'next-intl';

const Stats: React.FC = () => {
  const t = useTranslations('landing.stats');
  return (
    <section id='stats' className='py-10 lg:py-20'>
      <div className='grid gap-8 sm:grid-cols-3'>
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className='mx-auto max-w-md text-center sm:max-w-full sm:text-left'
          >
            <h3 className='mb-5 flex items-center justify-center gap-2 text-3xl font-semibold sm:justify-start'>
              {stat.icon}
              {stat.title}
            </h3>
            <p className='text-foreground-accent'>
              {t(`items.${index}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
