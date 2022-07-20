var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    domain:Api.domain,
    article:{},
    loading:true
  },
  async onLoad(options) {
    console.log("onload")
    that = this;
    let res = await Api.getMaterilaDetail({
      id:options.id
    });
    let article = res.data;
    if(article && article.url){
      article.url = article.url.replace(/&amp;/g, '&');
      article.oldUrl = article.oldUrl.replace(/&amp;/g, '&');
    }
    that.setData({
      loading:false,
      article:article
    })
  },

  onShareAppMessage(){
    return {
      title: that.data.article.name,
      path: '/pages/article/detail?id='+that.data.article.id
    }
  },
  loadsuccess(){
    that.setData({
      loading:false
    })
  }
}));