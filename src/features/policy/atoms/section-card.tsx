import { ChevronRight } from 'lucide-react';
import { policies, PolicySection } from '../pages/policy-page';

const SectionCard = ({
  section,
  isActive,
  onSectionClick
}: {
  section: PolicySection;
  isActive: boolean;
  onSectionClick: (section: PolicySection) => void;
}) => {
  const { icon: Icon, title, lastUpdated } = policies[section];

  return (
    <button
      type='button'
      onClick={() => onSectionClick(section)}
      className={`w-full text-left transition-all ${
        isActive
          ? 'border-primary bg-primary/5 text-primary'
          : 'hover:border-primary/50 border-gray-200'
      } rounded-lg border-2 p-6`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-4'>
          <Icon className='mt-1 h-6 w-6 shrink-0' />
          <div>
            <h3 className='manrope text-xl font-semibold'>{title}</h3>
            <p className='text-foreground-accent mt-1 text-sm'>{lastUpdated}</p>
          </div>
        </div>
        <ChevronRight
          className={`h-5 w-5 transition-transform ${
            isActive ? 'rotate-90' : ''
          }`}
        />
      </div>
    </button>
  );
};

export default SectionCard;
