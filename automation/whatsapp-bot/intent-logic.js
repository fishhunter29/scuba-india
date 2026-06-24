// n8n Code node — drop this whole file's body into a "Code" node (Run Once for Each Item).
// Pure JS, no native-node parameter guessing involved — this is the one part of the
// workflow guaranteed correct without a live n8n instance to test against.
//
// Expects, on the incoming item ($json):
//   phone            — WhatsApp wa_id of the sender (string)
//   text             — the message body, raw (string)
//   conversation     — current row from whatsapp_conversations, or null if new:
//                       { message_count, handoff, last_message_at }
//   settings         — single row from the `settings` table (address, whatsapp, etc.)
//   courses          — array of rows from the `courses` table (name, price, on_request)
//   tryDive          — cheapest active dive with train_min set (the "try dive" entry point):
//                       { name, site, price, on_request }
//
// Returns one item with:
//   reply            — string to send back, or null (no auto-reply — human territory)
//   newMessageCount, newHandoff, lastIntent — values to persist back to whatsapp_conversations
//   notifyStaff      — true if the dive centre's own number should get an internal alert

const MAX_BOT_REPLIES = 3;
const STALE_AFTER_MS = 12 * 60 * 60 * 1000; // 12h of silence = treat as a fresh conversation

const HANDOFF_KEYWORDS = [
  'agent', 'human', 'real person', 'manager', 'owner', 'call me', 'speak to', 'talk to someone',
  'book', 'booking', 'pay', 'payment', 'confirm', 'deposit', 'reserve',
  'complaint', 'refund', 'cancel', 'problem', 'issue', 'unhappy', 'angry',
];

const INTENTS = [
  {
    name: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
    reply: () =>
      "Hi! 👋 Welcome to Scuba India, Havelock. Ask me about pricing, our PADI courses, " +
      "try dives, or location — or just say \"agent\" anytime to talk to our team directly.",
  },
  {
    name: 'pricing',
    keywords: ['price', 'cost', 'how much', 'fees', 'fee', 'charges'],
    reply: (ctx) => {
      const tryLine = ctx.tryDive?.on_request
        ? 'Try Dive pricing is on request —'
        : ctx.tryDive?.price
          ? `Try Dive starts from ₹${ctx.tryDive.price} (at ${ctx.tryDive.site}) —`
          : '';
      const cheapestCourse = ctx.courses
        ?.filter((c) => !c.on_request && c.price != null)
        .sort((a, b) => a.price - b.price)[0];
      const courseLine = cheapestCourse
        ? `PADI courses start from ₹${cheapestCourse.price} (${cheapestCourse.name}).`
        : 'PADI course pricing depends on the certification level.';
      return `${tryLine} ${courseLine} Want details on a specific dive or course? Tell me which one.`.trim();
    },
  },
  {
    name: 'courses',
    keywords: ['course', 'certification', 'certify', 'padi', 'learn to dive', 'learn diving'],
    reply: (ctx) => {
      const names = (ctx.courses ?? []).map((c) => c.name).join(', ');
      return names
        ? `We offer: ${names}. Say a course name and our team can share full details and upcoming dates.`
        : 'We run PADI certification courses for all levels — say "agent" and our team will share full details.';
    },
  },
  {
    name: 'try_dive',
    keywords: ['try dive', 'beginner', 'first time', 'non swimmer', 'never dived', 'no experience'],
    reply: (ctx) => {
      const price = ctx.tryDive?.on_request
        ? 'on request'
        : ctx.tryDive?.price
          ? `from ₹${ctx.tryDive.price}`
          : 'available';
      return (
        `No experience needed — a PADI instructor is with you the whole dive, ${price}` +
        `${ctx.tryDive?.site ? ` at ${ctx.tryDive.site}` : ''}. Free HD photos & GoPro video included. ` +
        `Say "agent" and our team will check availability for you.`
      );
    },
  },
  {
    name: 'location',
    keywords: ['where', 'location', 'address', 'havelock', 'directions', 'map'],
    reply: (ctx) =>
      ctx.settings?.address
        ? `We're at: ${ctx.settings.address}${ctx.settings.address_map_url ? ` (${ctx.settings.address_map_url})` : ''}.`
        : "We're based on Havelock (Swaraj Dweep) Island, Andaman — say \"agent\" for exact directions.",
  },
  {
    name: 'photos',
    keywords: ['photo', 'photos', 'video', 'gopro', 'pictures'],
    reply: () =>
      'Every dive includes free HD photos and GoPro video, no extra charge — you keep them all.',
  },
];

function matchKeyword(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

function run(item) {
  const now = Date.now();
  const text = String(item.text || '').toLowerCase().trim();
  const convo = item.conversation || { message_count: 0, handoff: false, last_message_at: null };

  const isStale =
    convo.last_message_at && now - new Date(convo.last_message_at).getTime() > STALE_AFTER_MS;
  let messageCount = isStale ? 0 : convo.message_count || 0;
  let handoff = isStale ? false : !!convo.handoff;

  // A human already owns this conversation — bot stays silent, just touch the timestamp.
  if (handoff) {
    return { reply: null, newMessageCount: messageCount, newHandoff: true, lastIntent: 'handoff_active', notifyStaff: false };
  }

  // Explicit ask for a human, or anything booking/money/complaint-shaped — always a human's job.
  if (matchKeyword(text, HANDOFF_KEYWORDS)) {
    return {
      reply: "Got it — connecting you with our team now, they'll reply shortly!",
      newMessageCount: messageCount,
      newHandoff: true,
      lastIntent: 'handoff_keyword',
      notifyStaff: true,
    };
  }

  // Already used up the bot's allowance for this conversation — hand off instead of a 4th canned reply.
  if (messageCount >= MAX_BOT_REPLIES) {
    return {
      reply: "Let me connect you with our team for anything more specific — they'll be with you shortly!",
      newMessageCount: messageCount,
      newHandoff: true,
      lastIntent: 'handoff_threshold',
      notifyStaff: true,
    };
  }

  const intent = INTENTS.find((i) => matchKeyword(text, i.keywords));
  if (intent) {
    return {
      reply: intent.reply(item),
      newMessageCount: messageCount + 1,
      newHandoff: false,
      lastIntent: intent.name,
      notifyStaff: false,
    };
  }

  // Couldn't confidently match anything — hand off rather than risk a wrong/invented answer.
  return {
    reply: "Let me get our team to help with that — connecting you now!",
    newMessageCount: messageCount,
    newHandoff: true,
    lastIntent: 'unmatched',
    notifyStaff: true,
  };
}

return run($json);
