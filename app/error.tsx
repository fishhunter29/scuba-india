'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        background: 'var(--paper)',
        color: 'var(--sumi)',
      }}
    >
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Something went wrong</h1>
      <p style={{ marginBottom: '28px', maxWidth: 420 }}>
        We hit an unexpected error loading this page. Please try again, or head back home.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <a href="/" className="btn btn-ghost">
          Back to home
        </a>
      </div>
    </div>
  );
}
