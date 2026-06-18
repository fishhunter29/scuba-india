'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Dive, DiveStep, SiteKey } from '@/lib/types';

const SITE_KEYS: { v: SiteKey; l: string }[] = [
  { v: 'tribe', l: 'Tribe Gate' },
  { v: 'red', l: 'Red Pillar' },
  { v: 'light', l: 'Lighthouse' },
  { v: 'turtle', l: 'Turtle Beach' },
  { v: 'multi', l: 'Multi-site' },
];

const EMPTY: Partial<Dive> = {
  slug: '',
  name: '',
  site: '',
  site_key: 'tribe',
  depth_m: null,
  dive_min: null,
  train_min: null,
  duration_label: null,
  photos: 0,
  gopro_min: 0,
  price: null,
  on_request: false,
  tier: null,
  pitch: '',
  see_text: '',
  for_text: '',
  steps: [],
  image_url: null,
  active: true,
  sort: 0,
};

function stepsToText(steps: DiveStep[]): string {
  return (steps || []).map((s) => `${s.title} | ${s.body}`).join('\n');
}
function textToSteps(text: string): DiveStep[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split('|');
      return { title: title.trim(), body: rest.join('|').trim() };
    });
}

export default function DivesAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Dive> | null>(null);
  const [stepsText, setStepsText] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('dives').select('*').order('sort');
    setDives((data ?? []) as Dive[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNew() {
    setEditing({ ...EMPTY });
    setStepsText('');
  }
  function openEdit(d: Dive) {
    setEditing({ ...d });
    setStepsText(stepsToText(d.steps));
  }

  function field<K extends keyof Dive>(k: K, v: Dive[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }
  const numOrNull = (s: string) => (s === '' ? null : Number(s));

  async function save() {
    if (!editing) return;
    const payload: Partial<Dive> = { ...editing, steps: textToSteps(stepsText) };
    if (!payload.slug || !payload.name || !payload.site) {
      show('Slug, name and site are required');
      return;
    }
    let error;
    if (payload.id) {
      ({ error } = await supabase.from('dives').update(payload).eq('id', payload.id));
    } else {
      ({ error } = await supabase.from('dives').insert(payload));
    }
    if (error) {
      show('Error: ' + error.message);
      return;
    }
    setEditing(null);
    show('Saved');
    await load();
    router.refresh();
  }

  async function remove(d: Dive) {
    if (!confirm(`Delete "${d.name} — ${d.site}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('dives').delete().eq('id', d.id);
    if (error) return show('Error: ' + error.message);
    show('Deleted');
    await load();
    router.refresh();
  }

  async function toggleActive(d: Dive) {
    await supabase.from('dives').update({ active: !d.active }).eq('id', d.id);
    await load();
    router.refresh();
  }

  return (
    <AdminShell
      active="dives"
      title="Dives & Packages"
      actions={
        <button className="a-btn a-btn-primary" onClick={openNew}>
          + New dive
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
                <th>Name</th>
                <th>Site</th>
                <th>Depth</th>
                <th>Price</th>
                <th>Tier</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dives.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.name}</strong>
                    <br />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ash)' }}>
                      /{d.slug}
                    </span>
                  </td>
                  <td>{d.site}</td>
                  <td>{d.depth_m ? d.depth_m + 'm' : '—'}</td>
                  <td>{d.on_request ? 'On request' : d.price ? '₹' + d.price.toLocaleString('en-IN') : '—'}</td>
                  <td>{d.tier || '—'}</td>
                  <td>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => toggleActive(d)}>
                      {d.active ? 'Live' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => openEdit(d)}>
                      Edit
                    </button>{' '}
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(d)}>
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
            <h2>{editing.id ? 'Edit dive' : 'New dive'}</h2>
            <div className="a-grid2">
              <div className="a-field">
                <label>Name</label>
                <input value={editing.name ?? ''} onChange={(e) => field('name', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Slug (URL)</label>
                <input value={editing.slug ?? ''} onChange={(e) => field('slug', e.target.value)} />
              </div>
            </div>
            <div className="a-grid2">
              <div className="a-field">
                <label>Site (display name)</label>
                <input value={editing.site ?? ''} onChange={(e) => field('site', e.target.value)} />
              </div>
              <div className="a-field">
                <label>Site group (tab)</label>
                <select
                  value={editing.site_key ?? 'tribe'}
                  onChange={(e) => field('site_key', e.target.value as SiteKey)}
                >
                  {SITE_KEYS.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Depth (m)</label>
                <input
                  type="number"
                  value={editing.depth_m ?? ''}
                  onChange={(e) => field('depth_m', numOrNull(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>Dive minutes</label>
                <input
                  type="number"
                  value={editing.dive_min ?? ''}
                  onChange={(e) => field('dive_min', numOrNull(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>Training minutes</label>
                <input
                  type="number"
                  value={editing.train_min ?? ''}
                  onChange={(e) => field('train_min', numOrNull(e.target.value))}
                />
              </div>
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Photos</label>
                <input
                  type="number"
                  value={editing.photos ?? 0}
                  onChange={(e) => field('photos', Number(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>GoPro minutes</label>
                <input
                  type="number"
                  value={editing.gopro_min ?? 0}
                  onChange={(e) => field('gopro_min', Number(e.target.value))}
                />
              </div>
              <div className="a-field">
                <label>Price (₹, blank = on request)</label>
                <input
                  type="number"
                  value={editing.price ?? ''}
                  onChange={(e) => field('price', numOrNull(e.target.value))}
                />
              </div>
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Tier</label>
                <input
                  value={editing.tier ?? ''}
                  placeholder="Light / Premium / Signature…"
                  onChange={(e) => field('tier', e.target.value || null)}
                />
              </div>
              <div className="a-field">
                <label>Duration label (override)</label>
                <input
                  value={editing.duration_label ?? ''}
                  placeholder="Full day · all gear"
                  onChange={(e) => field('duration_label', e.target.value || null)}
                />
              </div>
              <div className="a-field">
                <label>Sort order</label>
                <input
                  type="number"
                  value={editing.sort ?? 0}
                  onChange={(e) => field('sort', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="a-field">
              <label>On request? (hides price)</label>
              <select
                value={editing.on_request ? 'yes' : 'no'}
                onChange={(e) => field('on_request', e.target.value === 'yes')}
              >
                <option value="no">No — show price</option>
                <option value="yes">Yes — show “On request”</option>
              </select>
            </div>
            <div className="a-field">
              <label>Pitch (one-line)</label>
              <input value={editing.pitch ?? ''} onChange={(e) => field('pitch', e.target.value)} />
            </div>
            <div className="a-field">
              <label>What you&apos;ll see</label>
              <textarea value={editing.see_text ?? ''} onChange={(e) => field('see_text', e.target.value)} />
            </div>
            <div className="a-field">
              <label>Who it&apos;s for</label>
              <textarea value={editing.for_text ?? ''} onChange={(e) => field('for_text', e.target.value)} />
            </div>
            <div className="a-field">
              <label>How it works — one step per line, as “Title | Body”</label>
              <textarea
                style={{ minHeight: 130 }}
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
              />
            </div>
            <div className="a-field">
              <label>Image URL</label>
              <input value={editing.image_url ?? ''} onChange={(e) => field('image_url', e.target.value || null)} />
              <div style={{ marginTop: 8 }}>
                <ImageUpload folder="dives" onUploaded={(url) => field('image_url', url)} />
              </div>
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
