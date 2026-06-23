'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Settings } from '@/lib/types';

export default function SettingsAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    setS((data as Settings) ?? null);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Settings>(k: K, v: Settings[K]) {
    setS((e) => (e ? { ...e, [k]: v } : e));
  }

  async function save() {
    if (!s) return;
    const { error } = await supabase.from('settings').upsert({ ...s, id: 1 });
    if (error) return show('Error: ' + error.message);
    show('Settings saved');
    router.refresh();
  }

  if (loading) return <AdminShell active="settings" title="Settings"><p>Loading…</p></AdminShell>;
  if (!s)
    return (
      <AdminShell active="settings" title="Settings">
        <div className="admin-card">
          <p>No settings row found. Run the seed (it inserts the singleton settings row).</p>
        </div>
      </AdminShell>
    );

  return (
    <AdminShell
      active="settings"
      title="Settings"
      actions={
        <button className="a-btn a-btn-primary" onClick={save}>
          Save changes
        </button>
      }
    >
      <Toast />
      <div className="admin-card">
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: 20, marginBottom: 16 }}>Trust &amp; numbers</h3>
        <div className="a-grid3">
          <div className="a-field">
            <label>Review count (Google)</label>
            <input
              type="number"
              value={s.review_count}
              onChange={(e) => field('review_count', Number(e.target.value))}
            />
          </div>
          <div className="a-field">
            <label>Average rating</label>
            <input
              type="number"
              step="0.1"
              value={s.rating_avg}
              onChange={(e) => field('rating_avg', Number(e.target.value))}
            />
          </div>
          <div className="a-field">
            <label>Dives guided (e.g. 5,000)</label>
            <input value={s.dives_guided} onChange={(e) => field('dives_guided', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: 20, marginBottom: 16 }}>Contact</h3>
        <div className="a-grid2">
          <div className="a-field">
            <label>Phone</label>
            <input value={s.phone} onChange={(e) => field('phone', e.target.value)} />
          </div>
          <div className="a-field">
            <label>WhatsApp number (digits only, with country code)</label>
            <input value={s.whatsapp} onChange={(e) => field('whatsapp', e.target.value)} />
          </div>
        </div>
        <div className="a-grid2">
          <div className="a-field">
            <label>Second phone number (optional, shown in footer)</label>
            <input value={s.phone2 ?? ''} onChange={(e) => field('phone2', e.target.value)} />
          </div>
          <div className="a-field">
            <label>Email</label>
            <input value={s.email} onChange={(e) => field('email', e.target.value)} />
          </div>
        </div>
        <div className="a-field">
          <label>Instagram URL</label>
          <input value={s.instagram ?? ''} onChange={(e) => field('instagram', e.target.value)} />
        </div>
        <div className="a-field">
          <label>Facebook URL</label>
          <input
            value={s.facebook ?? ''}
            placeholder="https://facebook.com/yourpage"
            onChange={(e) => field('facebook', e.target.value)}
          />
        </div>
        <div className="a-field">
          <label>Address</label>
          <input value={s.address} onChange={(e) => field('address', e.target.value)} />
        </div>
        <div className="a-field">
          <label>Google reviews URL (the “Read all reviews on Google” button)</label>
          <input
            value={s.google_url ?? ''}
            placeholder="https://g.page/r/…/review  or  https://maps.app.goo.gl/…"
            onChange={(e) => field('google_url', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 6 }}>
        <button className="a-btn a-btn-primary" onClick={save}>
          Save changes
        </button>
      </div>
    </AdminShell>
  );
}
