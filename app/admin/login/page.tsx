'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Seal } from '@/components/BrandMark';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <h1>
          <Seal /> Admin
        </h1>
        <p className="sub">Sign in to manage Scuba India.</p>

        <div className="a-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="a-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p style={{ color: 'var(--vermilion-deep)', fontSize: 14, marginBottom: 14 }}>{error}</p>
        )}

        <button className="a-btn a-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
