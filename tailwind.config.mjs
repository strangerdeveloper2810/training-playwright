/** @type {import('tailwindcss').Config} */
import starlightPlugin from '@astrojs/starlight-tailwind';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
        },
        green: {
          light: '#D1FAE5',
          dark: '#065F46',
        },
        yellow: {
          light: '#FEF3C7',
          dark: '#92400E',
        },
        red: {
          light: '#FEE2E2',
          dark: '#991B1B',
        },
      },
    },
  },
  plugins: [starlightPlugin()],
};
