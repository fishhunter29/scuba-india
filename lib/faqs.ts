// "Can I even do this?" fear self-checks (learn-to-dive page, Section 2).
// Plain module so it can be both rendered by the client accordion AND emitted
// as FAQPage JSON-LD from the server page.
export const FEAR_CHECKS = [
  {
    q: "I can't swim.",
    a: "You don't need to. On a try dive you're not swimming — you're floating, and your instructor controls that for you the whole time. Some of our happiest divers can't swim a stroke.",
  },
  {
    q: 'I wear glasses / contacts.',
    a: 'No problem. Contacts are fine under a mask. If you wear glasses, your mask still lets you see clearly underwater — and we can talk through options when you arrive.',
  },
  {
    q: "I'm scared / claustrophobic.",
    a: "Completely normal — most first-timers are nervous right up until the first breath. We go slow, your instructor stays within arm's reach, and you can signal to come up at any moment. Nothing is forced.",
  },
  {
    q: "I'm not fit / I'm over 50.",
    a: "Diving is gentle, not athletic. Basic health is enough. If you're over a certain age or have a heart, lung, or ear condition, we'll just ask for a simple medical check — standard safety, not a barrier.",
  },
  {
    q: 'Can my kids do it?',
    a: "Yes — try dives are open from age 10. It's one of the best things a family can do together in the Andamans.",
  },
];
