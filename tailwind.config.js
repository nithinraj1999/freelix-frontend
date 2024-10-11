/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        'brand-color': '#1D6363', // Example of a custom orange color
      },
      zIndex: {
        '600': '600', // Add custom z-index if needed
        '1000':'1000'
      },
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari, and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge, and Firefox */
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
      });
    },
  ],
}