/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/react/components/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/core/client/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6c3db7',
        'primary-light': '#9163d9',
        'primary-dark': '#4d2882',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'dice': '0 10px 30px rgba(108, 61, 183, 0.2)',
      },
    },
  },
  plugins: [],
}
