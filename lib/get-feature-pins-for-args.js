const { FEATURES } = require('./constant.js');

const getNumberOfPinsForFeature = feature => {
  switch (feature) {
    case FEATURES.LED:
      return 3;
    default:
      return 1;
  }
};

module.exports = args => args.reduce((obj, arg, argIndex) => {
  const feature = FEATURES[Object.keys(FEATURES).find(featureName => arg === `-${featureName.toLowerCase()}`)];
  if (feature !== undefined) {
    const numberOfValues = getNumberOfPinsForFeature(feature);
    const featureValue = args[argIndex + 1];
    if (featureValue === undefined) {
      throw new Error(`Must provide number for ${arg}.`);
    }
    const featureValues = featureValue.split(',');
    if (featureValues.length !== numberOfValues) {
      throw new Error(`Must provide ${numberOfValues} pins for ${arg}, got ${featureValues.length}.`);
    }
    featureValues.forEach(x => {
      if (isNaN(x)) {
        throw new Error(`Must provide number for ${arg}, got ${x}.`);
      }
    });

    const pins = featureValues.map(x => Number(x));

    pins.forEach((pin, pinIndex) => {
      if (pins.indexOf(pin) !== pinIndex) {
        throw new Error(`Conflicting pin (${pin}) found on "${arg}".`);
      }
      const conflictingFeature = Object.keys(obj).map(x => Number(x)).find(currFeature => obj[currFeature].some(_pin => _pin === pin));
      if (conflictingFeature !== undefined) {
        const conflictingFeatureName = Object.keys(FEATURES).find(featureName => FEATURES[featureName] === conflictingFeature);
        throw new Error(`Conflicting pin (${pin}) found between "-${conflictingFeatureName.toLowerCase()}" and "${arg}".`);
      }
    });

    return Object.assign(obj, {
      [feature]: pins
    });
  } else {
    return obj;
  }
}, {});
