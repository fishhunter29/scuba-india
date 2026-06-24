'use client';

import { useState } from 'react';
import Link from 'next/link';

const GUIDE_HREF = '/guides/andaman-packing-ferry-guide-2026';

export default function LeadMagnet() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: v }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="lead-magnet reveal">
        <div className="lead-magnet-done">
          Got it — here&apos;s your guide:{' '}
          <Link href={GUIDE_HREF}>Andaman Packing &amp; Ferry Guide →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-magnet reveal">
      <div className="lead-magnet-text">
        <b>Planning a trip to Havelock?</b> Get our free Packing &amp; Ferry Guide — how to
        actually get here, and what&apos;s worth bringing.
      </div>
      <form className="lead-magnet-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Email or WhatsApp number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={status === 'sending'}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send me the guide'}
        </button>
      </form>
      {status === 'error' && (
        <div className="lead-magnet-error">Something went wrong — please try again.</div>
      )}
    </div>
  );
}
