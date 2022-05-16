var that;
import Api from "../../config/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:Api.domain,
    article:{},
    videoThumb:"",
    videoStyle:'position: absolute;left:0;top:0;'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this;
    that.video = that.selectComponent("#video");
    let articleRes = await Api.getArticleDetail({
      id:66
    });
    console.log(articleRes);
    
    let bingfangRes = await Api.getArticle({
      catalogId:34
    });
    let tuanduiRes = await Api.getArticle({
      catalogId:35
    })
    let ziyuanRes = await Api.getArticleDetail({
      id:68
    });

    that.setData({
      article:articleRes.data,
      ziyuan:ziyuanRes.data,
      bingfang:bingfangRes.data.content,
      tuandui:tuanduiRes.data.content
    })

  },  
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  onReady(){
    
  },
  onUnload(){
    console.log("停止播放");
    that.video.stop();
  },
  playVideo(e){
    console.log(e);
    that.video.playVideo(e.currentTarget.dataset.url);
    that.setData({videoThumb:"hide"});
  },
  previewImage(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  }
})