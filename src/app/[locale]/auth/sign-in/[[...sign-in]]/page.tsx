import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/pages/sign-in-page';

export const metadata: Metadata = {
  title: 'Sign in · Lucent',
  description: 'Sign in to Lucent'
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <SignInViewPage error={error} />;
}
