'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
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
  image_url: null,
  kind: 'course',
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
      <p className="a-intro">
        PADI courses and course combos, shown in the Courses section and the price list. A “combo”
        is a bundle of courses at one price.
      </p>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Type</th>
                <th>Duration</th>
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
                  <td>{c.kind === 'combo' ? 'Combo' : 'Course'}</td>
                  <td>{c.duration}</td>
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
            <div className="a-grid2">
              <div className="a-field">
                <label>Name</label>
                <input value={editing.name ?? ''} placeholder="e.g. PADI Open Water Diver" onChange={(e) => field('name', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Type</label>
                <select value={editing.kind ?? 'course'} onChange={(e) => field('kind', e.target.value as 'course' | 'combo')}>
                  <option value="course">Single course</option>
                  <option value="combo">Combo (bundle of courses)</option>
                </select>
                <p className="a-help">Combos appear in their own “Course Combos” section on the price list.</p>
              </div>
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Duration</label>
                <input value={editing.duration ?? ''} placeholder="e.g. 3–4 days" onChange={(e) => field('duration', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Max depth</label>
                <input value={editing.depth ?? ''} placeholder="e.g. 18m or —" onChange={(e) => field('depth', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Minimum age</label>
                <input value={editing.min_age ?? ''} placeholder="e.g. 10 / 12" onChange={(e) => field('min_age', e.target.value)} />
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
              <label>Image URL</label>
              <input value={editing.image_url ?? ''} onChange={(e) => field('image_url', e.target.value || null)} />
              <div style={{ marginTop: 8 }}>
                <ImageUpload folder="courses" onUploaded={(url) => field('image_url', url)} />
              </div>
            </div>
            <div className="a-field">
              <label>Order on the page</label>
              <input
                type="number"
                value={editing.sort ?? 0}
                onChange={(e) => field('sort', Number(e.target.value))}
              />
              <p className="a-help">Lower numbers appear first.</p>
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
