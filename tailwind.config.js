module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/**/**/*.{html,js,ts,jsx,tsx}',
    './auth/**/*.{html,js,ts,jsx,tsx}',
    './post/**/*.{html,js,ts,jsx,tsx}',
    '/',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#765cd7',
        primary_hover: '#5B4BB6',
        secondary: '#EEF4FF',
        background: '#878ed4',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
