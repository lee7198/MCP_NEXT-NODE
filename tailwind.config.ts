import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [typography],
};
