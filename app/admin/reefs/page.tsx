'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Reef, DiveKind } from '@/lib/types';
import { DIVE_KINDS } from '@/lib/types';

const EMPTY: Partial<Reef> = {
  key: '',
  name: '',
  depth_m: 12,
  level: 'All levels',
  best_for: '',
  blurb: '',
  image_url: null,
  life: [],
  kinds: [],
  active: true,
  sort: 0,
};

const LEVELS = ['Beginner-friendly', 'All levels', 'Confident divers'];

function Help({ children }: { children: React.ReactNode }) {
  return <p className="a-help">{children}</p>;
}

export default function ReefsAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Reef[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Reef> | null>(null);
  const [lifeText, setLifeText] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('reefs').select('*').order('sort');
    setRows((data ?? []) as Reef[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function field<K extends keyof Reef>(k: K, v: Reef[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }
  function openEdit(r: Reef) {
    setEditing({ ...r });
    setLifeText((r.life ?? []).join(', '));
  }
  function openNew() {
    setEditing({ ...EMPTY });
    setLifeText('');
  }
  function toggleKind(k: DiveKind) {
    setEditing((e) => {
      if (!e) return e;
      const cur = (e.kinds ?? []) as DiveKind[];
      return { ...e, kinds: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] };
    });
  }

  async function save() {
    if (!editing) return;
    const payload: Partial<Reef> = {
      ...editing,
      life: lifeText.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (!payload.name) return show('Please give the reef a name.');
    if (!payload.key) payload.key = (payload.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = payload.id
      ? await supabase.from('reefs').update(payload).eq('id', payload.id)
      : await supabase.from('reefs').insert(payload);
    if (error) return show('Could not save: ' + error.message);
    setEditing(null);
    show('Saved — it’s live on the site.');
    await load();
    router.refresh();
  }

  async function remove(r: Reef) {
    if (!confirm(`Delete the reef "${r.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('reefs').delete().eq('id', r.id);
    if (error) return show('Error: ' + error.message);
    show('Deleted');
    await load();
    router.refresh();
  }

  async function toggleActive(r: Reef) {
    await supabase.from('reefs').update({ active: !r.active }).eq('id', r.id);
    await load();
    router.refresh();
  }

  return (
    <AdminShell
      active="reefs"
      title="Reefs / Dive Sites"
      actions={
        <button className="a-btn a-btn-primary" onClick={openNew}>
          + New reef
        </button>
      }
    >
      <Toast />
      <p className="a-intro">
        The reefs shown in the “Four reefs” section on the homepage and on the Reef Dives page.
        Each reef lists the kinds of dive you run there, and its prices come from those dives.
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reef</th>
                <th>Depth</th>
                <th>Level</th>
                <th>Shown?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{r.depth_m}m</td>
                  <td>{r.level}</td>
                  <td>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => toggleActive(r)}>
                      {r.active ? 'Shown' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => openEdit(r)}>
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
            <h2>{editing.id ? 'Edit reef' : 'New reef'}</h2>

            <div className="a-section-title">The basics</div>
            <div className="a-grid2">
              <div className="a-field">
                <label>Reef name</label>
                <input value={editing.name ?? ''} placeholder="e.g. Tribe Gate" onChange={(e) => field('name', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Typical max depth (m)</label>
                <input type="number" value={editing.depth_m ?? 12} onChange={(e) => field('depth_m', Number(e.target.value))} />
              </div>
            </div>

            <div className="a-grid2">
              <div className="a-field">
                <label>Who it suits</label>
                <select value={editing.level ?? 'All levels'} onChange={(e) => field('level', e.target.value)}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="a-field">
                <label>Best for</label>
                <input value={editing.best_for ?? ''} placeholder="e.g. Discover Scuba & first dives" onChange={(e) => field('best_for', e.target.value)} />
              </div>
            </div>

            <div className="a-field">
              <label>Description</label>
              <textarea value={editing.blurb ?? ''} placeholder="What this reef is like to dive." onChange={(e) => field('blurb', e.target.value)} />
            </div>

            <div className="a-field">
              <label>What you&apos;ll see</label>
              <input value={lifeText} placeholder="Clownfish, Parrotfish, Green turtles" onChange={(e) => setLifeText(e.target.value)} />
              <Help>Separate each with a comma. They show as little tags on the reef.</Help>
            </div>

            <div className="a-section-title">Which dives run here</div>
            <Help>Tick every kind of dive you run at this reef — its prices come from those dives.</Help>
            <div className="a-checks">
              {DIVE_KINDS.map((k) => (
                <label className="a-check" key={k.value}>
                  <input
                    type="checkbox"
                    checked={((editing.kinds ?? []) as DiveKind[]).includes(k.value)}
                    onChange={() => toggleKind(k.value)}
                  />
                  {k.label.replace(/ \(.*\)$/, '')}
                </label>
              ))}
            </div>

            <div className="a-section-title">Photo</div>
            <div className="a-field">
              <ImageUpload folder="reefs" onUploaded={(url) => field('image_url', url)} />
              <Help>
                {editing.image_url
                  ? 'Current photo set. Upload a new one to replace it.'
                  : 'Optional — leave blank to use the built-in reef photo.'}
              </Help>
            </div>

            <details className="a-advanced">
              <summary>Advanced options</summary>
              <div className="a-grid2" style={{ marginTop: 14 }}>
                <div className="a-field">
                  <label>Short key</label>
                  <input value={editing.key ?? ''} onChange={(e) => field('key', e.target.value)} />
                  <Help>Used to find the built-in photo (tribe, red, light, turtle).</Help>
                </div>
                <div className="a-field">
                  <label>Order on the page</label>
                  <input type="number" value={editing.sort ?? 0} onChange={(e) => field('sort', Number(e.target.value))} />
                  <Help>Lower numbers appear first.</Help>
                </div>
              </div>
            </details>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
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
