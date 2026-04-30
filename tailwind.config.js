/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#116B3C',
          lightGreen: '#7EB674',
          silver: '#C0C0C0',
          dark: '#0B0C0E',
          card: '#151719',
          accent: '#00D1B2',
          red: '#EE3B3B', // Keeping red for critical alerts if needed
        }
      }
    },
  },
  plugins: [],
}
