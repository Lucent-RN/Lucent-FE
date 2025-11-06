'use client';

import Container from '@/features/landing/atoms/container';
import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import {
  Search,
  HelpCircle,
  Clock,
  BarChart3,
  Shield,
  Wallet,
  Bug,
  MessageSquare,
  Rocket,
  Info
} from 'lucide-react';

// ---- Types ----
export type HelpTopicKey =
  | 'getting-started'
  | 'pomodoro'
  | 'stats'
  | 'account-billing'
  | 'troubleshooting'
  | 'privacy'
  | 'contact';

export type HelpTopic = {
  key: HelpTopicKey;
  icon: React.ComponentType<any>;
  title: string;
  blurb: string;
  faqs: { q: string; a: string }[];
  articles?: { title: string; slug: string; description?: string }[];
};

// ---- Seed content (adapt/expand freely) ----
export const HELP_TOPICS: HelpTopic[] = [
  {
    key: 'getting-started',
    icon: Rocket,
    title: 'Getting Started',
    blurb:
      'Install the app, create your first workspace, and run your first Focus session in under 2 minutes.',
    faqs: [
      {
        q: 'How do I create my first Focus (Pomodoro) session?',
        a: 'Open Lucent → tap Start Focus → pick a preset or set a custom duration (e.g., 25/5/4) → press Start. You can lock screen to minimize distractions; Lucent keeps time in the background.'
      },
      {
        q: 'Does Lucent work offline?',
        a: 'Yes. Session timing, streaks, and local statistics work fully offline. If you sign in later, Lucent syncs your data securely when back online.'
      },
      {
        q: 'How do I enable notifications?',
        a: 'On the first run we prompt for permission. To change later: System Settings → Notifications → Lucent → allow Alerts and Sounds.'
      }
    ]
  },
  {
    key: 'pomodoro',
    icon: Clock,
    title: 'Pomodoro Sessions',
    blurb:
      'Deep work timers, breaks, auto‑continue, sounds, and do‑not‑disturb integrations.',
    faqs: [
      {
        q: 'What is Auto‑Continue?',
        a: 'When enabled, Lucent automatically starts your next phase (work ↔ break) without requiring a tap. Toggle this in Settings → Sessions.'
      },
      {
        q: 'Can I pause or skip?',
        a: 'Yes. Tap Pause to temporarily stop the timer, or Skip to move to the next phase. Skipped work intervals are excluded from focus stats by default.'
      },
      {
        q: 'Why did the app stop timing when I closed it?',
        a: 'Background timing requires notification permission and battery optimization exemptions on some Android devices. Enable both in Settings. On iOS, ensure Background App Refresh is on.'
      }
    ]
  },
  {
    key: 'stats',
    icon: BarChart3,
    title: 'Statistics & Insights',
    blurb: 'Daily/weekly totals, streaks, goals, and export to CSV.',
    faqs: [
      {
        q: 'How are totals calculated?',
        a: 'Lucent sums completed work intervals (not breaks). Paused or skipped durations are excluded unless you explicitly include them in Settings → Stats.'
      },
      {
        q: 'What are Streaks?',
        a: 'A streak increases when you complete at least one work interval per day. Missing a day resets the streak. You can adjust local timezone in Settings.'
      },
      {
        q: 'Can I export my data?',
        a: 'Yes. Go to Profile → Export → choose CSV or JSON. Exports include start time, duration, label, and tags.'
      }
    ]
  },
  {
    key: 'account-billing',
    icon: Wallet,
    title: 'Account & Billing',
    blurb: 'Sign‑in, subscriptions, receipts, student discounts, and refunds.',
    faqs: [
      {
        q: 'Which sign‑in methods are supported?',
        a: 'Email magic link and OAuth (Google/Apple) are supported. You can link multiple methods to the same account in Profile → Security.'
      },
      {
        q: 'How do I manage my subscription?',
        a: 'If purchased via App Store/Play Store, manage in your store subscriptions. For web purchases, open Profile → Billing to update payment or cancel anytime.'
      },
      {
        q: 'Do you offer refunds?',
        a: 'App Store/Play Store refunds follow the store policy. For web purchases, contact us within 14 days with your receipt and reason; eligible cases are refunded to the original method.'
      }
    ]
  },
  {
    key: 'troubleshooting',
    icon: Bug,
    title: 'Troubleshooting',
    blurb:
      'Timer issues, notifications, battery settings, and platform quirks.',
    faqs: [
      {
        q: 'Notifications don’t fire on Android',
        a: 'Disable battery optimizations for Lucent and allow notifications. Steps vary by manufacturer (Samsung/Xiaomi/Vivo). We provide guided flows in Settings → Notifications.'
      },
      {
        q: 'The timer seems inaccurate',
        a: 'Rare clock drift can happen after deep sleep. Keep notifications on; Lucent uses a foreground service/alarm for accuracy. If issues persist, reinstall and re‑enable permissions.'
      },
      {
        q: 'I lost my data after reinstall',
        a: 'If you were signed in, your history will resync after login. If you were using local‑only mode, and didn’t export a backup, we can’t restore past sessions.'
      }
    ],
    articles: [
      {
        title: 'Fix Android battery optimization',
        slug: '/help/troubleshooting/android-battery'
      },
      {
        title: 'iOS Background App Refresh',
        slug: '/help/troubleshooting/ios-background'
      },
      { title: 'Report a bug', slug: '/help/troubleshooting/report' }
    ]
  },
  {
    key: 'privacy',
    icon: Shield,
    title: 'Privacy & Data',
    blurb: 'What we collect, how we store it, exports, and deletion requests.',
    faqs: [
      {
        q: 'What data do you store?',
        a: 'Only what’s required to operate Lucent: session metadata, account info, and settings. We do not sell your data. See Privacy Policy for details.'
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Profile → Privacy → Delete account. This permanently deletes your data from our servers after a short grace period. Exports are available before deletion.'
      },
      {
        q: 'Where are servers located?',
        a: 'We host in reputable regions with encryption in transit and at rest. See our Data Residency note in the Privacy Policy for specifics.'
      }
    ],
    articles: [
      { title: 'Privacy Policy', slug: '/help/legal/privacy' },
      { title: 'Terms of Use', slug: '/help/legal/terms' },
      { title: 'Data export & deletion', slug: '/help/legal/export-delete' }
    ]
  },
  {
    key: 'contact',
    icon: MessageSquare,
    title: 'Contact & Feedback',
    blurb: 'Reach the team, request features, or ask for help.',
    faqs: [
      {
        q: 'How do I contact support?',
        a: 'Email support@lucent.app or use in‑app Help → Contact. Include your platform (iOS/Android/Web), app version, and steps to reproduce if reporting a bug.'
      },
      {
        q: 'Where can I request a feature?',
        a: 'Open Help → Roadmap and submit your idea. You can upvote existing requests so we can prioritize what matters most.'
      },
      {
        q: 'Do you have a community?',
        a: 'Yes. Join our Discord to share workflows, templates, and study tips with other Lucent creators.'
      }
    ],
    articles: [
      { title: 'Roadmap & feature requests', slug: '/help/contact/roadmap' },
      { title: 'Submit a bug report', slug: '/help/contact/bug-report' }
    ]
  }
];

// ---- Page ----
const HelpPage = () => {
  const [active, setActive] = useState<HelpTopicKey>('getting-started');
  const [query, setQuery] = useState('');

  const topics = HELP_TOPICS;
  const activeTopic = useMemo(
    () => topics.find((t) => t.key === active)!,
    [topics, active]
  );

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return activeTopic.faqs;
    const q = query.toLowerCase();
    return activeTopic.faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query, activeTopic]);

  return (
    <Container className='min-h-screen pt-24 pb-20 sm:pt-28 md:pt-36 lg:pt-44'>
      {/* Header */}
      <div className='mb-10 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='manrope text-4xl font-bold md:text-5xl'
        >
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className='text-muted-foreground mx-auto mt-3 max-w-2xl text-lg'
        >
          Answers for Lucent. Browse topics, search quick fixes, and contact us
          if you’re stuck.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className='relative mx-auto mt-6 w-full max-w-xl'
        >
          <Search className='text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search help...'
            className='bg-muted text-foreground placeholder:text-muted-foreground/70 focus:ring-primary/30 w-full rounded-full px-11 py-3 text-sm outline-none focus:ring-2'
          />
        </motion.div>
      </div>

      <div className='mx-auto grid max-w-7xl gap-8 md:grid-cols-3'>
        {/* Sidebar topics */}
        <nav className='space-y-3'>
          {topics.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                active === t.key ? 'bg-primary/10 shadow-sm' : 'hover:bg-muted'
              }`}
            >
              <div className='flex items-center justify-center'>
                <t.icon className='bg-accent-foreground h-10 w-10 rounded-full object-contain p-2 text-white' />
              </div>
              <div>
                <div className='font-medium'>{t.title}</div>
                <div className='text-muted-foreground text-sm'>{t.blurb}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className='md:col-span-2'>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className='bg-card rounded-2xl p-6 shadow-md md:p-8'
          >
            <header className='mb-6 flex items-center gap-3'>
              <activeTopic.icon className='h-6 w-6' />
              <div>
                <h2 className='text-2xl font-semibold'>{activeTopic.title}</h2>
                <p className='text-muted-foreground text-sm'>
                  {activeTopic.blurb}
                </p>
              </div>
            </header>

            {/* FAQs */}
            <section>
              <h3 className='mb-3 text-lg font-semibold'>FAQs</h3>
              <div className='space-y-2'>
                {filteredFaqs.length === 0 && (
                  <div className='text-muted-foreground p-6 text-sm'>
                    <HelpCircle className='mr-2 inline h-4 w-4' />
                    No matches for that search in this section.
                  </div>
                )}
                {filteredFaqs.map((item, idx) => (
                  <Disclosure
                    key={idx}
                    q={item.q}
                    a={item.a}
                    defaultOpen={idx === 0}
                  />
                ))}
              </div>
            </section>

            {/* Articles */}
            {activeTopic.articles && (
              <section className='mt-8'>
                <h3 className='mb-3 text-lg font-semibold'>Guides</h3>
                <div className='grid gap-3 sm:grid-cols-2'>
                  {activeTopic.articles.map((a) => (
                    <ArticleCard
                      key={a.slug}
                      title={a.title}
                      href={a.slug}
                      description={a.description}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Meta */}
            <footer className='text-muted-foreground mt-8 flex items-center gap-2 text-xs'>
              <Info className='h-4 w-4' />
              Updated: November 2025
            </footer>
          </motion.div>
        </div>
      </div>
    </Container>
  );
};

export default HelpPage;

// ---- Components ----
function Disclosure({
  q,
  a,
  defaultOpen = false
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className='group/row bg-muted/30 rounded-xl p-1'>
      <button
        className='hover:bg-muted/50 flex w-full items-center justify-between gap-4 rounded-lg p-4 text-left transition-colors'
        onClick={() => setOpen((v) => !v)}
      >
        <span className='font-medium'>{q}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m6 9 6 6 6-6' />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className='text-foreground/90 px-4 pb-4 text-sm leading-6'>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArticleCard({
  title,
  href,
  description
}: {
  title: string;
  href: string;
  description?: string;
}) {
  return (
    <a
      href={href}
      className='bg-card block rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-md'
    >
      <div className='mb-1 font-medium'>{title}</div>
      {description ? (
        <p className='text-muted-foreground text-sm'>{description}</p>
      ) : (
        <p className='text-muted-foreground text-sm'>Open guide →</p>
      )}
    </a>
  );
}
