/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A6CFF',
        secondary: '#1e293b',
        accent: '#f8fafc',
        danger: '#EF4444',
        success: '#10B981',
        muted: '#94A3B8',
        disabled: '#cbd5e1',
        buttonDisabled: '#e0e7ff',
        buttonDisabledText: '#93c5fd',
        cardBg: '#ffffff0d', // rgba(255, 255, 255, 0.05)
        glassWhite: 'rgba(255, 255, 255, 0.15)',
        highlight: '#FACC15',
        overlay: 'rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['"Poppins"', '"Noto Sans TC"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 25px rgba(0, 0, 0, 0.1)',
        button: '0 4px 15px rgba(74, 108, 255, 0.3)',
        glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'auth-gradient': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
        fade: 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
