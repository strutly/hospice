// pages/share/album.js
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来
var oys={},page = basePage.buildBasePage.call(this,oys),that;
Page(Object.assign({},page,{
  data: {
    pics:['https://this.tsing-care.com/thumb/20220719/57cc90973c7e9fdd8aeabb7317d285e1-111dxqqe2zel5rmjh61.jpeg']
  },
  onLoad(options) {
    page.onLoad.call(this,options);
    this.setData({value:this.data.pics.join()});
  },
  onShow() {
    page.onShow.call(this);
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
  }
}));