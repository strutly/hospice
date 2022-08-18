var that;// pages/index/identity.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    msg:"",
    type:"error"
  },
  onLoad(options) {
    that = this;
    page.onLoad.call(this);
  },
  showTips(){
    console.log(2)
    that.setData({
      show:true,
      type:"error",
      msg:"该功能开发中~"
    })
  }
  // ,change(){
  //   console.log(1)
  //   let systemFontSize = wx.getStorageSync('systemFontSize')||"14px";
  //   systemFontSize = systemFontSize=="14px"?'20px':'14px'
  //   that.setData({
  //     systemFontSize:systemFontSize
  //   })
  //   wx.setStorageSync('systemFontSize', systemFontSize);
  // }
}));