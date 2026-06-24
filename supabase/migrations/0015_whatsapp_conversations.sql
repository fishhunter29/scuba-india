-- ============================================================================
-- whatsapp_conversations — per-phone-number state for the n8n WhatsApp
-- enquiry bot (auto-replies FAQs, hands off to a human after a threshold or
-- on request). Written only by n8n via the Supabase service_role key, which
-- bypasses RLS — no anon/authenticated policy is added on purpose, mirroring
-- the lesson from 0004 (a public write policy with no real consumer is a
-- dormant open write surface).
-- ============================================================================
create table if not exists public.whatsapp_conversations (
  phone           text primary key,           -- WhatsApp wa_id, e.g. "919876543210"
  message_count   int not null default 0,      -- bot replies sent since last handoff/reset
  handoff         boolean not null default false, -- true once a human has taken over
  last_intent     text,                         -- last matched FAQ intent, for debugging
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

alter table public.whatsapp_conversations enable row level security;
