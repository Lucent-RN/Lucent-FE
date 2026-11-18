/**
 * The dashboard hosts two separate apps:
 * - Lucent (Pomodoro): /dashboard/lucent/*, works without an account (data stays in the browser).
 * - LucentMeet (calendars): /dashboard/meet/*, requires sign-in, like the LucentMeet mobile app.
 * Navigation, branding and the header follow whichever area the visitor is in.
 */
export type Product = 'lucent' | 'meet';

const MEET_PATH = /\/dashboard\/meet(\/|$)/;

/** Works with or without the locale prefix (`/en/dashboard/meet` or `/dashboard/meet`). */
export const productFromPath = (pathname: string): Product =>
  MEET_PATH.test(pathname) ? 'meet' : 'lucent';

export const PRODUCT_HOME: Record<Product, string> = {
  lucent: '/dashboard/lucent',
  meet: '/dashboard/meet'
};
