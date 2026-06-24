'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { useToast } from '@/components/admin/useToast';
import { createClient } from '@/lib/supabase/client';
import type { Lead } from '@/lib/types';

export default function LeadsAdmin() {
  const supabase = createClient();
  const { show, Toast } = useToast();
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setRows((data ?? []) as Lead[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(l: Lead) {
    if (!confirm('Delete this lead?')) return;
    await supabase.from('leads').delete().eq('id', l.id);
    show('Deleted');
    await load();
  }

  return (
    <AdminShell active="leads" title="Leads">
      <Toast />
      <div className="admin-card">
        <p style={{ fontSize: 14, color: 'var(--sumi-soft)' }}>
          Captured from the Packing &amp; Ferry Guide lead magnet on /learn-to-dive. Export this
          list manually for WhatsApp retargeting before the season starts.
        </p>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card">
          <p>No leads yet.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Email</th>
                <th>Source</th>
                <th>Captured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>{l.phone || '—'}</td>
                  <td>{l.email || '—'}</td>
                  <td>{l.source}</td>
                  <td>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(l)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
