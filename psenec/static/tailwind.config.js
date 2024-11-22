module.exports = {
    content: ['../templates/*.html', '../**/templates/**/*.html'],
    darkMode: 'media', // or 'class'
    theme: {
      extend: {
        colors: {
          'primary': '#EC1827',
          'dark': '#3A3333',
          grey: {
            50: 'var(--grey-50)',
            100: 'var(--grey-100)',
            200: 'var(--grey-200)',
            300: 'var(--grey-300)',
            400: 'var(--grey-400)',
            500: 'var(--grey-500)',
            600: 'var(--grey-600)',
            700: 'var(--grey-700)',
            800: 'var(--grey-800)',
            900: 'var(--grey-900)',
            950: 'var(--grey-950)'
          }
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
    darkMode: 'media',
  };
  