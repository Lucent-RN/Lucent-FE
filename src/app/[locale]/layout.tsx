import Providers from '@/components/layout/providers';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AppDownloadBanner from '@/features/landing/atoms/app-download-banner';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { poppins } from './fonts';
import './globals.css';
import './theme.css';
// Intl provider is handled in app/[locale]/layout

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Lucent',
  description: 'Pomodoro Timer App',
  icons: {
    icon: '/assets/app-icon.png',
    shortcut: '/assets/app-icon.png',
    apple: '/assets/app-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={poppins.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
        <meta name='apple-itunes-app' content='app-id=6754592413' />
      </head>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          poppins.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextTopLoader showSpinner={false} />
          <NuqsAdapter>
            <ThemeProvider
              attribute='class'
              defaultTheme='light'
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              <Providers activeThemeValue={activeThemeValue as string}>
                <Toaster />
                <AppDownloadBanner />
                {children}
              </Providers>
            </ThemeProvider>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
