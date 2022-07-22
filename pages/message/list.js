var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    datas: [[], [],[]],
    index: 0,
    pageNo: [0, 0,0],
    endline:[false,false,false]
  },
  async onLoad(options) {
    that = this;
    that.getList(0,1);
  },
  
  async getList(index, page) {
    let param = {
      pageNo: page,
      type: 1
    }
    if(that.data.stauts){
      param.status = that.data.stauts;
    }
    console.log(index)
    let res = await Api.getPageMessage(param);
    let datas = that.data.datas;
    datas[index] = datas[index].concat(res.data.content);
    console.log(datas)
    let pageNo = that.data.pageNo;
    pageNo[index] = page;
    let endline = that.data.endline;
    endline[index] = res.data.last;
    that.setData({
      pageNo: pageNo,
      endline:endline,
      datas: datas
    });
  },
  changeTab(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      index: index,
      stauts: e.currentTarget.dataset.stauts||null
    })
    if (!that.data.pageNo[index]) {
      that.getList(index, 1);
    }
  },
  onReachBottom() {
    let endline = that.data.endline;
    let index = that.data.index;
    if(!endline[index]){
      let pageNo = that.data.pageNo[index] + 1;
      that.getList(index,pageNo);
    }
  }
}));