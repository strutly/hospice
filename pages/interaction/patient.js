
Page({
  data: {

  },
  onLoad(options) {

  },
  onShow() {    
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    });
    getApp().watch(function (value) {      
      that.setData({
        systemFontSize:value
      })      
    });
  },
})