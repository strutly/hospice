// pages/life/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },  
  onShow() {
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  }
})