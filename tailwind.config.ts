import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — SPEC §3. Do not alter.
        paper: '#F4EFE4',
        'paper-deep': '#EDE6D6',
        sumi: '#1B1A17',
        'sumi-soft': '#4A4640',
        ash: '#7A746B',
        vermilion: '#C8472E',
        'vermilion-deep': '#A83A24',
        indigo: '#2E4A52',
      },
      fontFamily: {
        // Headings Shippori Mincho, body Hanken Grotesk, labels/meta DM Mono.
        disp: ['var(--font-disp)', 'Shippori Mincho', 'serif'],
        body: ['var(--font-body)', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'DM Mono', 'ui-monospace', 'monospace'],
      },
      screens: {
        // SPEC: collapse to 1 column under 920px.
        nav: '920px',
      },
    },
  },
  plugins: [],
};

export default config;
