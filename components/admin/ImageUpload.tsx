'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Uploads to the public `media` bucket and returns the public URL via onUploaded.
export default function ImageUpload({
  onUploaded,
  folder = 'uploads',
}: {
  onUploaded: (url: string) => void;
  folder?: string;
}) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle(file: File) {
    setErr(null);
    setBusy(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    onUploaded(data.publicUrl);
    setBusy(false);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
        style={{ fontSize: 13 }}
      />
      {busy && <span style={{ fontSize: 12, color: 'var(--ash)', marginLeft: 8 }}>Uploading…</span>}
      {err && <span style={{ fontSize: 12, color: 'var(--vermilion-deep)', marginLeft: 8 }}>{err}</span>}
    </div>
  );
}
