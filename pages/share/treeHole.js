var that;
import Api from "../../config/api";
Page({
  data: {
    datas:[]
  },
  onLoad(options) {
    that = this;
    that.listRecord();
  },
  async listRecord() {
    let res = await Api.getTopRecord({
      source:2
    });
    that.setData({
      datas: res.data
    });
  },  
  onShow() {    
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })   
  },
  toUrl(e){
    console.log(e);
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  search(){
    that.setData({
      search:!that.data.search,
      searchData:[]
    })
  },
  async submit(e){
    console.log(e);
    let msg = e.detail.value;
    if(!msg) return;
    let res = await Api.getRecord({
      source:0,
      msg:msg
    });
    that.setData({
      searchData:res.data.content
    })    
  }
})