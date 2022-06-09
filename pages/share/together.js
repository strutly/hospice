var that;
import Api from "../../config/api";
Page({

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
  onShow() {    
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  develop(){
    that.setData({
      show:true,
      msg:"该功能正在开发中~",
      type:"error"
    })
  }
})