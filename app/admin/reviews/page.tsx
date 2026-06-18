'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/lib/types';

const EMPTY: Partial<Review> = {
  name: '',
  country: '',
  rating: 5,
  text: '',
  featured: true,
  sort: 0,
};

export default function ReviewsAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('sort');
    setRows((data ?? []) as Review[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Review>(k: K, v: Review[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function save() {
    if (!editing?.name || !editing?.text) return show('Name and text are required');
    const payload = { ...editing };
    const { error } = payload.id
      ? await supabase.from('reviews').update(payload).eq('id', payload.id)
      : await supabase.from('reviews').insert(payload);
    if (error) return show('Error: ' + error.message);
    setEditing(null);
    show('Saved');
    await load();
    router.refresh();
  }

  async function remove(r: Review) {
    if (!confirm(`Delete review by ${r.name}?`)) return;
    const { error } = await supabase.from('reviews').delete().eq('id', r.id);
    if (error) return show('Error: ' + error.message);
    show('Deleted');
    await load();
    router.refresh();
  }

  return (
    <AdminShell
      active="reviews"
      title="Reviews"
      actions={
        <button className="a-btn a-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + New review
        </button>
      }
    >
      <Toast />
      <div className="admin-card">
        <p style={{ fontSize: 14, color: 'var(--sumi-soft)' }}>
          Featured reviews (max 3) show on the home page. Update the headline review count and
          average rating under <strong>Settings</strong> — they feed the trust bar and Google
          schema.
        </p>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Rating</th>
                <th>Text</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{r.country}</td>
                  <td>{'★'.repeat(r.rating)}</td>
                  <td style={{ maxWidth: 320, fontSize: 13 }}>{r.text}</td>
                  <td>{r.featured ? 'Yes' : 'No'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => setEditing({ ...r })}>
                      Edit
                    </button>{' '}
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(r)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="a-modal-bg" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className="a-modal">
            <h2>{editing.id ? 'Edit review' : 'New review'}</h2>
            <div className="a-grid2">
              <div className="a-field">
                <label>Name</label>
                <input value={editing.name ?? ''} onChange={(e) => field('name', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Country</label>
                <input value={editing.country ?? ''} onChange={(e) => field('country', e.target.value)} />
              </div>
            </div>
            <div className="a-grid2">
              <div className="a-field">
                <label>Rating (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editing.rating ?? 5}
                  onChange={(e) => field('rating', Number(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>Featured on home?</label>
                <select
                  value={editing.featured ? 'yes' : 'no'}
                  onChange={(e) => field('featured', e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div className="a-field">
              <label>Review text</label>
              <textarea value={editing.text ?? ''} onChange={(e) => field('text', e.target.value)} />
            </div>
            <div className="a-field">
              <label>Sort order</label>
              <input
                type="number"
                value={editing.sort ?? 0}
                onChange={(e) => field('sort', Number(e.target.value))}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button className="a-btn a-btn-primary" onClick={save}>
                Save
              </button>
              <button className="a-btn a-btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
