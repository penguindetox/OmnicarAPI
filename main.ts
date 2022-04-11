const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

device.listPairedDevices(console.log);
