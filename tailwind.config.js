module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        es: {
          bg:     '#070b0f',
          panel:  '#0e1825',
          card:   '#131f2e',
          hover:  '#182537',
          up:     '#12d992',
          down:   '#ff4560',
          blue:   '#4a9eff',
          text:   '#e8f0fe',
          sub:    '#8090b0',
          muted:  '#3a4e6e',
          border: '#1a2840',
          glow:   '#0d7a4f',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'ticker': 'ticker 40s linear infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.25s ease',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
