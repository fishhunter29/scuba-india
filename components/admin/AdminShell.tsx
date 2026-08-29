'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Seal } from '@/components/BrandMark';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/dives', label: 'Dives' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/reefs', label: 'Reefs' },
  { href: '/admin/sections', label: 'Page Sections' },
  { href: '/admin/guides', label: 'Guides' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/photos', label: 'Photos' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminShell({
  active,
  title,
  actions,
  children,
}: {
  active: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand">
          <Seal />
          Scuba India
        </Link>
        {NAV.map((n) => {
          const isActive = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={isActive ? 'active' : ''}>
              {n.label}
            </Link>
          );
        })}
        <div className="spacer" />
        <Link href="/" target="_blank" style={{ fontSize: 13, opacity: 0.7 }}>
          View live site ↗
        </Link>
        <button className="signout" onClick={signOut}>
          Sign out
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-head">
          <h1>{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
