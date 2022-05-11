var that;// pages/index/identity.js
Page({
  data: {
    msg:"",
    type:"error"
  },
  onLoad(options) {
    that = this;
  },
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    });
    getApp().watch(function (value) {
      that.setData({
        systemFontSize:value
      })      
    });
  },
  showTips(){
    console.log(2)
    that.setData({
      show:true,
      type:"error",
      msg:"该功能开发中~"
    })
  },
  change(){
    console.log(1)
    let systemFontSize = wx.getStorageSync('systemFontSize')||"14px";
    systemFontSize = systemFontSize=="14px"?'22px':'14px'
    that.setData({
      systemFontSize:systemFontSize
    })
    wx.setStorageSync('systemFontSize', systemFontSize);
  }
})