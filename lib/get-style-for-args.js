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

  const result = {};

  if (indexOfPrimaryColor !== -1) {
    result.primary = primaryColor;
  }
  if (indexOfSecondaryColor !== -1) {
    result.secondary = secondaryColor;
  }

  return result;
};
