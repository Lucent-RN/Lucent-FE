import { Check, Mail, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Container from '@/features/landing/atoms/container';
import { SpacePanel } from '@/features/landing/sections/section-head';
import { Link } from '@/i18n/navigation';

interface Section {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

/** LucentMeet-only privacy policy (/meet/privacy). Copy lives in messages → "meet-privacy". */
export default function MeetPrivacyPage() {
  const t = useTranslations('meet-privacy');
  const sections = t.raw('sections') as Section[];
  const highlights = t.raw('highlights') as string[];
  const email = t('contactEmail');

  return (
    <SpacePanel className='min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28'>
      <div className='pointer-events-none absolute top-10 left-1/2 -z-10 size-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent)] blur-3xl' />
      <Container className='relative px-4 sm:px-6 md:px-10 lg:px-12'>
        <div className='mx-auto flex max-w-4xl flex-col gap-8'>
          <header className='rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-8 text-center shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl sm:p-12'>
            <div className='inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.3em] text-[#67e8f9] uppercase'>
              <Shield className='size-3.5' />
              {t('eyebrow')}
            </div>
            <h1 className='mt-6 bg-gradient-to-br from-white via-[#e4f7fb] to-[#67e8f9] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl'>
              {t('title')}
            </h1>
            <p className='mt-3 text-sm font-medium text-[#67e8f9]'>
              {t('updated')}
            </p>
            <p className='mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#a5e3f4]'>
              {t('intro')}
            </p>
          </header>

          <section className='rounded-[28px] border border-[#22d3ee]/25 bg-[#0891b2]/10 p-6 text-[#e4f7fb] backdrop-blur-xl sm:p-8'>
            <h2 className='text-lg font-semibold text-white'>
              {t('highlightsTitle')}
            </h2>
            <ul className='mt-4 space-y-3'>
              {highlights.map((h) => (
                <li key={h} className='flex gap-3 text-sm leading-relaxed sm:text-base'>
                  <Check className='mt-1 size-4 shrink-0 text-[#22d3ee]' />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className='space-y-5'>
            {sections.map((s, i) => (
              <section
                key={s.title}
                className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-6 text-[#cffafe]/90 backdrop-blur-md sm:p-7'
              >
                <div className='flex items-center gap-3.5'>
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-xs font-bold text-[#67e8f9]'>
                    {i + 1}
                  </span>
                  <h2 className='text-lg font-semibold text-white sm:text-xl'>
                    {s.title}
                  </h2>
                </div>
                <div className='mt-3.5 space-y-3 text-sm leading-relaxed sm:pl-11 sm:text-base'>
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.bullets && (
                    <ul className='list-disc space-y-2 pl-5 marker:text-[#22d3ee]'>
                      {s.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#062c3b]/80 p-6 text-center text-[#e4f7fb] sm:p-8'>
            <h2 className='text-xl font-semibold text-white'>
              {t('contactTitle')}
            </h2>
            <p className='mt-2 text-sm text-[#a5e3f4] sm:text-base'>
              {t('contactText')}
            </p>
            <a
              href={`mailto:${email}`}
              className='mt-4 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-5 py-2.5 text-sm font-semibold text-[#67e8f9] hover:bg-[#22d3ee]/20'
            >
              <Mail className='size-4' />
              {email}
            </a>
            <div className='mt-5'>
              <Link href='/policy' className='text-sm text-[#a5e3f4] underline-offset-4 hover:underline'>
                {t('backToLegal')}
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </SpacePanel>
  );
}
