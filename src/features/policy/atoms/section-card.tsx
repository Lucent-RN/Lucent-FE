import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PolicySection } from '../pages/policy-page';

const SectionCard = ({
  Icon,
  title,
  lastUpdated,
  section,
  isActive,
  onSectionClick
}: {
  Icon: LucideIcon;
  title: string;
  lastUpdated: string;
  section: PolicySection;
  isActive: boolean;
  onSectionClick: (section: PolicySection) => void;
}) => {
  return (
    <button
      type='button'
      onClick={() => onSectionClick(section)}
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-white/70 p-5 text-left backdrop-blur-lg transition-all duration-300 dark:bg-white/5',
        isActive
          ? 'ring-primary/40 shadow-[0_16px_50px_rgba(15,23,42,0.2)] ring-1'
          : 'hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.18)]'
      )}
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <div className='from-primary/15 to-secondary/30 absolute inset-0 bg-linear-to-br via-transparent' />
      </div>
      <div className='relative flex items-start justify-between gap-4'>
        <div className='flex items-start gap-4'>
          <div className='bg-accent-foreground rounded-2xl border p-3 text-white dark:border-white/10'>
            <Icon className='h-5 w-5 shrink-0' />
          </div>
          <div>
            <h3 className='text-foreground font-sans text-lg font-semibold'>
              {title}
            </h3>
            <p className='text-foreground-accent mt-1 text-sm'>{lastUpdated}</p>
          </div>
        </div>
        <ChevronRight
          className={cn(
            'text-muted-foreground h-5 w-5 transition-transform duration-300',
            isActive ? 'text-primary rotate-90' : 'group-hover:translate-x-1'
          )}
        />
      </div>
    </button>
  );
};

export default SectionCard;
