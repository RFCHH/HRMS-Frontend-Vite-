/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Tailwind will purge unused styles from these files
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['Dancing Script', 'cursive'],  // Add Dancing Script font to the fontFamily object
      },
      colors: {
        // Custom colors (you can modify or add more)
        primary: '#3490dc',   // Blue color
        secondary: '#ffed4a', // Yellow color
        danger: '#e3342f',    // Red color
        success: '#38c172',   // Green color
      },
      animation: {
        // Custom animation for scrolling text
        'scroll-text': 'scrollText 20s linear infinite',
      },
      keyframes: {
        // Keyframes for the scrolling animation
        scrollText: {
          '0%': {
            transform: 'translateX(100%)', // Start off to the right
          },
          '100%': {
            transform: 'translateX(-100%)', // End off to the left
          },
        },
      },
      spacing: {
        // Custom spacing (you can add more if needed)
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        // Custom border radius (for rounded corners)
        '4xl': '2rem', // Adding a new border-radius size
      },
    },
  },
  plugins: [],
};
