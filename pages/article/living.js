var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  /**
   * 页面的初始数据
   */
  data: {
    open:[]
  },
  async onLoad(options) {
    console.log(options)
    that = this;
    let res = await Api.getMaterilaTree({
      id:options.id
    });
    console.log(res)
    that.setData({
      listData:res.data
    })
  },
  more(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let open = that.data.open;
    open[index] = true;
    that.setData({
      open:open
    })
  }

}));