/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#0f172a', // deep navy slate
          600: '#1e293b',
          700: '#334155',
          800: '#475569',
          900: '#64748b',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb', // royal blue
          600: '#1d4ed8',
          700: '#1e40af',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
