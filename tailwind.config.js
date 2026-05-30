/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        campfire: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        sunshine: {
          100: '#fef9c3',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
        },
        sky: {
          100: '#e0f2fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        cream: '#faf9f6',
      },
      fontFamily: {
        camp: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
