// pages/share/album.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来
var oys={},page = basePage.buildBasePage.call(this,oys),that;
Page(Object.assign({},page,{
  data: {
    
  },
  onLoad(options) {
    page.onLoad.call(this,options);
  },
  onShow() {
    page.onShow.call(this);
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
  }
}));