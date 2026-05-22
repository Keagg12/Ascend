/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        cyan: { neon: '#00e5ff' },
        purple: { neon: '#a855f7' },
        amber: { neon: '#f59e0b' },
        green: { neon: '#22c55e' },
        red: { neon: '#ef4444' },
        orange: { neon: '#ff6b35' },
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'hcPulse': 'hcPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        hcPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(245,158,11,0.6)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}