// index.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来
var obj={},page = basePage.buildBasePage.call(this,obj),that;
Page(Object.assign({},page,{
  data: {
    systemFontSize:"14px"
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
    page.onShow.call(this);
    // var fontsize = parseInt(wx.getStorageSync('systemFontSize'));
    // if(fontsize>16){fontsize=18;}else{fontsize=16;}console.log(obj)
    // obj.that.setData({
    //   systemFontSize:fontsize+"px"
    // })
  }
}));
