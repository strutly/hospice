
var that, timeInterval;
Page({
  data: {
    topText: ""
  },
  onLoad(options) {
    that = this;
  },
  onShow() {
    that.setData({
      systemFontSize: wx.getStorageSync('systemFontSize') || "14px"
    });
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
})