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
    let res = await Api.getMaterilaTree({
      id:options.id
    });
    that.setData({
      listData:res.data
    })
  },  
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  }
})