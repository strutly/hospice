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
    let article = res.data;
    if(article && article.url){
      article.url = article.url.replace(/&amp;/g, '&');
      article.oldUrl = article.oldUrl.replace(/&amp;/g, '&');
    }
    that.setData({
      article:article
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