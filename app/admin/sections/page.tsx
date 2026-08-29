'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Section, SectionItem } from '@/lib/types';

// Which fields actually matter for each section, so the form only shows what
// that section really uses.
const SHAPE: Record<string, { sub?: string; items?: string; hint: string }> = {
  why: { items: 'Reasons', hint: 'The three reasons shown under “Why Scuba India” on the homepage.' },
  team: { sub: 'Intro paragraph', hint: 'The “Meet the crew” block on the homepage. Photos are managed under Photos.' },
  final_cta: { sub: 'Sub-line', hint: 'The big closing call-to-action at the bottom of every page. The last word of the title is highlighted.' },
  reefs: { sub: 'Intro paragraph', hint: 'The heading above the four reefs on the homepage. The reefs themselves are under Reefs.' },
  gallery: { sub: 'Intro paragraph', hint: 'The heading above the photo gallery on the homepage.' },
};

export default function SectionsAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Section | null>(null);
  const [items, setItems] = useState<SectionItem[]>([]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('sections').select('*').order('sort');
    setRows((data ?? []) as Section[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function open(s: Section) {
    setEditing({ ...s });
    setItems(Array.isArray(s.items) ? s.items : []);
  }
  function field<K extends keyof Section>(k: K, v: Section[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }
  const setItem = (i: number, k: keyof SectionItem, v: string) =>
    setItems((s) => s.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  const addItem = () => setItems((s) => [...s, { title: '', body: '' }]);
  const removeItem = (i: number) => setItems((s) => s.filter((_, idx) => idx !== i));

  async function save() {
    if (!editing) return;
    const { error } = await supabase
      .from('sections')
      .update({
        eyebrow: editing.eyebrow,
        title: editing.title,
        subtitle: editing.subtitle,
        body: editing.body,
        items,
        active: editing.active,
      })
      .eq('id', editing.id);
    if (error) return show('Could not save: ' + error.message);
    setEditing(null);
    show('Saved — it’s live on the site.');
    await load();
    router.refresh();
  }

  const shape = editing ? SHAPE[editing.key] ?? { hint: '' } : null;

  return (
    <AdminShell active="sections" title="Page Sections">
      <Toast />
      <p className="a-intro">
        The wording of each section on the website. Edit the text here and it updates on the live
        site within a minute — no developer needed. Dives, courses, reefs, reviews and photos have
        their own screens.
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: 'var(--sumi-soft)' }}>
            No editable sections yet — run migration <code>0019_editable_sections.sql</code> in
            Supabase to create them. Until then the site shows its built-in wording.
          </p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Heading</th>
                <th>Shown?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.label}</strong>
                  </td>
                  <td>{s.title}</td>
                  <td>
                    <button
                      className="a-btn a-btn-sm a-btn-ghost"
                      onClick={async () => {
                        await supabase.from('sections').update({ active: !s.active }).eq('id', s.id);
                        await load();
                        router.refresh();
                      }}
                    >
                      {s.active ? 'Shown' : 'Hidden'}
                    </button>
                  </td>
                  <td>
                    <button className="a-btn a-btn-sm a-btn-ghost" onClick={() => open(s)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && shape && (
        <div className="a-modal-bg" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className="a-modal">
            <h2>{editing.label}</h2>
            <p className="a-help" style={{ marginBottom: 18 }}>{shape.hint}</p>

            <div className="a-field">
              <label>Small label above the heading</label>
              <input value={editing.eyebrow ?? ''} onChange={(e) => field('eyebrow', e.target.value)} />
            </div>
            <div className="a-field">
              <label>Heading</label>
              <input value={editing.title ?? ''} onChange={(e) => field('title', e.target.value)} />
            </div>
            {shape.sub && (
              <div className="a-field">
                <label>{shape.sub}</label>
                <textarea value={editing.subtitle ?? ''} onChange={(e) => field('subtitle', e.target.value)} />
              </div>
            )}

            {shape.items && (
              <>
                <div className="a-section-title">{shape.items}</div>
                <div className="a-steps">
                  {items.map((it, i) => (
                    <div className="a-step-row" key={i}>
                      <span className="a-step-n">{i + 1}</span>
                      <input
                        className="a-step-title"
                        value={it.title}
                        placeholder="Title"
                        onChange={(e) => setItem(i, 'title', e.target.value)}
                      />
                      <input
                        className="a-step-body"
                        value={it.body}
                        placeholder="Description"
                        onChange={(e) => setItem(i, 'body', e.target.value)}
                      />
                      <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => removeItem(i)}>
                        ✕
                      </button>
                    </div>
                  ))}
                  <button type="button" className="a-btn a-btn-sm a-btn-ghost" onClick={addItem}>
                    + Add
                  </button>
                </div>
              </>
            )}

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
