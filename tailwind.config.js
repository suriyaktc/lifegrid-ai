/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#FF2D2D', glow: '#FF2D2D44' },
        cyan: { DEFAULT: '#00D4FF' },
        green: { DEFAULT: '#00FF88' },
        orange: { DEFAULT: '#FF7A00' },
        bg: { DEFAULT: '#050A0E', 2: '#0A1520', 3: '#0F1E2E' },
        surface: { DEFAULT: '#112233', 2: '#162840' },
        border: { DEFAULT: '#1E3A50' },
        text: { DEFAULT: '#E8F4FF', 2: '#7AABC5', 3: '#3D6A8A' },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,45,45,0.4)' },
          '50%': { boxShadow: '0 0 0 8px transparent' },
        },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
