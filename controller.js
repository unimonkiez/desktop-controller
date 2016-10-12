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
const getDefaultModeToFeature = feature => {
  switch (feature) {
    case FEATURES.POWER:
    case FEATURES.RESET:
      return BUTTON_MODE.NOT_PRESSED;
    default:
      return SWITCH_MODE.OFF;
  }
};

let activatedFeatures;
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
  pressPower = () => {
    console.log('`pressPower` was called.');
  };
  releasePower = () => {
    console.log('`releasePower` was called.');
  };
  pressReset = () => {
    console.log('`pressReset` was called.');
  };
  releaseReset = () => {
    console.log('`releaseReset` was called.');
  };
  turnOnWifi = () => {
    console.log('`turnOnWifi` was called.');
  };
  turnOffWifi = () => {
    console.log('`turnOffWifi` was called.');
  };
  turnOnUvLight = () => {
    console.log('`turnOnUvLight` was called.');
  };
  turnOffUvLight = () => {
    console.log('`turnOffUvLight` was called.');
  };
  turnOnLed = color => {
    console.log(`\`turnOnLed\` was called with color - ${color}.`);
  };
  turnOffLed = () => {
    console.log('`turnOffLed` was called.');
  };
  setLed = color => {
    console.log(`\`setLed\` was called with color - ${color}.`);
  };
} else {
  // Optional dependency, won't be available on any machine other than rpi
  // eslint-disable-next-line
  const gpio = require('rpi-gpio');

  gpio.setup(11, gpio.DIR_OUT, setupErr => {
    if (setupErr) throw setupErr;
    process.on('SIGINT', () => {
      gpio.destroy(() => {
        console.log('All pins unexported');
      });
    });
    pressPower = () => {
      gpio.write(11, true, err => {
        if (err) throw err;
        console.log('pressing power!');
      });
    };
    releasePower = () => {
      gpio.write(11, false, err => {
        if (err) throw err;
        console.log('releasing power!');
      });
    };
  });
}

module.exports = {
  AUTO_RELEASE,
  BUTTON_MODE,
  SWITCH_MODE,
  FEATURES,
  activatedFeatures,
  status: activatedFeatures.reduce((obj, feature) => Object.assign(obj, {
    [feature]: getDefaultModeToFeature(feature)
  }), {}),
  pressPower() {
    if (this.status[FEATURES.POWER] === this.BUTTON_MODE.PRESSED) {
      throw new Error('Power is already pressed, can\'t call `pressPower` again.');
    }
    this.status[FEATURES.POWER] = this.BUTTON_MODE.PRESSED;
    pressPower();
    setTimeout(() => {
      if (this.status[FEATURES.POWER] === this.BUTTON_MODE.PRESSED) {
        this._releasePower();
      }
    }, this.AUTO_RELEASE);
    return this._releasePower.bind(this);
  },
  _releasePower() {
    if (this.status[FEATURES.POWER] === this.BUTTON_MODE.NOT_PRESSED) {
      throw new Error(`Power is already released, can't call \`releasePower\` again, might been called after program auto released the button (after ${this.AUTO_RELEASE}ms).`);
    }
    this.status[FEATURES.POWER] = this.BUTTON_MODE.NOT_PRESSED;
    releasePower();
  },
  pressReset() {
    if (this.status[FEATURES.RESET] === this.BUTTON_MODE.PRESSED) {
      throw new Error('Reset is already pressed, can\'t call `pressReset` again.');
    }
    this.status[FEATURES.RESET] = this.BUTTON_MODE.PRESSED;
    pressReset();
    setTimeout(() => {
      if (this.status[FEATURES.RESET] === this.BUTTON_MODE.PRESSED) {
        this._releaseReset();
      }
    }, this.AUTO_RELEASE);
    return this._releaseReset.bind(this);
  },
  _releaseReset() {
    if (this.status[FEATURES.RESET] === this.BUTTON_MODE.NOT_PRESSED) {
      throw new Error(`Reset is already released, can't call \`releaseReset\` again, might been called after program auto released the button (after ${this.AUTO_RELEASE}ms).`);
    }
    this.status[FEATURES.RESET] = this.BUTTON_MODE.NOT_PRESSED;
    releaseReset();
  },
  turnOnWifi() {
    if (this.status[FEATURES.WIFI] === this.SWITCH_MODE.ON) {
      throw new Error('Wifi is already on, can\'t call `turnOnWifi` again.');
    }
    this.status[FEATURES.WIFI] = this.SWITCH_MODE.ON;
    turnOnWifi();
  },
  turnOffWifi() {
    if (this.status[FEATURES.WIFI] === this.SWITCH_MODE.OFF) {
      throw new Error('Wifi is already off, can\'t call `turnOffWifi` again.');
    }
    this.status[FEATURES.WIFI] = this.SWITCH_MODE.OFF;
    turnOffWifi();
  },
  turnOnUvLight() {
    if (this.status[FEATURES.UV] === this.SWITCH_MODE.ON) {
      throw new Error('UvLight is already on, can\'t call `turnOnUvLight` again.');
    }
    this.status[FEATURES.UV] = this.SWITCH_MODE.ON;
    turnOnUvLight();
  },
  turnOffUvLight() {
    if (this.status[FEATURES.UV] === this.SWITCH_MODE.OFF) {
      throw new Error('UvLight is already off, can\'t call `turnOffUvLight` again.');
    }
    this.status[FEATURES.UV] = this.SWITCH_MODE.OFF;
    turnOffUvLight();
  },
  turnOnLed(color) {
    if (color === undefined) {
      throw new Error('`color` is required as first argument.');
    }
    if (this.status[FEATURES.LED] === this.SWITCH_MODE.ON) {
      throw new Error('Led is already on, can\'t call `turnOnLed` again.');
    }
    this.status[FEATURES.LED] = this.SWITCH_MODE.ON;
    turnOnLed(Color(color));
  },
  turnOffLed() {
    if (this.status[FEATURES.LED] === this.SWITCH_MODE.OFF) {
      throw new Error('Led is already off, can\'t call `turnOffLed` again.');
    }
    this.status[FEATURES.LED] = this.SWITCH_MODE.OFF;
    turnOffLed();
  },
  setLed(color) {
    if (color === undefined) {
      throw new Error('`color` is required as first argument.');
    }
    if (this.status[FEATURES.LED] === this.SWITCH_MODE.OFF) {
      throw new Error('Led is off and it\'s color cannot be set, can\'t call `setLed`.');
    }
    setLed(Color(color));
  }
};
