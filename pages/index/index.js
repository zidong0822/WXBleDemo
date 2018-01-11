//index.js
//获取应用实例
import common  from '../../utils/common.js';
import bleComm from '../../utils/bleComm.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
  },
  onUnload: function () {
    bleComm.disConnect();
  },
  onHide: function () {
    bleComm.disConnect();
  },
  onLoad:function(){

    console.log(document)
    
  },
  connectDevice: function () {
    wx.showLoading({title: '靠近连接',})
    bleComm.connectDevice().then(res => {
      wx.hideLoading()
    });

    

    wx.onBLECharacteristicValueChange((characteristic) => {
      console.log(common.arrayBufferToString(characteristic.value))
    })

  },
  sendData: function () {
  
    bleComm.writeValue("mcookie").then (res =>{
      this.setData({motto:res});
    })
  },
})





