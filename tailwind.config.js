/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
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
