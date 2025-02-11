// pages/wish/wish.js
import Api from "../../config/api";
var that;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  /**
   * 页面的初始数据
   */
  data: {
    wishwin:"",
    isWish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    let formData = {msg:"" };
    that.setData({
      formData: formData
    })
  },
  showWish(){
    this.setData({wishwin:"wishShow"});
  },
  async addWish() {
    let formData = that.data.formData
    console.log(formData);
    if (formData.msg == "") {
      return that.topTips("请输入内容后再提交", 'error');
    }
    let res = await Api.addWish(JSON.stringify(formData));
    if (res.code == 0) {
      this.setData({wishwin:"wishHide"});
      setTimeout(function(){that.setData({wishwin:"",isWish:true});
        (function(){that.setData({pingzismall:"pingzismall"});
          setTimeout(function(){that.setData({pingzismall:"",isWish:false,['formData.msg']:""});},2000);
        })();
      },500);
      that.topTips("许愿成功", "success");
    } else {
      that.topTips(res.msg, "error");
    }
  },
  topTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  bindTextAreaBlur(e) {
    console.log(e);
    that.setData({
      ['formData.msg']: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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