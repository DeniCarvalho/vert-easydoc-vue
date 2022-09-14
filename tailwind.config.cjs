module.exports = {
  jit: true,
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'ved-dark-mode',
  theme: {
    extend: {
      colors: {
        primary: '#123229',
        primaryMedium: '#004649',
        primaryLight: '#E6F1F2',
        primaryPure: 'var(--primary-pure-color-custom-ved)',
        primaryPureLight: '#00747a0e',
        error: '#f07363',
        warning: '#fcd250',
        success: '#92c65e',
        fontLight: '#a1a1a4',
        disabledPure: 'var(--default-color-ved)',
      },
      height: {
        18: '4.6rem',
      },
      fontSize: {
        xxs: '.60rem',
        'xs-auto': ['3.0vmax', '2rem'],
        'xl-auto': ['1.0vmax', '2rem'],
        '2xl-auto': ['2.0vmax', '2rem'],
      },
      animation: {
        'spin-fast-custom-ved': 'vedSpin .6s linear infinite',
        'fade-in-custom-ved': 'vedFadeIn .2s ease-in-out',
        'bounce-custom-ved': 'vedBounce 1.5s ease infinite',
      },
      keyframes: () => ({
        vedSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        vedFadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        vedBounce: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      }),
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  prefix: 'ved-',
};
