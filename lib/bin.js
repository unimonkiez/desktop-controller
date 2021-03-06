#!/usr/bin/env node
const desktopController = require('./');
const getStyleForArgs = require('./get-style-for-args.js');
const getFeaturePinsForArgs = require('./get-feature-pins-for-args.js');

const args = process.argv.slice(2);
const style = getStyleForArgs(args);
const featurePins = getFeaturePinsForArgs(args);
const mock = args.indexOf('-m') !== -1;

desktopController({
  featurePins,
  port: 80,
  style,
  mock
});
