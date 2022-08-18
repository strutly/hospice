var that, yuelineChart;
import Api from "../../../config/api";
var basePage = require("../../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {

  },

  onLoad(options) {
    that = this;
    that.setData(options)
    that.getList(1);
  },
  onShow() {
    page.onShow.call(this);
  },
  async getList(pageNum){
    let lists = that.data.lists||[];
    let pid = that.data.pid;
    let fid = that.data.fid;
    let res = await Api.getEvaluationPage({
      pid:pid,
      fid:fid,
      pageNum:pageNum    
    })
    console.log(res);
    that.setData({
      pageNum:pageNum,
      lists:lists.concat(res.data.content),  
    })
  },
  onReachBottom() {
    let endline = that.data.endline;
    if(!endline){
      let pageNum = that.data.pageNum + 1;
      that.getList(pageNum);
    }
  },

}))