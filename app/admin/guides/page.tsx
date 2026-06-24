'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/lib/types';

const EMPTY: Partial<Post> = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  cover_image_url: null,
  published: true,
  sort: 0,
};

export default function GuidesAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('published_at', { ascending: false });
    setRows((data ?? []) as Post[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Post>(k: K, v: Post[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function save() {
    if (!editing?.title) return show('Title is required');
    if (!editing?.slug) return show('Slug is required');
    if (!editing?.body) return show('Body is required');
    const payload = { ...editing };
    const { error } = payload.id
      ? await supabase.from('posts').update(payload).eq('id', payload.id)
      : await supabase.from('posts').insert(payload);
    if (error) return show('Error: ' + error.message);
    setEditing(null);
    show('Saved');
    await load();
    router.refresh();
  }

  async function remove(p: Post) {
    if (!confirm(`Delete guide "${p.title}"?`)) return;
    const { error } = await supabase.from('posts').delete().eq('id', p.id);
    if (error) return show('Error: ' + error.message);
    show('Deleted');
    await load();
    router.refresh();
  }

  return (
    <AdminShell
      active="guides"
      title="Dive Guides"
      actions={
        <button className="a-btn a-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + New guide
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
                <th>Title</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                    <br />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ash)' }}>
                      /guides/{p.slug}
                    </span>
                  </td>
                  <td>{p.published ? 'Live' : 'Draft'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => setEditing({ ...p })}>
                      Edit
                    </button>{' '}
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(p)}>
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
            <h2>{editing.id ? 'Edit guide' : 'New guide'}</h2>
            <div className="a-grid2">
              <div className="a-field">
                <label>Title</label>
                <input value={editing.title ?? ''} onChange={(e) => field('title', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Slug (URL)</label>
                <input value={editing.slug ?? ''} onChange={(e) => field('slug', e.target.value)} />
              </div>
            </div>
            <div className="a-field">
              <label>Excerpt (shown on the guides list &amp; meta description)</label>
              <textarea value={editing.excerpt ?? ''} onChange={(e) => field('excerpt', e.target.value)} />
            </div>
            <div className="a-field">
              <label>Body — blank line between paragraphs, &quot;## &quot; for a heading, &quot;- &quot; for a bullet</label>
              <textarea
                style={{ minHeight: 280, fontFamily: 'var(--mono)', fontSize: 13.5 }}
                value={editing.body ?? ''}
                onChange={(e) => field('body', e.target.value)}
              />
            </div>
            <div className="a-field">
              <label>Cover image (optional)</label>
              <input
                value={editing.cover_image_url ?? ''}
                onChange={(e) => field('cover_image_url', e.target.value || null)}
              />
              <div style={{ marginTop: 8 }}>
                <ImageUpload folder="guides" onUploaded={(url) => field('cover_image_url', url)} />
              </div>
            </div>
            <div className="a-field">
              <label>Published?</label>
              <select
                value={editing.published ? 'yes' : 'no'}
                onChange={(e) => field('published', e.target.value === 'yes')}
              >
                <option value="yes">Yes — live on the site</option>
                <option value="no">No — draft</option>
              </select>
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
