import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#080d1a',
          alt: '#0d1527',
        },
        surface: {
          DEFAULT: '#111b30',
          hover: '#17253f',
          light: '#1e293b',
        },
        brand: {
          primary: '#6366f1',
          secondary: '#3b82f6',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
        },
        danger: {
          DEFAULT: '#f43f5e',
          light: '#fb7185',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        border: {
          DEFAULT: '#1e293b',
          focus: '#6366f1',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        }
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-success': '0 0 15px rgba(16, 185, 129, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
