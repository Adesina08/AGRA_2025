import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1729',
          800: '#0f2238',
          700: '#162b45'
        },
        accent: '#4fd1c5'
      }
    }
  },
  plugins: [],
};

export default config;
