/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#2a2a2a',
        amber: {
          DEFAULT: '#E8A020',
          dim: '#7a5210',
        },
        text: {
          primary: '#e8e8e0',
          muted: '#666660',
        },
        green: {
          terminal: '#4ade80',
        },
        // shadcn-compatible vars for footer-section.tsx
        foreground: '#e8e8e0',
        background: '#0a0a0a',
        'muted-foreground': '#666660',
      },
      scrollMargin: {
        14: '56px',
      },
    },
  },
  plugins: [],
}
