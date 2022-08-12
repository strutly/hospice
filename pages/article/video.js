var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  data: {
    domain:Api.domain
  },

  async onLoad(options) {
    that = this;
    that.video = that.selectComponent("#video");
    let res = await Api.getCatalogVideo({
      catalogId:options.id
    });
    console.log(res);
    that.setData({
      articles:res.data.content,
      title:options.title
    })
  },
  playVideo(e){
    console.log(e);
    // that.video.playVideo(e.currentTarget.dataset.url);
    // that.video.fullScreen();
    that.setData({vid:e.currentTarget.dataset.url})
  }
}));