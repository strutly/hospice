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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    that = this;
    let res = await Api.getMaterilaTree({
      id:128
    });
    that.setData({
      listData:res.data
    })
  },
  topTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  detail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/article/detail?id="+id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    page.onShow.call(this);
    var fontsize = parseInt(wx.getStorageSync('systemFontSize'));
    if(fontsize>16){fontsize=18;}else{fontsize=16;}
    that.setData({
      systemFontSize:fontsize+"px"
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
}));