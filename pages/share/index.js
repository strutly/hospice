var that;
import Api from "../../config/api";
Page({
  data: {
    horseRaceLampList: [{text: '51淘甄貨,一个可以省钱的购物平台'}],          // 跑马灯内容
    marqueePace: 1,             // 跑马灯滚动速度
    marqueeDistance: 0,           // 跑马灯滚动距离
    interval: 20,               // 跑马灯时间间隔
    orientation: 'left',        // 跑马灯滚定方向
    size: 14,
    datas:[]
  },
  onLoad(options) {
    that = this;
    that.listRecord(1);
  },
  async listRecord(pageNo) {
    let param = {
      pageNo: pageNo,
      pageSize:4
    }
    let res = await Api.getRecord(param);
    that.setData({
      pageNo: pageNo,
      endline: res.data.last,
      datas: res.data.content
    });
  },  
  onShow() {
    console.log("show11")
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })   
  },
  toUrl(e){
    console.log(e);
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})