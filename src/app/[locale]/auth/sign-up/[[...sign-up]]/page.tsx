import { redirect } from '@/i18n/navigation';

/** One Google button covers both sign-in and sign-up, so sign-up simply leads to sign-in. */
export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: '/auth/sign-in', locale });
}
