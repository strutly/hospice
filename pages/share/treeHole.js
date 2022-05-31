var that;
import Api from "../../config/api";
Page({
  data: {
    datas:[]
  },
  onLoad(options) {
    that = this;
    that.listRecord(1);
  },
  async listRecord(pageNo) {
    let param = {
      pageNo: pageNo,
      pageSize:4,
      source:2
    }
    let res = await Api.getRecord(param);
    that.setData({
      pageNo: pageNo,
      endline: res.data.last,
      datas: res.data.content
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