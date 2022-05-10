var that;
import Api from "../../config/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this;
    let res = await Api.getArticle({
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
  }
})