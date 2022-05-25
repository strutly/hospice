var that;
import Api from "../../config/api";
Page({
  data: {
    domain:Api.domain,
    article:{}
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getMaterilaDetail({
      id:options.id
    });    
    that.setData({
      article:res.data
    })
  },
  onShow() {
    this.setData({
      systemFontSize: wx.getStorageSync('systemFontSize') || "14px"
    })
  },
  
  onShareAppMessage(){
    return {
      title: that.data.article.name,
      path: '/pages/article/detail?id='+that.data.article.id
    }
  }

})