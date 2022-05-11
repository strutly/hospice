import Api from "../../config/api";
var that;
Page({
  data: {
    domain:Api.domain,
    cardCur: 0,
    swiperList: [],
    dotStyle: false,
    towerStart: 0,
    direction: ''
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getArticle({
      catalogId:32
    });
    that.setData({
      swiperList:res.data.content
    })
  },   
  onShow() {    
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    });
    getApp().watch(function (value) {      
      that.setData({
        systemFontSize:value
      })      
    });
  },
})