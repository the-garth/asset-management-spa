const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      // token -> CSS variable mapping helpers (use as bg-token-card via `token.card`)
      // The actual values are provided by CSS variables (see src/index.css).
      colors: {
        slate: colors.slate || colors.gray,
        indigo: colors.indigo || colors.blue,
        token: {
          bg: 'var(--color-bg)',
          'card-bg': 'var(--color-card-bg)',
          text: 'var(--color-text)',
          brand: 'var(--color-brand)',
          border: 'var(--color-border)',
        },
      },
    },
  },
  plugins: [],
}