// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    systemFontSize:"14px"
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    
  },
  onShow() {
    console.log("show")
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  }
})
