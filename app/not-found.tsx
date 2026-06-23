import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Page not found</h1>
      <p style={{ marginBottom: '28px', maxWidth: 420 }}>
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to home →
      </Link>
    </div>
  );
}
