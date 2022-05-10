var that;
import Api from "../../config/api";
Page({

  data: {
    domain:Api.domain
  },

  async onLoad(options) {
    that = this;
    let res = await Api.getCatalogVideo({
      catalogId:options.id
    });
    console.log(res);
    that.setData({
      articles:res.data.content,
      title:options.title
    })
  },  
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  playVideo(e){
    console.log(e);
    that.video.playVideo(e.currentTarget.dataset.url);    
  }
})