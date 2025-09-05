/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'hsl(210, 30%, 98%)',
        'accent': 'hsl(135, 70%, 50%)',
        'primary': 'hsl(210, 90%, 45%)',
        'surface': 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(200, 15%, 15%)',
        'text-secondary': 'hsl(200, 15%, 40%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
    },
  },
  plugins: [],
}