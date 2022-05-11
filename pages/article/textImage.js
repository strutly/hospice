var that;
import Api from "../../config/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this;
    let articleRes = await Api.getArticleDetail({
      id:66
    });
    console.log(articleRes)
  },  
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  }
})