'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import { courseSlug } from '@/lib/format';
import type { Dive, DiveStep, DiveKind, SiteKey } from '@/lib/types';
import { DIVE_KINDS } from '@/lib/types';

const SITE_KEYS: { v: SiteKey; l: string }[] = [
  { v: 'multi', l: 'Any reef / multi-site (most common)' },
  { v: 'tribe', l: 'Tribe Gate' },
  { v: 'red', l: 'Red Pillar' },
  { v: 'light', l: 'Lighthouse' },
  { v: 'turtle', l: 'Turtle Beach' },
];

const EMPTY: Partial<Dive> = {
  slug: '',
  name: '',
  site: 'Havelock',
  site_key: 'multi',
  category: 'discover',
  featured: false,
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

function Help({ children }: { children: React.ReactNode }) {
  return <p className="a-help">{children}</p>;
}

export default function DivesAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Dive> | null>(null);
  const [steps, setSteps] = useState<DiveStep[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);

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
    setSteps([]);
    setSlugTouched(false);
  }
  function openEdit(d: Dive) {
    setEditing({ ...d });
    setSteps(d.steps ?? []);
    setSlugTouched(true); // existing dives keep their slug
  }

  function field<K extends keyof Dive>(k: K, v: Dive[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  // Typing the name auto-fills the URL slug until the user edits the slug by hand.
  function onName(v: string) {
    setEditing((e) => {
      if (!e) return e;
      const next = { ...e, name: v };
      if (!slugTouched) next.slug = courseSlug(v);
      return next;
    });
  }

  const numOrNull = (s: string) => (s === '' ? null : Number(s));

  async function save() {
    if (!editing) return;
    const payload: Partial<Dive> = { ...editing, steps };
    if (!payload.slug) payload.slug = courseSlug(payload.name ?? '');
    if (!payload.name) return show('Please give the dive a name.');
    if (!payload.site) payload.site = 'Havelock';
    let error;
    if (payload.id) {
      ({ error } = await supabase.from('dives').update(payload).eq('id', payload.id));
    } else {
      ({ error } = await supabase.from('dives').insert(payload));
    }
    if (error) return show('Could not save: ' + error.message);
    setEditing(null);
    show('Saved — it’s live on the site.');
    await load();
    router.refresh();
  }

  async function remove(d: Dive) {
    if (!confirm(`Delete "${d.name}"? This cannot be undone.`)) return;
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

  // steps row helpers
  const addStep = () => setSteps((s) => [...s, { title: '', body: '' }]);
  const setStep = (i: number, k: keyof DiveStep, v: string) =>
    setSteps((s) => s.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i));

  const kindLabel = (c: string | null) =>
    DIVE_KINDS.find((k) => k.value === c)?.label.replace(/ \(.*\)$/, '').replace(/ —.*$/, '') ?? '—';

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
      <p className="a-intro">
        These are every dive, snorkelling trip and boat charter shown on the site. Add or edit one
        below — it appears on the homepage, the price list and its own page straight away.
      </p>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Homepage</th>
                <th>Shown?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dives.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.name}</strong>
                  </td>
                  <td>{kindLabel(d.category)}</td>
                  <td>{d.on_request ? 'On request' : d.price ? '₹' + d.price.toLocaleString('en-IN') : '—'}</td>
                  <td>{d.featured ? '★ Featured' : '—'}</td>
                  <td>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => toggleActive(d)}>
                      {d.active ? 'Shown' : 'Hidden'}
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

            {/* ---- The basics ---- */}
            <div className="a-section-title">The basics</div>
            <div className="a-field">
              <label>Name</label>
              <input
                value={editing.name ?? ''}
                placeholder="e.g. 30-Min Discover Scuba Dive"
                onChange={(e) => onName(e.target.value)}
              />
              <Help>The title shown everywhere on the site.</Help>
            </div>

            <div className="a-field">
              <label>What kind of dive is this?</label>
              <select
                value={editing.category ?? 'discover'}
                onChange={(e) => field('category', e.target.value as DiveKind)}
              >
                {DIVE_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              <Help>{DIVE_KINDS.find((k) => k.value === (editing.category ?? 'discover'))?.help}</Help>
            </div>

            <div className="a-grid2">
              <div className="a-field">
                <label>Price (₹ per person)</label>
                <input
                  type="number"
                  value={editing.price ?? ''}
                  placeholder="e.g. 3800"
                  disabled={!!editing.on_request}
                  onChange={(e) => field('price', numOrNull(e.target.value))}
                />
                <Help>Leave blank or tick “price on request” below if there’s no fixed price.</Help>
              </div>
              <div className="a-field">
                <label>Feature on the homepage?</label>
                <select
                  value={editing.featured ? 'yes' : 'no'}
                  onChange={(e) => field('featured', e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes — show in “Most booked”</option>
                </select>
                <Help>Ticked dives fill the homepage “Our most popular dives” row (up to 4).</Help>
              </div>
              <div className="a-field">
                <label>Price on request?</label>
                <select
                  value={editing.on_request ? 'yes' : 'no'}
                  onChange={(e) => field('on_request', e.target.value === 'yes')}
                >
                  <option value="no">No — show the price above</option>
                  <option value="yes">Yes — show “On request” instead</option>
                </select>
                <Help>Use this for tailored trips like island hopping.</Help>
              </div>
            </div>

            {/* ---- What's included ---- */}
            <div className="a-section-title">What’s included &amp; how long</div>
            <div className="a-grid3">
              <div className="a-field">
                <label>Minutes underwater</label>
                <input type="number" value={editing.dive_min ?? ''} placeholder="e.g. 30" onChange={(e) => field('dive_min', numOrNull(e.target.value))} />
              </div>
              <div className="a-field">
                <label>HD photos</label>
                <input type="number" value={editing.photos ?? 0} onChange={(e) => field('photos', Number(e.target.value))} />
              </div>
              <div className="a-field">
                <label>GoPro video (min)</label>
                <input type="number" value={editing.gopro_min ?? 0} onChange={(e) => field('gopro_min', Number(e.target.value))} />
              </div>
            </div>
            <Help>Set photos / video to 0 for snorkelling, charters and island hopping.</Help>

            {/* ---- Words on the page ---- */}
            <div className="a-section-title">Words shown on the page</div>
            <div className="a-field">
              <label>One-line summary</label>
              <input value={editing.pitch ?? ''} placeholder="A short, tempting one-liner." onChange={(e) => field('pitch', e.target.value)} />
              <Help>The big line at the top of the dive’s own page.</Help>
            </div>
            <div className="a-field">
              <label>What you’ll see</label>
              <textarea value={editing.see_text ?? ''} placeholder="The coral, fish and marine life on this dive." onChange={(e) => field('see_text', e.target.value)} />
            </div>
            <div className="a-field">
              <label>Who it’s for</label>
              <textarea value={editing.for_text ?? ''} placeholder="Beginners? Certified divers? Families?" onChange={(e) => field('for_text', e.target.value)} />
            </div>

            {/* ---- How it works ---- */}
            <div className="a-section-title">How it works — the day, step by step</div>
            <Help>Each step is a small titled card on the dive’s page. Add as many as you like.</Help>
            <div className="a-steps">
              {steps.map((s, i) => (
                <div className="a-step-row" key={i}>
                  <span className="a-step-n">{i + 1}</span>
                  <input
                    className="a-step-title"
                    value={s.title}
                    placeholder="Step title (e.g. Gear up)"
                    onChange={(e) => setStep(i, 'title', e.target.value)}
                  />
                  <input
                    className="a-step-body"
                    value={s.body}
                    placeholder="What happens in this step"
                    onChange={(e) => setStep(i, 'body', e.target.value)}
                  />
                  <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => removeStep(i)}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="a-btn a-btn-sm a-btn-ghost" onClick={addStep}>
                + Add a step
              </button>
            </div>

            {/* ---- Photo ---- */}
            <div className="a-section-title">Photo</div>
            <div className="a-field">
              <ImageUpload folder="dives" onUploaded={(url) => field('image_url', url)} />
              {editing.image_url ? <Help>Current image set. Upload a new one to replace it.</Help> : <Help>Optional — a hero photo for this dive’s page.</Help>}
            </div>

            {/* ---- Advanced ---- */}
            <details className="a-advanced">
              <summary>Advanced options (most people can skip these)</summary>
              <div className="a-grid2" style={{ marginTop: 14 }}>
                <div className="a-field">
                  <label>Page link (URL slug)</label>
                  <input
                    value={editing.slug ?? ''}
                    onChange={(e) => {
                      setSlugTouched(true);
                      field('slug', e.target.value);
                    }}
                  />
                  <Help>Auto-filled from the name. Only change if you know what a URL slug is.</Help>
                </div>
                <div className="a-field">
                  <label>Order on the page</label>
                  <input type="number" value={editing.sort ?? 0} onChange={(e) => field('sort', Number(e.target.value))} />
                  <Help>Lower numbers appear first.</Help>
                </div>
              </div>
              <div className="a-grid3">
                <div className="a-field">
                  <label>Depth (m)</label>
                  <input type="number" value={editing.depth_m ?? ''} onChange={(e) => field('depth_m', numOrNull(e.target.value))} />
                </div>
                <div className="a-field">
                  <label>Training minutes</label>
                  <input type="number" value={editing.train_min ?? ''} onChange={(e) => field('train_min', numOrNull(e.target.value))} />
                </div>
                <div className="a-field">
                  <label>Badge (optional)</label>
                  <input value={editing.tier ?? ''} placeholder="e.g. Certified, Premium" onChange={(e) => field('tier', e.target.value || null)} />
                </div>
              </div>
              <div className="a-grid2">
                <div className="a-field">
                  <label>Reef / site</label>
                  <select value={editing.site_key ?? 'multi'} onChange={(e) => field('site_key', e.target.value as SiteKey)}>
                    {SITE_KEYS.map((s) => (
                      <option key={s.v} value={s.v}>
                        {s.l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="a-field">
                  <label>Duration label (override)</label>
                  <input value={editing.duration_label ?? ''} placeholder="e.g. Full day · all gear" onChange={(e) => field('duration_label', e.target.value || null)} />
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
