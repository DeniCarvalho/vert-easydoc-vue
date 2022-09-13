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
        primaryPure: '#00747A',
        primaryPureLight: '#00747a0e',
        error: '#f07363',
        warning: '#fcd250',
        success: '#92c65e',
        fontLight: '#a1a1a4',
        disabledPure: '#e9e9e9',
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
      keyframes: () => ({
        vedFadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounce: {
          '0%': {
            transform: 'scale(0)',
          },
          '100%': {
            transform: 'scale(1)',
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
