import { cn } from '@/lib/utils';

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  className
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <p className='text-primary mb-3 text-xs font-semibold tracking-[0.3em] uppercase'>
          {eyebrow}
        </p>
      )}
      <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
        {title}
      </h2>
      {subtitle && (
        <p className='text-muted-foreground mt-3 text-base sm:text-lg'>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className='bg-card hover:border-primary/40 group rounded-2xl border p-6 transition-colors'>
      <span className='mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#67e8f9] to-[#0891b2] text-white shadow-[0_8px_20px_rgba(6,182,212,0.35)]'>
        {icon}
      </span>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='text-muted-foreground mt-1.5 text-sm leading-relaxed'>
        {text}
      </p>
    </div>
  );
}

/** A deep-space panel (always dark, in both themes) with the nebula + star field. */
export function SpacePanel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'dark relative isolate overflow-hidden bg-[#041e29] text-[#e4f7fb]',
        className
      )}
    >
      <div className='cosmic-sky absolute inset-0 -z-10' />
      <div className='cosmic-stars absolute inset-0 -z-10 opacity-80' />
      <div className='cosmic-stars cosmic-stars-twinkle absolute inset-0 -z-10' />
      {children}
    </div>
  );
}
