import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  localePrefix: 'always',
  locales: ['en', 'vi'],
  defaultLocale: 'en'
});
