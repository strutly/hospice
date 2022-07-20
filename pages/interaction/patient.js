
var that, timeInterval;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    topText: ""
  },
  onLoad(options) {
    that = this;
  },
  onShow() {
    page.onShow.call(this);
    /*
    var text = '生命的流逝，就像河流入海，在人生长河中，让我们互相支持，彼此欣赏。品当下生活滋味，集生活点滴过往，寄真挚祝福、期望……';
    var i = 0;
    timeInterval = setInterval(function () {
      var topText = that.data.topText;
      if (topText.length == text.length) {
        i = 0;
        that.setData({ topText: "" });
      } else {
        i++;
        that.setData({ topText: text.substr(0, i) });
      }
    }, 200);
    */
  }
}));