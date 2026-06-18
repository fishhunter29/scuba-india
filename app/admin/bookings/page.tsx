'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Booking, BookingStatus, Dive } from '@/lib/types';

const STATUSES: BookingStatus[] = ['new', 'contacted', 'confirmed', 'done'];

const EMPTY: Partial<Booking> = {
  name: '',
  contact: '',
  people: 1,
  date: null,
  status: 'new',
  notes: '',
  dive_id: null,
};

export default function BookingsAdmin() {
  const supabase = createClient();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Booking[]>([]);
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Booking> | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: b }, { data: d }] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('dives').select('*').order('sort'),
    ]);
    setRows((b ?? []) as Booking[]);
    setDives((d ?? []) as Dive[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const diveName = (id: string | null) => dives.find((d) => d.id === id)?.name ?? '—';

  async function setStatus(b: Booking, status: BookingStatus) {
    await supabase.from('bookings').update({ status }).eq('id', b.id);
    setRows((r) => r.map((x) => (x.id === b.id ? { ...x, status } : x)));
    show('Updated');
  }

  function field<K extends keyof Booking>(k: K, v: Booking[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function save() {
    if (!editing) return;
    const payload = { ...editing };
    const { error } = payload.id
      ? await supabase.from('bookings').update(payload).eq('id', payload.id)
      : await supabase.from('bookings').insert(payload);
    if (error) return show('Error: ' + error.message);
    setEditing(null);
    show('Saved');
    await load();
  }

  async function remove(b: Booking) {
    if (!confirm('Delete this enquiry?')) return;
    await supabase.from('bookings').delete().eq('id', b.id);
    show('Deleted');
    await load();
  }

  return (
    <AdminShell
      active="bookings"
      title="Bookings & Enquiries"
      actions={
        <button className="a-btn a-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + Log enquiry
        </button>
      }
    >
      <Toast />
      <div className="admin-card">
        <p style={{ fontSize: 14, color: 'var(--sumi-soft)' }}>
          Bookings come in via WhatsApp — log them here to track each one. Public enquiry forms (if
          added) also land in this table.
        </p>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card">
          <p>No enquiries yet.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Dive</th>
                <th>People</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td>{b.name || '—'}</td>
                  <td>{b.contact || '—'}</td>
                  <td>{diveName(b.dive_id)}</td>
                  <td>{b.people ?? '—'}</td>
                  <td>{b.date || '—'}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b, e.target.value as BookingStatus)}
                      style={{ fontSize: 13, padding: '6px 8px' }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ maxWidth: 220, fontSize: 13 }}>{b.notes}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => setEditing({ ...b })}>
                      Edit
                    </button>{' '}
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(b)}>
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
            <h2>{editing.id ? 'Edit enquiry' : 'Log enquiry'}</h2>
            <div className="a-grid2">
              <div className="a-field">
                <label>Name</label>
                <input value={editing.name ?? ''} onChange={(e) => field('name', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Contact (phone / email)</label>
                <input value={editing.contact ?? ''} onChange={(e) => field('contact', e.target.value)} />
              </div>
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Dive</label>
                <select value={editing.dive_id ?? ''} onChange={(e) => field('dive_id', e.target.value || null)}>
                  <option value="">— none —</option>
                  {dives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.site}
                    </option>
                  ))}
                </select>
              </div>
              <div className="a-field">
                <label>People</label>
                <input
                  type="number"
                  value={editing.people ?? 1}
                  onChange={(e) => field('people', Number(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>Date</label>
                <input type="date" value={editing.date ?? ''} onChange={(e) => field('date', e.target.value || null)} />
              </div>
            </div>
            <div className="a-field">
              <label>Status</label>
              <select value={editing.status ?? 'new'} onChange={(e) => field('status', e.target.value as BookingStatus)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label>Notes</label>
              <textarea value={editing.notes ?? ''} onChange={(e) => field('notes', e.target.value)} />
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
