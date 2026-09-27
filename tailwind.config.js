/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TONE 1: Primary Institutional Navy
        navy: {
          50: '#f0f5fa',
          100: '#dce8f4',
          200: '#bbd5ec',
          300: '#8dbce0',
          400: '#599dd1',
          500: '#3480be',
          600: '#2365a3',
          700: '#1b5083',
          800: '#153f68',
          900: '#0f2c4b', // Primary brand deep navy
          950: '#0a1d32',
        },
        // TONE 2: Supporting Academic Teal / Cyan
        teal: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // Primary action/secondary data accent
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // TONE 3: Institutional Neutral Slate & Crisp Backgrounds
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#eaeff5',
          200: '#e2e8f0', // Clean distinct border
          300: '#cbd5e1', // Input border
          400: '#94a3b8',
          500: '#64748b', // Muted text
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Primary dark text
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Open Sans"', '"Source Sans 3"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'panel': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        DEFAULT: '3px',
        'sm': '2px',
        'md': '4px',
        'lg': '6px',
      }
    },
  },
  plugins: [],
}

