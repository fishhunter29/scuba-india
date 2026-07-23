// Official Scuba India price list (single source of truth for /prices).
// Mirrors the printed rate sheet. Prices in INR. Edit here to update the page.

export interface PriceItem {
  name: string;
  sub?: string; // small descriptor under the name
  price: number;
  unit?: string; // e.g. "per couple", "from" — shown next to the amount
}

export interface PriceSection {
  id: string;
  title: string;
  subtitle?: string;
  note?: string; // small note under the section table
  items: PriceItem[];
}

export const PRICE_LIST: PriceSection[] = [
  {
    id: 'discover',
    title: 'Dive Experiences for Beginners',
    subtitle: 'Discover Scuba Diving — with PADI online DSD registration. No experience needed.',
    note: 'All beginner dives are from the boat and include HD photos and video, free.',
    items: [
      { name: '30 min Discover Scuba Dive', sub: 'From boat · photos & video included', price: 3800 },
      { name: '45 min Discover Scuba Dive', sub: 'From boat · photos & video included', price: 4500 },
      { name: '2 × 30 min Discover Scuba Dives', sub: 'From boat · photos & video included', price: 7500 },
      { name: '30 min + 45 min Discover Scuba Dives', sub: 'From boat · photos & video included', price: 9000 },
    ],
  },
  {
    id: 'courses',
    title: 'PADI Courses',
    subtitle: 'Internationally recognised certifications, beginner to professional.',
    items: [
      { name: 'PADI Scuba Diver', price: 18000 },
      { name: 'Open Water Diver', price: 25000 },
      { name: 'Advanced Open Water Diver', price: 22000 },
      { name: 'Emergency First Response', price: 10000 },
      { name: 'Rescue Diver', price: 22000 },
      { name: 'Dive Master — Go Pro Internship', price: 70000 },
    ],
  },
  {
    id: 'combos',
    title: 'Course Combos',
    subtitle: 'Bundle courses and save — the fastest route to your next certification.',
    items: [
      { name: 'PADI Open Water & Advanced Open Water Combo', price: 40000 },
      { name: 'EFR + PADI Rescue Combo', price: 28000 },
      { name: 'EFR + PADI Rescue + PADI Dive Master Combo', price: 95000 },
      { name: 'Zero to Hero', sub: 'PADI Open Water all the way to Dive Master', price: 130000 },
    ],
  },
  {
    id: 'fun-dives',
    title: 'Fun Dives',
    subtitle: 'For certified divers only. Bring your certification card.',
    items: [
      { name: 'Single Dive', price: 4000 },
      { name: 'Night Dive', price: 4500 },
      { name: '1 Day — 2 Dives', price: 7500 },
      { name: '2 Days — 4 Dives', price: 14500 },
    ],
  },
  {
    id: 'charters',
    title: 'Boat Charters',
    subtitle: 'Private boat hire for your group, by the hour or half day.',
    items: [
      { name: 'Boat Charter — 1 hour', price: 13500 },
      { name: 'Boat Charter — 1.5 hours', price: 17500 },
      { name: 'Boat Charter — 2 hours', price: 21000 },
      { name: 'Boat Charter — Half Day', price: 45000 },
    ],
  },
  {
    id: 'island-hopping',
    title: 'Island Hopping',
    subtitle: 'A full experience around Havelock (Swaraj Dweep).',
    items: [
      {
        name: 'Island Hopping Trip, Havelock',
        sub: 'Snorkelling, scuba diving and sunset at the lighthouse',
        price: 25000,
        unit: 'per couple · from',
      },
    ],
  },
];
