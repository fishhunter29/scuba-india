# WhatsApp enquiry bot (n8n)

Auto-replies to common questions on WhatsApp, hands off to a human once a
conversation needs a real person. Lives entirely in n8n + Supabase — nothing
in this Next.js app needs to change for it to work.

## Why a build guide instead of an importable workflow file

n8n's native node parameter names shift between versions (WhatsApp Cloud
node, Supabase node), and there's no n8n instance or live WhatsApp Cloud API
credential in this environment to test an exported workflow JSON against.
Shipping a `.json` that *looks* importable but silently breaks on your
version would be worse than a precise build guide. The one piece that's
guaranteed correct — `intent-logic.js` — is plain JavaScript with zero
n8n-version dependence; paste it into a Code node as-is.

## Prerequisites (all manual, outside this repo)

1. Meta Business Manager account, verified.
2. A Meta App with the WhatsApp product added, a verified business phone
   number, and a **permanent** access token (System User in Business
   Settings — temporary tokens expire in 24h).
3. An n8n instance (n8n Cloud, or self-hosted with a public HTTPS URL —
   Meta's webhook needs to reach it).
4. This repo's migration `supabase/migrations/0015_whatsapp_conversations.sql`
   applied (run `supabase db push` or apply it via the Supabase dashboard SQL
   editor) — it adds the `whatsapp_conversations` table this workflow reads
   and writes. It has RLS enabled with **no** anon/authenticated policy on
   purpose; n8n must use the Supabase **service_role** key (Project Settings
   → API), not the anon key, to read/write it.

## Workflow — node by node

1. **WhatsApp Trigger** — subscribe to the `messages` field. Configure the
   webhook URL it gives you in Meta's App dashboard → WhatsApp → Configuration.

2. **Edit Fields (Set)** — pull out of the trigger payload:
   - `phone` = the sender's `wa_id`
   - `text` = the message body

3. **Supabase — Get All** (`whatsapp_conversations`, filter `phone = {{$json.phone}}`,
   limit 1) → gives you the existing conversation row, or an empty array if new.

4. **Supabase — Get All** (`settings`, no filter, limit 1) — same table the
   website reads from (`lib/data.ts` → `getSettings`).

5. **Supabase — Get All** (`courses`, filter `on_request = false` not required,
   just fetch all — same table as `lib/data.ts` → `getCourses`).

6. **Supabase — Get All** (`dives`, filter `train_min` is not null and
   `active = true`, sort by `price` ascending, limit 1) — this is the
   cheapest "try dive" entry point, same logic `app/page.tsx` uses for the
   hero's price hook.

7. **Merge** (or just reference each prior node's output by name in
   expressions) — combine steps 2–6 into one item shaped like:
   ```
   { phone, text, conversation: <row or null>, settings: <row>,
     courses: <array>, tryDive: <row or null> }
   ```

8. **Code node** — paste the entire body of `intent-logic.js` from this
   folder. Run mode: "Run Once for Each Item". It returns
   `{ reply, newMessageCount, newHandoff, lastIntent, notifyStaff }`.

9. **IF — reply is not null** → only send a WhatsApp message if the bot
   actually has something to say (it stays silent once handed off).

10. **WhatsApp — Send Message** (true branch of step 9) — recipient
    `{{$json.phone}}`, body `{{$json.reply}}`.

11. **Supabase — Upsert** (`whatsapp_conversations`, match on `phone`) — write
    back `message_count = newMessageCount`, `handoff = newHandoff`,
    `last_intent = lastIntent`, `last_message_at = now`.

12. **IF — notifyStaff is true** → **WhatsApp — Send Message** to your own
    business number (`settings.whatsapp` from step 4), body something like
    `New WhatsApp enquiry needs you: {{$json.phone}} — "{{$json.text}}"`.
    This is the actual "hand-off" — no separate alerting channel needed,
    it just messages your own number so you see it where you already work.

## Handoff logic (implemented in `intent-logic.js`)

- Explicit keywords (`agent`, `human`, `book`, `pay`, `refund`, `complaint`,
  etc.) → immediate handoff. Booking and money always go to a person.
- 3 bot replies to the same phone number without resolving → handoff.
- Anything the bot can't match to a known intent → handoff (never guesses
  or invents an answer — matches this project's no-fabrication rule).
- Once handed off, the bot stays silent on that number until either a human
  resets it (`update whatsapp_conversations set handoff=false where phone=...`)
  or 12 hours of silence pass, which treats the next message as a fresh
  conversation.

## What it answers vs. what it hands off

| Auto-replied (real data, live from Supabase) | Always handed off |
|---|---|
| Greeting | Booking / payment / deposit |
| Pricing (try dive + cheapest course, pulled live) | "agent" / "human" / "call me" |
| Course list | Complaints / refunds / cancellations |
| Try-dive details | Anything unmatched |
| Location/address | — |
| Photos/GoPro inclusion | — |

No fixed "opening hours" intent — there's no `hours` field in the `settings`
table, so making one up would be exactly the kind of fabricated fact this
project avoids. That question is handed off too.
