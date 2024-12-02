var that;// pages/index/identity.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    msg:"",
    type:"error",
    titleArr:[{
      title:"我是患者",
      icon:"id-1.png",
      url:"/pages/lifeDeath/patient"
    },{
      title:"我是家属",
      icon:"id-2.png",
      url:"/pages/lifeDeath/family"
    },{
      title:"专业人士",
      icon:"id-3.png",
      url:"/pages/professional/professional"
    },{
      title:"我是路人",
      icon:"id-4.png",
      url:"/pages/lifeDeath/stranger"
    }]
  },
  onLoad(options) {
    that = this;
    page.onLoad.call(this);
  },
  showTips(){
    console.log(2)
    that.setData({
      show:true,
      type:"error",
      msg:"该功能开发中~"
    })
  }
}));