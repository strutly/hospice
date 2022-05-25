const app = getApp();
import util from '../../utils/util.js';
import Api from '../../config/api.js';
var that;
Page({
  data: {
    index: 0,
    endline: false,
    datas: [],
  },
  async onLoad(options) {
    that = this;
    that.setData({
      options: options,
      datas: [],
      endline: false
    });
    that.listRecord(1);
  },
  async listRecord(pageNo) {
    let datas = that.data.datas;
    let param = {
      pageNo: pageNo
    }
    if (that.data.options.type) {
      param.type = that.data.options.type
    }
    let res = await Api.getRecord(param);
    console.log(res)
    that.setData({
      pageNo: pageNo,
      endline: res.data.last,
      datas: datas.concat(res.data.content)
    });
  },
  cancle() {
    that.setData({
      auth: false
    })
  },
  showTips(msg, type = "error") {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  async auth(e) {
    let res = {};
    try {
      res = await wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })
    } catch (error) {
      return that.showTips("授权失败,请重试~", "error");
    }
    let code = await api.getCode();
    console.log(res)
    if (res.errMsg == "getUserProfile:ok") {
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo);
      let authRes = await Api.auth({
        code: code,
        encryptedData: res.encryptedData,
        iv: res.iv,
        signature: res.signature,
        rawData: res.rawData
      });

      wx.setStorageSync('auth', true);
      if (authRes.code == 0) {
        that.setData({
          auth: false
        })

      } else {
        that.showTips(authRes.msg);
      }
    } else {
      that.showTips("授权失败,请重试~");
    }
  },
  onReachBottom() {
    console.log(123)
    let endline = that.data.endline;
    if (!endline) {
      let pageNo = that.data.pageNo + 1;
      that.listRecord(pageNo);
    }
  }
})
