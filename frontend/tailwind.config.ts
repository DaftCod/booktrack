import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bt: {
          bg:      '#0f0e1a',
          card:    '#1a1830',
          surface: '#252244',
          purple:  '#8b5cf6',
          violet:  '#7c3aed',
          muted:   '#9794b4',
          border:  '#332f5a',
          text:    '#f0eeff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
