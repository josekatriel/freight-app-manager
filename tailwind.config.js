/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        frasto: {
          bg: 'var(--frasto-bg)',
          surface: 'var(--frasto-surface)',
          'surface-subtle': 'var(--frasto-surface-subtle)',
          ink: 'var(--frasto-ink)',
          'ink-muted': 'var(--frasto-ink-muted)',
          'ink-soft': 'var(--frasto-ink-soft)',
          border: 'var(--frasto-border)',
          'border-strong': 'var(--frasto-border-strong)',
          positive: 'var(--frasto-positive)',
          warning: 'var(--frasto-warning)',
          danger: 'var(--frasto-danger)',
          info: 'var(--frasto-info)',
          focus: 'var(--frasto-focus)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
      }
    },
  },
  plugins: [],
}
