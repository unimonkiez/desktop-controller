const { FEATURES, BUTTON_MODE, COLOR_MODE, SWITCH_MODE, AUTO_RELEASE } = require('./constant.js');
const Color = require('color');
const getFeaturePinsForArgs = require('./get-feature-pins-for-args.js');
const getGpioManager = require('./get-gpio-manager.js');

const args = process.argv.slice(2);

const getDefaultModeToFeature = feature => {
  switch (feature) {
    case FEATURES.POWER:
    case FEATURES.RESET:
      return BUTTON_MODE.NOT_PRESSED;
    case FEATURES.LED:
      return COLOR_MODE.OFF;
    default:
      return SWITCH_MODE.OFF;
  }
};

const featurePins = getFeaturePinsForArgs(args);
const activatedFeatures = Object.keys(featurePins).map(key => Number(key));

if (activatedFeatures.length === 0) {
  throw new Error(`
    No features are activated, to activate a feature add parameters to "desktop-controller" command.
    Available features ${Object.keys(FEATURES).map(featureName => `"-${featureName.toLowerCase()}"`).join(', ')}
  `);
}

let gpioManager;
const gpioManagerPromise = getGpioManager(activatedFeatures, featurePins).then(_gpioManager => {
  gpioManager = _gpioManager;
}, err => {
  throw err;
});

const controllerInterface = {
  status: activatedFeatures.reduce((obj, feature) => Object.assign(obj, {
    [feature]: getDefaultModeToFeature(feature)
  }), {}),
  inProcess: activatedFeatures.reduce((obj, feature) => Object.assign(obj, {
    [feature]: false
  }), {}),
  pressPower() {
    if (activatedFeatures.indexOf(FEATURES.POWER) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.POWER] === BUTTON_MODE.PRESSED) {
      throw new Error('Power is already pressed.');
    }
    if (this.inProcess[FEATURES.POWER]) {
      throw new Error('Power is already in process.');
    }
    this.inProcess[FEATURES.POWER] = true;
    return gpioManager.pressPower().then(() => {
      this.inProcess[FEATURES.POWER] = false;
      this.status[FEATURES.POWER] = BUTTON_MODE.PRESSED;
      setTimeout(() => {
        if (this.status[FEATURES.POWER] === BUTTON_MODE.PRESSED) {
          this._releasePower().then(undefined, err => {
            console.log(err);
          });
        }
      }, AUTO_RELEASE);
      return this._releasePower.bind(this);
    }, () => {
      this.inProcess[FEATURES.POWER] = false;
    });
  },
  _releasePower() {
    if (activatedFeatures.indexOf(FEATURES.POWER) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.POWER] === BUTTON_MODE.NOT_PRESSED) {
      throw new Error(`Power is already released, can't call \`releasePower\` again, might been called after program auto released the button (after ${AUTO_RELEASE}ms).`);
    }
    if (this.inProcess[FEATURES.POWER]) {
      throw new Error('Power is already in process.');
    }
    this.inProcess[FEATURES.POWER] = true;
    return gpioManager.releasePower().then(() => {
      this.inProcess[FEATURES.POWER] = false;
      this.status[FEATURES.POWER] = BUTTON_MODE.NOT_PRESSED;
    }, () => {
      this.inProcess[FEATURES.POWER] = false;
    });
  },
  pressReset() {
    if (activatedFeatures.indexOf(FEATURES.RESET) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.RESET] === BUTTON_MODE.PRESSED) {
      throw new Error('Reset is already pressed, can\'t call `pressReset` again.');
    }
    if (this.inProcess[FEATURES.RESET]) {
      throw new Error('Reset is already in process.');
    }
    this.inProcess[FEATURES.RESET] = true;
    setTimeout(() => {
      if (this.status[FEATURES.RESET] === BUTTON_MODE.PRESSED) {
        this._releaseReset();
      }
    }, AUTO_RELEASE);
    return gpioManager.pressReset().then(() => {
      this.inProcess[FEATURES.RESET] = false;
      this.status[FEATURES.RESET] = BUTTON_MODE.PRESSED;
      return this._releaseReset.bind(this);
    }, () => {
      this.inProcess[FEATURES.RESET] = false;
    });
  },
  _releaseReset() {
    if (activatedFeatures.indexOf(FEATURES.RESET) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.RESET] === BUTTON_MODE.NOT_PRESSED) {
      throw new Error(`Reset is already released, can't call \`releaseReset\` again, might been called after program auto released the button (after ${AUTO_RELEASE}ms).`);
    }
    if (this.inProcess[FEATURES.RESET]) {
      throw new Error('Reset is already in process.');
    }
    this.inProcess[FEATURES.RESET] = true;
    return gpioManager.releaseReset().then(() => {
      this.inProcess[FEATURES.RESET] = false;
      this.status[FEATURES.RESET] = BUTTON_MODE.NOT_PRESSED;
    }, () => {
      this.inProcess[FEATURES.RESET] = false;
    });
  },
  turnOnWifi() {
    if (activatedFeatures.indexOf(FEATURES.WIFI) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.WIFI] === SWITCH_MODE.ON) {
      throw new Error('Wifi is already on, can\'t call `turnOnWifi` again.');
    }
    if (this.inProcess[FEATURES.WIFI]) {
      throw new Error('Wifi is already in process.');
    }
    this.inProcess[FEATURES.WIFI] = true;
    return gpioManager.turnOnWifi().then(() => {
      this.inProcess[FEATURES.WIFI] = false;
      this.status[FEATURES.WIFI] = SWITCH_MODE.ON;
    }, () => {
      this.inProcess[FEATURES.WIFI] = false;
    });
  },
  turnOffWifi() {
    if (activatedFeatures.indexOf(FEATURES.WIFI) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.WIFI] === SWITCH_MODE.OFF) {
      throw new Error('Wifi is already off, can\'t call `turnOffWifi` again.');
    }
    if (this.inProcess[FEATURES.WIFI]) {
      throw new Error('Wifi is already in process.');
    }
    this.inProcess[FEATURES.WIFI] = true;
    return gpioManager.turnOffWifi().then(() => {
      this.inProcess[FEATURES.WIFI] = false;
      this.status[FEATURES.WIFI] = SWITCH_MODE.OFF;
    }, () => {
      this.inProcess[FEATURES.WIFI] = false;
    });
  },
  turnOnUvLight() {
    if (activatedFeatures.indexOf(FEATURES.UV) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.UV] === SWITCH_MODE.ON) {
      throw new Error('UvLight is already on, can\'t call `turnOnUvLight` again.');
    }
    if (this.inProcess[FEATURES.UV]) {
      throw new Error('UvLight is already in process.');
    }
    this.inProcess[FEATURES.UV] = true;
    return gpioManager.turnOnUvLight().then(() => {
      this.inProcess[FEATURES.UV] = false;
      this.status[FEATURES.UV] = SWITCH_MODE.ON;
    }, () => {
      this.inProcess[FEATURES.UV] = false;
    });
  },
  turnOffUvLight() {
    if (activatedFeatures.indexOf(FEATURES.UV) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.UV] === SWITCH_MODE.OFF) {
      throw new Error('UvLight is already off, can\'t call `turnOffUvLight` again.');
    }
    if (this.inProcess[FEATURES.UV]) {
      throw new Error('UvLight is already in process.');
    }
    this.inProcess[FEATURES.UV] = true;
    return gpioManager.turnOffUvLight().then(() => {
      this.inProcess[FEATURES.UV] = false;
      this.status[FEATURES.UV] = SWITCH_MODE.OFF;
    }, () => {
      this.inProcess[FEATURES.UV] = false;
    });
  },
  turnOnLed(color) {
    if (activatedFeatures.indexOf(FEATURES.LED) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (color === undefined) {
      throw new Error('`color` is required as first argument.');
    }
    if (this.status[FEATURES.LED] !== COLOR_MODE.OFF) {
      throw new Error('Led is already on, can\'t call `turnOnLed` again.');
    }
    if (this.inProcess[FEATURES.LED]) {
      throw new Error('Led is already in process.');
    }
    this.inProcess[FEATURES.LED] = true;
    const colorObj = Color(color);
    return gpioManager.turnOnLed(colorObj.red(), colorObj.green(), colorObj.blue()).then(() => {
      this.inProcess[FEATURES.LED] = false;
      this.status[FEATURES.LED] = colorObj.rgbString();
    }, () => {
      this.inProcess[FEATURES.LED] = false;
    });
  },
  turnOffLed() {
    if (activatedFeatures.indexOf(FEATURES.LED) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (this.status[FEATURES.LED] === COLOR_MODE.OFF) {
      throw new Error('Led is already off, can\'t call `turnOffLed` again.');
    }
    if (this.inProcess[FEATURES.LED]) {
      throw new Error('Led is already in process.');
    }
    this.inProcess[FEATURES.LED] = true;
    return gpioManager.turnOffLed().then(() => {
      this.inProcess[FEATURES.LED] = false;
      this.status[FEATURES.LED] = COLOR_MODE.OFF;
    }, () => {
      this.inProcess[FEATURES.LED] = false;
    });
  },
  setLed(color) {
    if (activatedFeatures.indexOf(FEATURES.LED) === -1) {
      throw new Error('This feature is not activated.');
    }
    if (color === undefined) {
      throw new Error('`color` is required as first argument.');
    }
    if (this.status[FEATURES.LED] === COLOR_MODE.OFF) {
      throw new Error('Led is off and it\'s color cannot be set, can\'t call `setLed`.');
    }
    if (this.inProcess[FEATURES.LED]) {
      throw new Error('Led is already in process.');
    }
    const colorObj = Color(color);
    this.inProcess[FEATURES.LED] = true;
    return gpioManager.setLed(colorObj.red(), colorObj.green(), colorObj.blue()).then(() => {
      this.inProcess[FEATURES.LED] = false;
      this.status[FEATURES.LED] = colorObj.rgbString();
    }, () => {
      this.inProcess[FEATURES.LED] = false;
    });
  }
};

module.exports = {
  activatedFeatures,
  getInterface() {
    if (gpioManager !== undefined) {
      return new Promise(resolve => resolve(controllerInterface));
    } else {
      return gpioManagerPromise.then(() => controllerInterface);
    }
  }
};
