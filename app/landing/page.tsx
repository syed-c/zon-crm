import type { Metadata } from 'next';
import LandingPageContent from '@/components/landing-page-content';

export const metadata: Metadata = {
  title: 'ZON - Digital Marketing CRM | Professional SEO & Marketing Solutions',
  description: 'ZON is your comprehensive digital marketing CRM solution. Manage SEO campaigns, content marketing, social media, and client projects all in one powerful platform.',
  openGraph: {
    title: 'ZON - Digital Marketing CRM',
    description: 'Professional SEO & Marketing Solutions',
    url: 'https://www.zon.ae',
    siteName: 'ZON',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function LandingPage() {
  return <LandingPageContent />;
}