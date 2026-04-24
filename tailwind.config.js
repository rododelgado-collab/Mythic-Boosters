/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void:   '#020617',
        night:  '#0a1024',
        abyss:  '#0f172a',
        mist:   '#1e293b',
        gold: {
          50:  '#fdf6e3',
          100: '#faebc8',
          200: '#f5dc8e',
          300: '#edc653',
          400: '#e0b03a',
          500: '#c8952a',
          600: '#a67a20',
          700: '#855e18',
          800: '#6f4e0f',
        },
        rarity: {
          common:   '#cbd5e1',
          uncommon: '#64748b',
          rare:     '#eab308',
          mythic:   '#f97316',
          special:  '#a855f7',
        },
        mana: {
          w: '#fefce8',
          u: '#0ea5e9',
          b: '#1e293b',
          r: '#ef4444',
          g: '#22c55e',
          c: '#94a3b8',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(224, 176, 58, 0.4)',
        'glow-gold-lg': '0 0 40px rgba(224, 176, 58, 0.5)',
        'glow-rare': '0 0 20px rgba(234, 179, 8, 0.5)',
        'glow-mythic': '0 0 25px rgba(249, 115, 22, 0.6)',
        'glow-special': '0 0 25px rgba(168, 85, 247, 0.5)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #edc653, #c8952a)',
        'gradient-pack': 'linear-gradient(135deg, #1a0b2e, #3d1f4f, #1a0b2e)',
        'gradient-rare-art': 'linear-gradient(135deg, rgba(224,176,58,0.25), rgba(168,85,247,0.2))',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'reveal': 'reveal 0.6s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(224, 176, 58, 0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(224, 176, 58, 0.7)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'reveal': {
          '0%': { opacity: '0', transform: 'scale(0.8) rotateY(-30deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotateY(0)' },
        },
      },
    },
  },
  plugins: [],
}