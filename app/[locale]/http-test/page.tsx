import { setRequestLocale } from 'next-intl/server';
import { HttpTestPage } from '@/src/pages/http-test';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HttpTestPage />;
}
