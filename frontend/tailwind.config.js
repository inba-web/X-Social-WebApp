import daisyui from 'daisyui';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d9bf0',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#1d9bf0",
          "secondary": "#7c3aed",
          "accent": "#00e676",
          "neutral": "#16181c",
          "base-100": "#000000", // True rich black
          "base-200": "#16181c", // Slightly lighter for elements
          "base-300": "#202327", // Lighter for borders
          "base-content": "#e7e9ea", // Crisp white text
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
    darkTheme: 'dark',
  },
};