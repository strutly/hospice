import Api from "../../config/api";
var that;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
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
  develop(){
    that.setData({
      show:true,
      msg:"该功能正在开发中~",
      type:"error"
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
    let title = e.detail.value;
    if(!title) return that.setData({
      msg:"请输入关键词再搜索",
      show:true
    })
    let res = await Api.searchMaterila({
      source:0,
      title:e.detail.value
    });
    that.setData({
      searchData:res.data
    })
  }
}));