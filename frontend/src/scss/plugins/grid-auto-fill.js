const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      'grid-auto-fill': (value) => ({
        gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
      }),
    },
    {
      values: theme('gridAutoFill'),
    },
  );
});
