var that;
Page({

  data: {

  },

  onLoad(options) {
    that = this;
  },
  onShow() {    
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  develop(){
    that.setData({
      show:true,
      msg:"该功能正在开发中~",
      type:"error"
    })
  }
})