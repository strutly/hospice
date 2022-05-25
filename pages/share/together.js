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
    let param = {
      pageNo: pageNo,
      pageSize:4,
      source:1
    }
    let res = await Api.getRecord(param);
    console.log(res)
    that.setData({
      pageNo: pageNo,
      endline: res.data.last,
      datas: res.data.content
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