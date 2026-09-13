import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF7F2',
          100: '#F4ECE0',
          200: '#E7D7C1',
          300: '#D8BD97',
          400: '#CCA77A',
          500: '#C5A880', // Muted Champagne Gold
          600: '#AB8C63',
          700: '#8A6D48',
          800: '#695133',
          900: '#473620',
        },
        obsidian: {
          950: '#0A0A0A',
          900: '#121212',
          850: '#18181B',
          800: '#222226',
          700: '#2E2E34',
          600: '#45454E',
        }
      },
      fontFamily: {
        sans: ['Cairo', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"El Messiri"', 'Cairo', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
