const SerialPort = require('serialport');

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

const port = new SerialPort('/dev/cu.Bluetooth-Incoming-Port', {
  'baudRate': 57600
});

port.on('open', () => {
  port.write('main screen turn on', err => {
    if (err) {
      console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});

// open errors will be emitted as an error event
port.on('error', err => {
  console.log('Error: ', err.message);
});
