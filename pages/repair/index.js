// pages/letter/index.js
Page({

  data: {

  },

  onLoad(options) {

  },
  onShow() {    
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  }
})