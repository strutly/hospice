// pages/index/mode.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  data: {

  },

  onLoad(options) {

  },
  mode(e){
    console.log(e);
    let mode = e.currentTarget.dataset.mode;
    wx.setStorageSync('systemFontSize', mode==1?'20px':'14px');
    wx.navigateTo({
      url: '/pages/index/identity',
    })
  }
}));