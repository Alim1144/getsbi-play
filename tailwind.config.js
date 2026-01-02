/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00F0FF',
        'neon-pink': '#FF00FF',
        'dark-purple': '#1a0d2e',
        'dark-purple-light': '#2d1b4e',
        'grid-blue': '#00D9FF',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      fontFamily: {
        'display': ['Arial', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-blue-lg': '0 0 30px rgba(0, 240, 255, 0.7)',
        'neon-pink-lg': '0 0 30px rgba(255, 0, 255, 0.7)',
      },
    },
  },
  plugins: [],
}
