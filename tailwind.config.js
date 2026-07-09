/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mp: {
          bg: '#0a0a0f',
          surface: '#12121a',
          surfaceLight: '#1a1a28',
          surfaceHover: '#222235',
          border: '#2a2a3e',
          borderLight: '#3a3a52',
          cyan: '#00f0ff',
          purple: '#a855f7',
          magenta: '#ec4899',
          lime: '#84cc16',
          success: '#22c55e',
          danger: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { opacity: '.7', boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}