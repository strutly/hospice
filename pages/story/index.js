var that;
import Api from '../../config/api';
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{

  data: {
    navs:["全部","亲历的身边事","影音中的故事"],
    types:[null,0,1],
    tabIndex:0,
    stores: [[], [],[]],
    pageNo: [0, 0,0],
    endline:[false,false,false]
  },

  onLoad(options) {
    that = this;

  },
  async getList(index, page) {
    let param = {
      pageNo: page,
      source:3
    }
    if(that.data.type!=null){
      param.type = that.data.type;
    }
    console.log(index)
    let res = await Api.getRecord(param);

    let stores = that.data.stores;
    stores[index] = stores[index].concat(res.data.content);
    console.log(stores)
    let pageNo = that.data.pageNo;
    pageNo[index] = page;
    let endline = that.data.endline;
    endline[index] = res.data.last;
    that.setData({
      pageNo: pageNo,
      endline:endline,
      stores: stores
    });
  },
  onShow() {
    that.setData({stores: [[], [],[]]});
    that.getList(0,1);
    page.onShow.call(this);
  },
  tabSelect(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex:index,
      type:e.currentTarget.dataset.type
    })
    if (!that.data.pageNo[index]) {
      that.getList(index, 1);
    }
  },
  onReachBottom() {
    let endline = that.data.endline;
    let index = that.data.tabIndex;
    if(!endline[index]){
      let pageNo = that.data.pageNo[index] + 1;
      that.getList(index,pageNo);
    }
  }


}));