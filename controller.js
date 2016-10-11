const { AUTO_RELEASE, POWER_MODES } = require('./constant.js');

// const args = process.argv.slice(2);
// const isMock = args.indexOf('-m') !== -1;

module.exports = {
  _powerMode: POWER_MODES.NOT_PRESSED,
  _releasePower() {
    if (this._powerMode === POWER_MODES.NOT_PRESSED) {
      throw new Error(`Power is already released, can't call \`releasePower\` again, might been called after program auto released the button (after ${AUTO_RELEASE}ms).`);
    }
    this._powerMode = POWER_MODES.NOT_PRESSED;
    console.log('releasing power!');
  },
  pressPower() {
    if (this._powerMode === POWER_MODES.PRESSED) {
      throw new Error('Power is already pressed, can\'t call `pressPower` again.');
    }
    this._powerMode = POWER_MODES.PRESSED;
    console.log('pressing power!');
    setTimeout(() => {
      if (this._powerMode === POWER_MODES.PRESSED) {
        this._releasePower();
      }
    }, AUTO_RELEASE);
    return this._releasePower.bind(this);
  }
};
