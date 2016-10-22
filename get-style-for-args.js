const Color = require('color');

module.exports = args => {
  const indexOfPrimaryColor = args.indexOf('-primary-color');
  const indexOfSecondaryColor = args.indexOf('-secondary-color');

  const primaryColor = args[indexOfPrimaryColor + 1];
  const secondaryColor = args[indexOfSecondaryColor + 1];

  // Check if valid colors
  if (indexOfPrimaryColor !== -1) {
    Color(primaryColor);
  }
  if (indexOfSecondaryColor !== -1) {
    Color(secondaryColor);
  }

  return {
    primary: indexOfPrimaryColor !== -1 ? primaryColor : '#000',
    secondary: indexOfSecondaryColor !== -1 ? secondaryColor : '#0F0'
  };
};
