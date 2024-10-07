import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': {
          50: '#ABC2FF',
          100: '#96B3FF',
          200: '#616161',
          300: '#4577FF',
          400: '#1a5Add',
          500: '#0042c2',
          600: '#0033BA',
          700: '#002382',
          800: '#001137',
          900: '#000525',
        },
        secondary: {
          '50': '#FCE9FD',
          '100': '#F9D7EF',
          '200': '#F3B4D3',
          '300': '#EEEEEE',
          '400': '#E86D9B',
          '500': '#E34A7F',
          '600': '#D4215C',
          '700': '#A4194B',
          '800': '#731239',
          '900': '#420A28'
 
        },
    
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
};
export default config;
