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
        'group relative w-full overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-xl transition-all duration-300',
        isActive
          ? 'border-[#22d3ee] bg-[#083a4d]/90 text-white shadow-[0_12px_35px_rgba(6,182,212,0.25)] ring-1 ring-[#22d3ee]/40'
          : 'border-[#a5e3f4]/15 bg-[#062c3b]/70 text-[#e4f7fb] hover:-translate-y-0.5 hover:border-[#22d3ee]/40 hover:bg-[#073648]/80'
      )}
    >
      <div className='relative flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] p-2.5 text-white shadow-[0_4px_16px_rgba(6,182,212,0.35)]'>
            <Icon className='size-5' />
          </div>
          <div>
            <h3 className='font-sans text-base font-semibold text-white'>
              {title}
            </h3>
            <p className='mt-0.5 text-xs font-medium text-[#a5e3f4]'>
              {lastUpdated}
            </p>
          </div>
        </div>
        <ChevronRight
          className={cn(
            'size-5 shrink-0 transition-transform duration-300',
            isActive
              ? 'rotate-90 text-[#22d3ee]'
              : 'text-[#a5e3f4]/60 group-hover:translate-x-1 group-hover:text-[#22d3ee]'
          )}
        />
      </div>
    </button>
  );
};

export default SectionCard;
