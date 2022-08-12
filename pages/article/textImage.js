var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  /**
   * 页面的初始数据
   */
  data: {
    domain:Api.domain,
    article:{},
    videoThumb:"",
    videoStyle:'height:calc((100vw - 40rpx) * 0.5625);'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this;
    that.video = that.selectComponent("#video");
    let res = await Api.getMaterilaTree({
      id:53
    });
    that.setData({
      datas:res.data
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
    // that.video.playVideo(e.currentTarget.dataset.url);
    // that.setData({videoThumb:"hide"});
    wx.navigateTo({
      url: "/pages/article/detail?id=163"
    });
  },
  previewImage(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  }
}));