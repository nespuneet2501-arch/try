/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmicBg: '#090a15',
        cosmicDeep: '#0f1123',
        cosmicGold: '#cca43b',
        cosmicGoldLight: '#e5c060',
        celestialGreen: '#00e676',
        celestialBlue: '#2979ff',
        cosmicSlate: '#191b35',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
