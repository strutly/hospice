// pages/share/index.js
Page({
  data: {
    horseRaceLampList: [{text: '51淘甄貨,一个可以省钱的购物平台'}],          // 跑马灯内容
    marqueePace: 1,             // 跑马灯滚动速度
    marqueeDistance: 0,           // 跑马灯滚动距离
    interval: 20,               // 跑马灯时间间隔
    orientation: 'left',        // 跑马灯滚定方向
    size: 14
  },
  onLoad(options) {

  },  
  onShow() {
    console.log("show11")
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  
    let _this = this;
    // 跑马灯
    let horseRaceLampListLength = 0;
    _this.data.horseRaceLampList.forEach((item, index) => {
      horseRaceLampListLength += item.text.length;
    })
    let horseRaceLampTextLength = horseRaceLampListLength * _this.data.size + (_this.data.horseRaceLampList.length * 80 - 20);
    let windowWidth = wx.getSystemInfoSync().windowWidth;               // 获取屏幕宽度
    _this.runMarquee(horseRaceLampTextLength, windowWidth)
  },
    /**
   * 跑马灯
   */
  runMarquee: function(horseRaceLampTextLength, windowWidth) {
    let _this = this;
    var interval = setInterval(function() {
      // 内容一直到末端
      if(-_this.data.marqueeDistance < horseRaceLampTextLength) {
        _this.setData({
          marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace
        })
      } else {
        clearInterval(interval)
        _this.setData({
          marqueeDistance: windowWidth
        })
        _this.runMarquee(horseRaceLampTextLength, windowWidth)
      }
    }, _this.data.interval)
  }

})