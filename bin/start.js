#!/usr/bin/env node
const desktopController = require('../lib/');
const getStyleForArgs = require('../lib/get-style-for-args.js');
const getFeaturePinsForArgs = require('../lib/get-feature-pins-for-args.js');

const args = process.argv.slice(2);
const style = getStyleForArgs(args);
const featurePins = getFeaturePinsForArgs(args);

desktopController({
  featurePins,
  port: 8080,
  style,
  useWebpack: true,
  mock: true
});
