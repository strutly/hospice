var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
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
}));