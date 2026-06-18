'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Course } from '@/lib/types';

const EMPTY: Partial<Course> = {
  name: '',
  duration: '',
  depth: '',
  min_age: '',
  price: null,
  on_request: false,
  description: '',
  sort: 0,
};

export default function CoursesAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Course> | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('sort');
    setRows((data ?? []) as Course[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Course>(k: K, v: Course[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function save() {
    if (!editing?.name) return show('Name is required');
    const payload = { ...editing };
    const { error } = payload.id
      ? await supabase.from('courses').update(payload).eq('id', payload.id)
      : await supabase.from('courses').insert(payload);
    if (error) return show('Error: ' + error.message);
    setEditing(null);
    show('Saved');
    await load();
    router.refresh();
  }

  async function remove(c: Course) {
    if (!confirm(`Delete course "${c.name}"?`)) return;
    const { error } = await supabase.from('courses').delete().eq('id', c.id);
    if (error) return show('Error: ' + error.message);
    show('Deleted');
    await load();
    router.refresh();
  }

  return (
    <AdminShell
      active="courses"
      title="PADI Courses"
      actions={
        <button className="a-btn a-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + New course
        </button>
      }
    >
      <Toast />
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Duration</th>
                <th>Depth</th>
                <th>Min age</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.duration}</td>
                  <td>{c.depth}</td>
                  <td>{c.min_age}</td>
                  <td>{c.on_request ? 'On request' : c.price ? '₹' + c.price.toLocaleString('en-IN') : '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => setEditing({ ...c })}>
                      Edit
                    </button>{' '}
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(c)}>
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
            <h2>{editing.id ? 'Edit course' : 'New course'}</h2>
            <div className="a-field">
              <label>Name</label>
              <input value={editing.name ?? ''} onChange={(e) => field('name', e.target.value)} />
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Duration</label>
                <input value={editing.duration ?? ''} onChange={(e) => field('duration', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Depth</label>
                <input value={editing.depth ?? ''} onChange={(e) => field('depth', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Min age</label>
                <input value={editing.min_age ?? ''} onChange={(e) => field('min_age', e.target.value)} />
              </div>
            </div>
            <div className="a-grid2">
              <div className="a-field">
                <label>Price (₹, blank = on request)</label>
                <input
                  type="number"
                  value={editing.price ?? ''}
                  onChange={(e) => field('price', e.target.value === '' ? null : Number(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>On request?</label>
                <select
                  value={editing.on_request ? 'yes' : 'no'}
                  onChange={(e) => field('on_request', e.target.value === 'yes')}
                >
                  <option value="no">No — show price</option>
                  <option value="yes">Yes — “On request”</option>
                </select>
              </div>
            </div>
            <div className="a-field">
              <label>Description</label>
              <textarea value={editing.description ?? ''} onChange={(e) => field('description', e.target.value)} />
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
