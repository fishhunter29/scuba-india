'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Photo } from '@/lib/types';

const CATEGORIES = ['hero', 'dive', 'site', 'gallery'];

export default function PhotosAdmin() {
  const supabase = createClient();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUrl, setPendingUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState('gallery');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    setRows((data ?? []) as Photo[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    if (!pendingUrl) return show('Upload an image first');
    const { error } = await supabase.from('photos').insert({ url: pendingUrl, alt, category });
    if (error) return show('Error: ' + error.message);
    setPendingUrl('');
    setAlt('');
    show('Photo added');
    await load();
  }

  async function remove(p: Photo) {
    if (!confirm('Delete this photo?')) return;
    await supabase.from('photos').delete().eq('id', p.id);
    show('Deleted');
    await load();
  }

  return (
    <AdminShell active="photos" title="Photos">
      <Toast />
      <div className="admin-card">
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: 20, marginBottom: 12 }}>Upload a photo</h3>
        <p style={{ fontSize: 14, color: 'var(--sumi-soft)', marginBottom: 16 }}>
          Upload your own Havelock photos to replace the placeholder art across the site. Files go to
          Supabase Storage (public <code>media</code> bucket).
        </p>
        <ImageUpload folder="gallery" onUploaded={(url) => setPendingUrl(url)} />
        {pendingUrl && (
          <div style={{ marginTop: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pendingUrl} alt="preview" className="a-thumb" style={{ width: 120, height: 90 }} />
            <div className="a-grid2" style={{ marginTop: 12 }}>
              <div className="a-field">
                <label>Alt text</label>
                <input value={alt} onChange={(e) => setAlt(e.target.value)} />
              </div>
              <div className="a-field">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="a-btn a-btn-primary" onClick={add}>
              Save photo
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card">
          <p>No photos uploaded yet.</p>
        </div>
      ) : (
        <div className="admin-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
            {rows.map((p) => (
              <div key={p.id} style={{ border: '1px solid rgba(18,58,71,.12)', borderRadius: 10, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt ?? ''} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                <div style={{ padding: 10 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ash)' }}>{p.category}</div>
                  <div style={{ fontSize: 13, margin: '4px 0 8px' }}>{p.alt || '—'}</div>
                  <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(p)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
