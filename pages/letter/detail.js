var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  data: {
    detail:{}
  },

  async onLoad(options) {
    console.log(options)
    that = this;
    let res = await Api.getLetterDetail({
      id:options.id
    })
    that.setData({
      detail:res.data
    })
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: e.target.dataset.srcs // 需要预览的图片http链接列表
    })
  },
}));