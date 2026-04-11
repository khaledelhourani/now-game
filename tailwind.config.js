/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: {
          black: '#0C0C0E',
          deep: '#111115',
          card: '#17171C',
          surface: '#1E1E25',
          border: '#2A2A35',
          hover: '#25252F',
        },
        gold: {
          DEFAULT: '#E5B94E',
          light: '#F5D080',
          dark: '#8A6B20',
          dim: '#C8960C',
        },
        crimson: {
          DEFAULT: '#C0392B',
          bright: '#E74C3C',
          dim: 'rgba(192,57,43,0.2)',
        },
        cream: {
          DEFAULT: '#ECE9E0',
          muted: '#A89880',
          dim: '#6B5C48',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Tajawal', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'glow': 'glowPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
