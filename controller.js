const Color = require('color');

const args = process.argv.slice(2);
const isMock = args.indexOf('-m') !== -1;

const FEATURES = {
  POWER: 0,
  RESET: 1,
  WIFI: 2,
  UV: 4,
  LED: 8
};
const AUTO_RELEASE = 5000;
const BUTTON_MODE = {
  PRESSED: 0,
  NOT_PRESSED: 1
};
const SWITCH_MODE = {
  ON: 0,
  OFF: 1
};
const COLOR_MODE = {
  OFF: undefined
};
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

let activatedFeatures;
let isInterfaceReady;
let interfaceReadyPromise;
let pressPower;
let releasePower;
let pressReset;
let releaseReset;
let turnOnWifi;
let turnOffWifi;
let turnOnUvLight;
let turnOffUvLight;
let turnOnLed;
let turnOffLed;
let setLed;

if (isMock) {
  activatedFeatures = Object.keys(FEATURES).map(k => FEATURES[k]);
  isInterfaceReady = true;
  pressPower = () => new Promise(resolve => {
    console.log('`pressPower` was called.');
    resolve();
  });
  releasePower = () => new Promise(resolve => {
    console.log('`releasePower` was called.');
    resolve();
  });
  pressReset = () => new Promise(resolve => {
    console.log('`pressReset` was called.');
    resolve();
  });
  releaseReset = () => new Promise(resolve => {
    console.log('`releaseReset` was called.');
    resolve();
  });
  turnOnWifi = () => new Promise(resolve => {
    console.log('`turnOnWifi` was called.');
    resolve();
  });
  turnOffWifi = () => new Promise(resolve => {
    console.log('`turnOffWifi` was called.');
    resolve();
  });
  turnOnUvLight = () => new Promise(resolve => {
    console.log('`turnOnUvLight` was called.');
    resolve();
  });
  turnOffUvLight = () => new Promise(resolve => {
    console.log('`turnOffUvLight` was called.');
    resolve();
  });
  turnOnLed = color => new Promise(resolve => {
    console.log(`\`turnOnLed\` was called with color - ${color}.`);
    resolve();
  });
  turnOffLed = () => new Promise(resolve => {
    console.log('`turnOffLed` was called.');
    resolve();
  });
  setLed = color => new Promise(resolve => {
    console.log(`\`setLed\` was called with color - ${color}.`);
    resolve();
  });
} else {
  // Optional dependency, won't be available on any machine other than rpi
  // eslint-disable-next-line global-require, import/no-unresolved
  const gpio = require('rpi-gpio');

  interfaceReadyPromise = Promise.all([
    new Promise((resolve, reject) => {
      gpio.setup(11, gpio.DIR_OUT, setupErr => {
        if (setupErr) reject(setupErr);
        pressPower = () => {
          gpio.write(11, true, err => {
            if (err) throw err;
            if (setupErr) reject(setupErr);
            console.log('pressing power!');
          });
        };
        releasePower = () => {
          gpio.write(11, false, err => {
            if (err) throw err;
            if (setupErr) reject(setupErr);
            console.log('releasing power!');
          });
        };
        resolve();
      });
    })
  ]).then(() => {
    isInterfaceReady = true;
    process.on('SIGINT', () => {
      gpio.destroy(() => {
        console.log('All pins unexported');
      });
    });
  });
}

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
    return pressPower().then(() => {
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
      throw new Error(`Power is already released, can't call \`releasePower\` again, might been called after program auto released the button (after ${this.AUTO_RELEASE}ms).`);
    }
    if (this.inProcess[FEATURES.POWER]) {
      throw new Error('Power is already in process.');
    }
    this.inProcess[FEATURES.POWER] = true;
    return releasePower().then(() => {
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
    }, this.AUTO_RELEASE);
    return pressReset().then(() => {
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
      throw new Error(`Reset is already released, can't call \`releaseReset\` again, might been called after program auto released the button (after ${this.AUTO_RELEASE}ms).`);
    }
    if (this.inProcess[FEATURES.RESET]) {
      throw new Error('Reset is already in process.');
    }
    this.inProcess[FEATURES.RESET] = true;
    return releaseReset().then(() => {
      this.inProcess[FEATURES.RESET] = false;
      this.status[FEATURES.RESET] = this.BUTTON_MODE.NOT_PRESSED;
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
    return turnOnWifi().then(() => {
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
    return turnOffWifi().then(() => {
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
    return turnOnUvLight().then(() => {
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
    return turnOffUvLight().then(() => {
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
    return turnOnLed(colorObj).then(() => {
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
    return turnOffLed().then(() => {
      this.inProcess[FEATURES.LED] = false;
      this.status[FEATURES.LED] = this.COLOR_MODE.OFF;
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
    return setLed(colorObj).then(() => {
      this.inProcess[FEATURES.LED] = false;
      this.status[FEATURES.LED] = colorObj.rgbString();
    }, () => {
      this.inProcess[FEATURES.LED] = false;
    });
  }
};

module.exports = {
  AUTO_RELEASE,
  BUTTON_MODE,
  SWITCH_MODE,
  COLOR_MODE,
  FEATURES,
  activatedFeatures,
  getInterface() {
    if (isInterfaceReady) {
      return new Promise(resolve => resolve(controllerInterface));
    } else {
      return interfaceReadyPromise().then(() => controllerInterface);
    }
  }
};
