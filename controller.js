const args = process.argv.slice(2);
const isMock = args.indexOf('-m') !== -1;

let pressPower;
let releasePower;

if (isMock) {
  pressPower = () => {
    console.log('pressing power!');
  };
  releasePower = () => {
    console.log('releasing power!');
  };
} else {
  // Optional dependency, won't be available on any machine other than rpi
  // eslint-disable-next-line
  const gpio = require('rpi-gpio');

  gpio.setup(17, gpio.DIR_OUT, () => {
    process.on('SIGINT', () => {
      gpio.destroy(() => {
        console.log('All pins unexported');
      });
    });
    pressPower = () => {
      gpio.write(17, true, err => {
        if (err) throw err;
        console.log('pressing power!');
      });
    };
    releasePower = () => {
      gpio.write(17, false, err => {
        if (err) throw err;
        console.log('releasing power!');
      });
    };
  });
}

module.exports = {
  AUTO_RELEASE: 5000,
  POWER_MODES: {
    PRESSED: 0,
    NOT_PRESSED: 1
  },
  pressPower() {
    if (this._powerMode === this.POWER_MODES.PRESSED) {
      throw new Error('Power is already pressed, can\'t call `pressPower` again.');
    }
    this._powerMode = this.POWER_MODES.PRESSED;
    pressPower();
    setTimeout(() => {
      if (this._powerMode === this.POWER_MODES.PRESSED) {
        this._releasePower();
      }
    }, this.AUTO_RELEASE);
    return this._releasePower.bind(this);
  },
  _releasePower() {
    if (this._powerMode === this.POWER_MODES.NOT_PRESSED) {
      throw new Error(`Power is already released, can't call \`releasePower\` again, might been called after program auto released the button (after ${this.AUTO_RELEASE}ms).`);
    }
    this._powerMode = this.POWER_MODES.NOT_PRESSED;
    releasePower();
  }
};
