/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jet-dark': '#0a0e17',
        'jet-darker': '#060912',
        'jet-gold': '#d4af37',
        'jet-gold-light': '#f4d03f',
        'jet-blue': '#1e40af',
        'jet-green': '#22c55e',
        'jet-red': '#ef4444',
        'jet-orange': '#f97316',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
