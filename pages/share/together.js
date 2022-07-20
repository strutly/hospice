var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  data: {

  },

  async onLoad(options) {
    that = this;
    that.listRecord(1);
  },
  async listRecord(pageNo) {
    let res = await Api.getTopRecord({source:1});
    console.log(res)
    that.setData({
      datas: res.data
    });
  },
  develop(){
    that.setData({
      show:true,
      msg:"该功能正在开发中~",
      type:"error"
    })
  }
}));