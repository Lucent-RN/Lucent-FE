import { redirect } from '@/i18n/navigation';

/** /dashboard has no content of its own: send people to the Lucent web app. */
export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: '/dashboard/lucent', locale });
}
