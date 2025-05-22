/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'ayala-green': {
          light: '#55b848',      // Lighter green
          DEFAULT: '#008937',    // Primary green (used as ayala-green)
          dark: '#00712d',       // Darker green
        },
        'page-bg': '#f3f4f6',      // Tailwind gray-100
        'card-bg': '#ffffff',       // White
        'header-bg': '#ffffff',     // White (can also use bg-gray-50 for a slight off-white)
        'text-primary': '#1f2937',  // Tailwind gray-800
        'text-secondary': '#374151',// Tailwind gray-700
        'text-muted': '#6b7280',   // Tailwind gray-500
      },
      fontFamily: {
        // Example: If you wanted to add 'Inter' as the primary sans-serif font
        // sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', /* other fallbacks */],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
