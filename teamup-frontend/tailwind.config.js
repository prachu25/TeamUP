/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F0FA',
        ink: '#1A1838',
        muted: '#6A6887',
        violet: { DEFAULT: '#3A2EDB', deep: '#241B9E', soft: '#E4E1FB' },
        lime: { DEFAULT: '#C9F26B', deep: '#9CC82E' },
        line: '#DAD6EE',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
