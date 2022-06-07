var that;
import Api from "../../config/api";
Page({

  data: {
    detail:{}
  },

  async onLoad(options) {
    console.log(options)
    that = this;
    let res = await Api.getLetterDetail({
      id:options.id
    })
    that.setData({
      detail:res.data
    })
  },
  onShow() {    
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: e.target.dataset.srcs // 需要预览的图片http链接列表  
    })
  },
})