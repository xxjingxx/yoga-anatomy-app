/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        sand: '#E8DFD0',
        clay: '#C4956A',
        earth: '#8B6347',
        moss: '#5C7A5A',
        sage: '#8FAF8D',
        charcoal: '#2D2926',
        'warm-white': '#FDFAF5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
// already exported above — this is a note: add to theme.extend if needed:
// animation: { 'fade-in': 'fadeIn 0.3s ease' }
// keyframes: { fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }
