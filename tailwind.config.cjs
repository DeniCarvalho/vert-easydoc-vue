module.exports = {
  jit: true,
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'ved-dark',
  theme: {
    extend: {
      colors: {
        primary: '#5eb1c6',
        primaryMedium: '#004649',
        primaryLight: '#7f5ec6',
        primaryPure: '#00747a',
        primaryPureLight: '#00747a0e',
        secondary: '#acd094',
        secondaryMedium: '#557b7f',
        secondaryLight: '#99d4d0',
        tertiary: '#fcd250',
        error: '#f07363',
        warning: '#fcd250',
        success: '#92c65e',
        fontLight: '#a1a1a4',
        disabledPure: '#fcd250',
      },
      fontFamily: {
        opensans: ['Open Sans', 'sans-serif'],
        monospace: ['monospace'],
      },
      fontSize: {
        xxs: '.55rem',
        'xs-auto': ['3.0vmax', '2rem'],
        'xl-auto': ['1.0vmax', '2rem'],
        '2xl-auto': ['2.0vmax', '2rem'],
      },
      minWidth: {
        '2/5': '40%',
      },
      animation: {
        'spin-fast': 'spin .6s linear infinite',
        fadeInPage: 'fadeIn .2s ease-in-out',
        bouncePage: 'bounce .3s ease-in',
      },
      keyframes: () => ({
        fadeIn: {
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
      width: {
        '12/13': '95%',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  prefix: 'ved-',
};
