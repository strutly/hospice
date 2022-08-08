var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys),that;
Page(Object.assign({},page,{
	onLoad(options) {
    page.onLoad.call(this,options);
    that=this;
    that.topTips1 = that.selectComponent("#topTips1");
    // that.topTips1.alert("下载中",null,0);that.topTips1.hide();
  },
  onShow() {
    page.onShow.call(this);
  }
}));