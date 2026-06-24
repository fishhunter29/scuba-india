import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Public lead-capture endpoint for the Packing & Ferry Guide lead magnet.
// Keeps @supabase/ssr out of the client bundle on /learn-to-dive — the form
// just POSTs here instead of importing a Supabase client in the browser.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const value = typeof body?.value === 'string' ? body.value.trim() : '';
  if (!value || value.length > 200) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
  }

  const isEmail = value.includes('@');
  const supabase = createClient();
  const { error } = await supabase.from('leads').insert({
    phone: isEmail ? null : value,
    email: isEmail ? value : null,
    source: 'ferry_packing_guide',
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
