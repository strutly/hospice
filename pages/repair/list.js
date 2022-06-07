var that;
import Api from "../../config/api";
Page({
  data: {
    letters: [[], []],
    index: 0,
    pageNo: [0, 0],
    endline:[false,false]
  },
  onLoad(options) {
    that = this;
    that.getList(0, 1);
  },
  onShow() {    
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    })
  },
  async getList(index, page) {
    let param = {
      pageNo: page,
      type: 2      
    }
    if(that.data.reply){
      param.reply = that.data.reply;
    }
    console.log(index)
    let res = await Api.getLetter(param);
    let letters = that.data.letters;
    letters[index] = letters[index].concat(res.data.content);
    console.log(letters)
    let pageNo = that.data.pageNo;
    pageNo[index] = page;
    let endline = that.data.endline;
    endline[index] = res.data.last;
    that.setData({
      pageNo: pageNo,
      endline:endline,
      letters: letters
    });    
  },
  changeTab(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      index: index,
      reply: e.currentTarget.dataset.reply||null
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
      that.listRecord(index,pageNo);
    }
  }

})