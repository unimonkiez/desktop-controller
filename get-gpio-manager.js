const { FEATURES } = require('./constant.js');

const args = process.argv.slice(2);
const isMock = args.indexOf('-m') !== -1;

let gpio;
if (!isMock) {
  // Optional dependency, won't be available on any machine other than rpi
  // eslint-disable-next-line global-require, import/no-unresolved, import/no-extraneous-dependencies
  gpio = require('rpi-gpio');
}

module.exports = (activatedFeatures, featurePins) => new Promise(_resolve => {
  const initialzationPromises = [];

  const internalInterface = {
    pressPower: () => { throw new Error('Not initialized yet.'); },
    releasePower: () => { throw new Error('Not initialized yet.'); },
    pressReset: () => { throw new Error('Not initialized yet.'); },
    releaseReset: () => { throw new Error('Not initialized yet.'); },
    turnOnWifi: () => { throw new Error('Not initialized yet.'); },
    turnOffWifi: () => { throw new Error('Not initialized yet.'); },
    turnOnUvLight: () => { throw new Error('Not initialized yet.'); },
    turnOffUvLight: () => { throw new Error('Not initialized yet.'); },
    turnOnLed: () => { throw new Error('Not initialized yet.'); },
    setLed: () => { throw new Error('Not initialized yet.'); },
    turnOffLed: () => { throw new Error('Not initialized yet.'); }
  };

  const initializeGpioOnOffFn = (feature, onFunctionName, offFunctionName) => {
    if (activatedFeatures.indexOf(feature) !== -1) {
      if (isMock) {
        internalInterface[onFunctionName] = () => new Promise(resolve => {
          console.log(`"${onFunctionName}" was called.`);
          resolve();
        });
        internalInterface[offFunctionName] = () => new Promise(resolve => {
          console.log(`"${offFunctionName}" was called.`);
          resolve();
        });
      } else {
        const pin = featurePins[feature][0];
        initialzationPromises.push(
          new Promise((resolve, reject) => {
            gpio.setup(pin, gpio.DIR_OUT, setupErr => {
              if (setupErr) reject(setupErr);
              resolve();
            });
          }).then(() => {
            internalInterface[onFunctionName] = () => new Promise((resolve, reject) => {
              console.log(`"${onFunctionName}" was called.`);
              gpio.write(pin, true, err => {
                if (err) reject(err);
                console.log(`"${onFunctionName}" has finished.`);
                resolve();
              });
            });
            internalInterface[offFunctionName] = () => new Promise((resolve, reject) => {
              console.log(`"${offFunctionName}" was called.`);
              gpio.write(pin, false, err => {
                if (err) reject(err);
                console.log(`"${offFunctionName}" has finished.`);
                resolve();
              });
            });
          })
        );
      }
    }
  };

  initializeGpioOnOffFn(FEATURES.POWER, 'pressPower', 'releasePower');
  initializeGpioOnOffFn(FEATURES.RESET, 'pressReset', 'releaseReset');
  initializeGpioOnOffFn(FEATURES.WIFI, 'turnOnWifi', 'turnOffWifi');
  initializeGpioOnOffFn(FEATURES.UV, 'turnOnUvLight', 'turnOffUvLight');

  if (activatedFeatures.indexOf(FEATURES.LED) !== -1) {
    if (isMock) {
      internalInterface.turnOnLed = (r, g, b) => new Promise(resolve => {
        console.log(`\`turnOnLed\` was called with color - (${r}, ${g}, ${b}).`);
        resolve();
      });
      internalInterface.turnOffLed = () => new Promise(resolve => {
        console.log('`turnOffLed` was called.');
        resolve();
      });
      internalInterface.setLed = (r, g, b) => new Promise(resolve => {
        console.log(`\`setLed\` was called with color - (${r}, ${g}, ${b}).`);
        resolve();
      });
    } else {
      const pins = featurePins[FEATURES.LED];

      initialzationPromises.push(
        Promise.all(
          pins.map(pin => new Promise((resolve, reject) => {
            gpio.setup(pin, gpio.DIR_OUT, setupErr => {
              if (setupErr) reject(setupErr);
              resolve();
            });
          }))
        ).then(() => {
          internalInterface.turnOnLed = (r, g, b) => {
            const pinValues = [r, g, b]; // Matches order in "pins"
            return Promise.all(
              pins.map((pin, pinIndex) => new Promise((resolve, reject) => {
                console.log('"turnOnLed" was called.');
                gpio.write(pin, pinValues[pinIndex] / 255, err => {
                  if (err) reject(err);
                  console.log('"turnOnLed" has finished.');
                  resolve();
                });
              }))
            );
          };
          internalInterface.turnOffLed = () => Promise.all(
            pins.map(pin => new Promise((resolve, reject) => {
              console.log('"turnOffLed" was called.');
              gpio.write(pin, false, err => {
                if (err) reject(err);
                console.log('"turnOffLed" has finished.');
                resolve();
              });
            }))
          );
          internalInterface.setLed = (r, g, b) => {
            const pinValues = [r, g, b]; // Matches order in "pins"
            return Promise.all(
              pins.map((pin, pinIndex) => new Promise((resolve, reject) => {
                console.log('"turnOnLed" was called.');
                gpio.write(pin, pinValues[pinIndex] / 255, err => {
                  if (err) reject(err);
                  console.log('"turnOnLed" has finished.');
                  resolve();
                });
              }))
            );
          };
        })
      );
    }
  }
  return Promise.all(initialzationPromises).then(() => _resolve(internalInterface));
});
