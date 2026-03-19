/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f', // Deep void black
        surface: '#12121a',    // Slightly lighter for cards
        primary: '#6366f1',    // Indigo core
        ai: '#22d3ee',         // Cyan 400 for glowing agent accents
        'ai-glow': 'rgba(34, 211, 238, 0.15)' 
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'], // For that terminal feel
      }
    },
  },
  plugins: [],
}