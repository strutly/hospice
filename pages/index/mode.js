// pages/index/mode.js
Page({

  data: {

  },

  onLoad(options) {

  },
  mode(e){
    console.log(e);
    let mode = e.currentTarget.dataset.mode;
    wx.setStorageSync('systemFontSize', mode==1?'20px':'14px');
    wx.navigateTo({
      url: '/pages/index/identity',
    })
  }
})