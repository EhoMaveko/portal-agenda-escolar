const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      'grid-auto-fit': (value) => ({
        gridTemplateColumns: `repeat(auto-fit, minmax(${value}, 1fr))`,
      }),
    },
    {
      values: theme('gridAutoFit'),
    },
  );
});
