var api = require("../../config/api.js");

var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys),that,topTips;
Page(Object.assign({},page,{
	onLoad(options) {
    page.onLoad.call(this,options);
    that=this;
    topTips = that.selectComponent("#topTips1");
    // that.topTips1.alert("下载中",null,0);that.topTips1.hide();
  },
  onShow() {
    page.onShow.call(this);
  },
  formSubmit: async function (e) {
    console.log(e)
    let data = e.detail.value;
    console.log(this.data.picStatus);
    if(this.data.picStatus){topTips.error("图片还没上传完成");return;}
    if(!this.data.pic){topTips.error("请上传图片");return;}
    data.pic = this.data.pic;
    let tmpID = "XuBxtKxQV_qQayW4HYX8lcfrFIzsAEs_pmcpL_OHUZQ";
    let tmpResp = await wx.requestSubscribeMessage({
      tmplIds: [tmpID]
    })
    console.log(tmpResp);
    data.ifAccept = tmpResp[tmpID] === 'accept' ? true : false;
    let res = await api.addFeedBack(data);
    if(res.code==0){
      topTips.alert("提交成功,客服处理后通知您",function(e){wx.navigateBack({
        delta: 1,
      })},3000);
    }
  }
}));