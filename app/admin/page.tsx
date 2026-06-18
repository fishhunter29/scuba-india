import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const revalidate = 0;

async function count(table: string, filter?: { col: string; val: string }) {
  if (!isSupabaseConfigured()) return 0;
  try {
    const supabase = createClient();
    let q = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) q = q.eq(filter.col, filter.val);
    const { count } = await q;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const [dives, courses, reviews, newBookings, photos] = await Promise.all([
    count('dives'),
    count('courses'),
    count('reviews'),
    count('bookings', { col: 'status', val: 'new' }),
    count('photos'),
  ]);

  return (
    <AdminShell active="dashboard" title="Dashboard">
      <div className="a-stat-grid">
        <div className="a-stat">
          <div className="n">{dives}</div>
          <div className="l">Dives / packages</div>
        </div>
        <div className="a-stat">
          <div className="n">{courses}</div>
          <div className="l">PADI courses</div>
        </div>
        <div className="a-stat">
          <div className="n">{reviews}</div>
          <div className="l">Reviews</div>
        </div>
        <div className="a-stat">
          <div className="n">{newBookings}</div>
          <div className="l">New enquiries</div>
        </div>
        <div className="a-stat">
          <div className="n">{photos}</div>
          <div className="l">Photos</div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: 20, marginBottom: 12 }}>Quick links</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/dives" className="a-btn a-btn-ghost">
            Manage dives
          </Link>
          <Link href="/admin/bookings" className="a-btn a-btn-ghost">
            View enquiries
          </Link>
          <Link href="/admin/reviews" className="a-btn a-btn-ghost">
            Edit reviews
          </Link>
          <Link href="/admin/settings" className="a-btn a-btn-ghost">
            Site settings
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <p style={{ color: 'var(--sumi-soft)', fontSize: 14.5 }}>
          Edits here save to Supabase and appear on the public site immediately. Upload your own
          Havelock photos under <strong>Photos</strong> to replace the placeholder art, and keep the{' '}
          <strong>Settings</strong> review count &amp; dives-guided numbers up to date — they feed
          the trust bar and Google rich results.
        </p>
      </div>
    </AdminShell>
  );
}
