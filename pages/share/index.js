var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys),source;
Page(Object.assign({},page,{
  data: {
    datas:[
    ],
    types:[['这一口有味道#','这一眼还可以#','这一句让我感动#','这个瞬间非常留恋#'],
      [],[],['亲历身边事','影音中的故事'],['自我照护经验分享','病人照护经验分享','求助贴']],
    sources:['分享社区','其言也善','树洞','生命故事叙事','照护经验分享'],
    colors:["#FE6756","#4DA5FE","#47BD9B","#CA93CA"]
  },
  onLoad(options) {
    that = this;
    source= options.source||0;
    that.setData({
      source:source
    });
    // that.listRecord();
  },
  onShow(){
    page.onShow.call(this);
    that.listRecord();
  },
  async listRecord() {
    let res = await Api.getTopRecord({source:source});
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
      source:source,
      msg:msg
    });
    that.setData({
      searchData:res.data.content
    })
  }
}));