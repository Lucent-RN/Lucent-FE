import { Check, Mail, Smartphone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Container from '@/features/landing/atoms/container';
import { SpacePanel } from '@/features/landing/sections/section-head';
import { Link } from '@/i18n/navigation';
import MeetDeleteAccountAction from '../components/meet-delete-account-action';

/**
 * LucentMeet account deletion (/meet/delete-account) — the public URL the App Store and
 * Google Play listings point to. Copy lives in messages → "meet-delete-account".
 */
export default function MeetDeleteAccountPage() {
  const t = useTranslations('meet-delete-account');
  const appSteps = t.raw('app.steps') as string[];
  const deleted = t.raw('data.deleted') as string[];
  const email = t('email.address');
  const mailto = `mailto:${email}?subject=${encodeURIComponent(t('email.subject'))}`;

  return (
    <SpacePanel className='min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28'>
      <div className='pointer-events-none absolute top-10 left-1/2 -z-10 size-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent)] blur-3xl' />
      <Container className='relative px-4 sm:px-6 md:px-10 lg:px-12'>
        <div className='mx-auto flex max-w-4xl flex-col gap-8'>
          <header className='rounded-[32px] border border-[#a5e3f4]/15 bg-[#062c3b]/70 p-8 text-center shadow-[0_25px_70px_rgba(4,30,41,0.5)] backdrop-blur-2xl sm:p-12'>
            <div className='inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.3em] text-[#67e8f9] uppercase'>
              <Trash2 className='size-3.5' />
              {t('eyebrow')}
            </div>
            <h1 className='mt-6 bg-gradient-to-br from-white via-[#e4f7fb] to-[#67e8f9] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl'>
              {t('title')}
            </h1>
            <p className='mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#a5e3f4]'>
              {t('intro')}
            </p>
          </header>

          {/* Option 1 — in the app */}
          <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-6 text-[#cffafe]/90 backdrop-blur-md sm:p-7'>
            <div className='flex items-center gap-3.5'>
              <span className='flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9]'>
                <Smartphone className='size-4' />
              </span>
              <h2 className='text-lg font-semibold text-white sm:text-xl'>
                {t('app.title')}
              </h2>
            </div>
            <ol className='mt-3.5 list-decimal space-y-2 pl-5 text-sm leading-relaxed marker:font-semibold marker:text-[#22d3ee] sm:ml-11 sm:text-base'>
              {appSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          {/* Option 2 — on the web (Google accounts) */}
          <MeetDeleteAccountAction />

          {/* Option 3 — by email (e.g. Sign in with Apple, or no access to the app) */}
          <section className='rounded-2xl border border-[#a5e3f4]/15 bg-[#041e29]/70 p-6 text-[#cffafe]/90 backdrop-blur-md sm:p-7'>
            <div className='flex items-center gap-3.5'>
              <span className='flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/15 text-[#67e8f9]'>
                <Mail className='size-4' />
              </span>
              <h2 className='text-lg font-semibold text-white sm:text-xl'>
                {t('email.title')}
              </h2>
            </div>
            <div className='mt-3.5 space-y-3 text-sm leading-relaxed sm:pl-11 sm:text-base'>
              <p>{t('email.body')}</p>
              <a
                href={mailto}
                className='inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-5 py-2.5 text-sm font-semibold text-[#67e8f9] hover:bg-[#22d3ee]/20'
              >
                <Mail className='size-4' />
                {email}
              </a>
            </div>
          </section>

          {/* What gets deleted */}
          <section className='rounded-[28px] border border-[#22d3ee]/25 bg-[#0891b2]/10 p-6 text-[#e4f7fb] backdrop-blur-xl sm:p-8'>
            <h2 className='text-lg font-semibold text-white'>
              {t('data.title')}
            </h2>
            <ul className='mt-4 space-y-3'>
              {deleted.map((d) => (
                <li key={d} className='flex gap-3 text-sm leading-relaxed sm:text-base'>
                  <Check className='mt-1 size-4 shrink-0 text-[#22d3ee]' />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className='mt-5 text-sm leading-relaxed text-[#a5e3f4]'>
              {t('data.retention')}
            </p>
          </section>

          <div className='text-center'>
            <Link
              href='/meet/privacy'
              className='text-sm text-[#a5e3f4] underline-offset-4 hover:underline'
            >
              {t('backToPrivacy')}
            </Link>
          </div>
        </div>
      </Container>
    </SpacePanel>
  );
}
