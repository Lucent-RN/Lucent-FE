import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  images: {
    // localPatterns explicitly provided as an array to avoid runtime errors
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/assets/**'
      }
    ],

    // remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com'
        // remove port: '' — omit if not needed
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**'
      }
    ]
  },
  transpilePackages: ['geist']
};

let configWithPlugins = baseConfig;

// Conditionally enable Sentry configuration
if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  configWithPlugins = withSentryConfig(configWithPlugins, {
    org: process.env.NEXT_PUBLIC_SENTRY_ORG,
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: { enabled: true },
    tunnelRoute: '/monitoring',
    disableLogger: true,
    telemetry: false
  });
}

const withNextIntl = createNextIntlPlugin();
const nextConfig = configWithPlugins;
export default withNextIntl(nextConfig);
