import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

type Messages = { [key: string]: Messages | string | unknown[] };

/** Fill any string a locale does not have yet from English, so a new screen never crashes another locale. */
function withFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current &&
      typeof current === 'object' &&
      !Array.isArray(current)
        ? withFallback(current as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const english = (await import('../../messages/en.json')).default as Messages;
  const messages =
    locale === 'en'
      ? english
      : withFallback(
          english,
          (await import(`../../messages/${locale}.json`)).default as Messages
        );

  return { locale, messages };
});
