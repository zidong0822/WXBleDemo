
let deviceId = null;
let serviceId = null;
let characteristicId = null;
const serviceUUID = "0000FFF0-0000-1000-8000-00805F9B34FB";
let promiseResolve = null;
import common from './common.js';
const bleComm = {

  connectDevice: function () {

    return bleComm.open().then(res => {
      return bleComm.getStatus();
    }).then(res => {
      return bleComm.startScan();
    }).then(res => {
      return bleComm.getDevices();
    }).then(res => {
      return bleComm.foundDevice();
    }).then(res => {
      return bleComm.stopScan();
    }).then(res => {
      return bleComm.connect();
    }).then(res => {
      return bleComm.getServices();
    }).then(res => {
      return bleComm.getCharacteristics();
    }).then(res => {
      return bleComm.registerNotify();
    })
  },

  open: function (e) {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    })
  },
  getStatus: function (e) {
    return new Promise((resolve, reject) => {
      wx.getBluetoothAdapterState({
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  startScan: function (e) {
    return new Promise((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        services: [serviceUUID],
        allowDuplicatesKey: true,
        interval: 1,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  getDevices: function (e) {
    return new Promise((resolve, reject) => {
      wx.getBluetoothDevices({
        success: (res) => {
          console.log("getDevices", res)
          resolve(res);
        }, fail: (err) => {
          reject(err);
        }
      })
    })
  },
  foundDevice: function (res) {
    return new Promise((resolve, reject) => {
      wx.onBluetoothDeviceFound(
        (res) => {
          for (var i = 0; i < res.devices.length; i++) {
            var device = res.devices[i];
            console.log(Math.abs(device.RSSI));
            if (Math.abs(device.RSSI) < 50) {
              deviceId = device.deviceId;
              resolve(res);
            }
          }
        }, (err) => {
          reject(err);
        })
    })
  },
  stopScan: function (e) {
    return new Promise((resolve, reject) => {
      wx.stopBluetoothDevicesDiscovery({
        success: (res) => {
          resolve(e);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  connect: function (e) {
    return new Promise((resolve, reject) => {
      wx.createBLEConnection({
        deviceId: deviceId,
        success: (res) => {
          resolve(deviceId);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },
  getServices: function (e) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: (res) => {
          for (var i = 0; i < res.services.length; i++) {
            if (res.services[i].uuid == serviceUUID) {
              serviceId = res.services[i].uuid;
              resolve(res);
            }
          }
        }
      })
    })
  },
  getCharacteristics: function (e, f) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: serviceId,
        success: (res) => {
          for (var i = 0; i < res.characteristics.length; i++) {
            characteristicId = res.characteristics[i].uuid;
            resolve(res);
          }
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  },
  registerNotify: function (e) {
    return new Promise((resolve, reject) => {
      wx.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        success: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err);

        }
      })
    })
  },
  writeValue: function (string) {
    return new Promise((resolve, reject) => {
      wx.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        value: common.stringToArrayBuffer(string),
        success: (res) => {
          promiseResolve = resolve;
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  },
  
  disConnect: function (e) {
    return new Promise((resolve, reject) => {
      wx.closeBLEConnection({
        deviceId: deviceId,
        success: function (res) {
          resolve(res);
        },
        error: (err) => {
          reject(err);

        }
      })
    })
  }
}

wx.onBLECharacteristicValueChange((characteristic) => {
  console.log(common);
    promiseResolve(common.arrayBufferToString(characteristic.value));
    promiseResolve = null;
 })




export default bleComm;