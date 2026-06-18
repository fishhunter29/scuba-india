'use client';

import { useCallback, useState } from 'react';

// Tiny toast for optimistic-update feedback (SPEC §6: "optimistic updates").
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2400);
  }, []);
  const Toast = () => (msg ? <div className="a-toast">{msg}</div> : null);
  return { show, Toast };
}
