var that;
import Api from "../../config/api";
Page({

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
  onShow() {
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  more(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let open = that.data.open;
    open[index] = !open[index];
    that.setData({
      open:open
    })
  }

})