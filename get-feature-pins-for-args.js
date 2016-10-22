const { FEATURES } = require('./constant.js');

module.exports = args => args.reduce((obj, arg, argIndex) => {
  const feature = FEATURES[Object.keys(FEATURES).find(featureName => arg === `-${featureName.toLowerCase()}`)];
  if (feature !== undefined) {
    const featureValue = args[argIndex + 1];
    if (featureValue === undefined) {
      throw new Error(`Must provide number for ${arg}.`);
    } else if (isNaN(featureValue)) {
      throw new Error(`Must provide number for ${arg}, got ${featureValue}.`);
    }
    const pin = Number(featureValue);
    const conflictingFeature = Object.keys(obj).find(featureName => obj[featureName] === pin);
    if (conflictingFeature !== undefined) {
      const conflictingFeatureName = Object.keys(FEATURES).find(featureName => FEATURES[featureName] === conflictingFeature);
      throw new Error(`Conflicting pin (${pin}) found between "-${conflictingFeatureName.toLowerCase()}" and "${arg}".`);
    }
    return Object.assign(obj, {
      [feature]: pin
    });
  } else {
    return obj;
  }
}, {});
