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
    })
  },
  showTips(){
    console.log(2)
    that.setData({
      show:true,
      type:"error",
      msg:"该功能开发中~"
    })
  }
})