import type { Metadata } from 'next';
import { Shippori_Mincho, Hanken_Grotesk, DM_Mono } from 'next/font/google';
import './globals.css';
import './pages.css';
import Analytics from '@/components/Analytics';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

// Fonts — do NOT change (SPEC §3). Exposed as CSS vars consumed by globals.css.
const disp = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-disp',
  display: 'swap',
});
const body = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | PADI Diving in Havelock, Andaman Islands`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'PADI dive centre in Havelock, Andaman. Try dives, fun dives & certification courses at Tribe Gate, Red Pillar, Lighthouse & Turtle Beach. 4.8★ on Google.',
  keywords: [
    'scuba diving Havelock',
    'PADI course Andaman',
    'try dive Havelock price',
    'first time scuba diving Andaman',
  ],
  openGraph: {
    title: `${SITE_NAME} | PADI Diving in Havelock, Andaman`,
    description:
      'Try dives, fun dives & PADI certification in Havelock, Andaman. Free HD photos & GoPro video with every dive.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${disp.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
