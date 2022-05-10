
var that, interval;
import Api from "../../config/api";
Page({
  data: {
    horseRaceLampList: [],// 跑马灯内容
    marqueePace: 1,// 跑马灯滚动速度
    marqueeDistance: 0,// 跑马灯滚动距离
    interval: 20,// 跑马灯时间间隔
    orientation: 'left',// 跑马灯滚定方向
    firework: false,
    size: 14,
    canIUseGetUserProfile: false,
    authModal: false,
    auth: wx.getStorageSync('auth') || false
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getBarrage({
      pageSize: 10
    });
    console.log(res);
    if (res.code == 0) {
      that.setData({
        horseRaceLampList: res.data.content
      });
      let windowWidth = wx.getSystemInfoSync().windowWidth;               // 获取屏幕宽度
      that.runMarquee(windowWidth)
    }
  },
  onShow() {
    that.setData({
      systemFontSize: wx.getStorageSync('systemFontSize') || "14px"
    });
    if (interval) {
      clearInterval(interval);
    }
  },
  runMarquee: function (windowWidth) {
    interval = setInterval(function () {
      // 内容一直到末端
      if (-that.data.marqueeDistance < windowWidth) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace
        })
      } else {
        clearInterval(interval)
        that.setData({
          marqueeDistance: windowWidth
        })
        that.runMarquee(windowWidth)
      }
    }, that.data.interval)
  },
  onReady() {
    getApp().watch(function (value) {
      that.setData({
        systemFontSize: value
      })
    });
  },
  develop() {
    that.setData({
      show: true,
      msg: "该功能正在开发中~",
      type: "error"
    })
  },
  authModal() {
    that.setData({
      authModal: !that.data.authModal
    })
  },
  showTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  async getUserProfile(e) {
    console.log(e);
    that.authModal();

    let userInfo = await wx.getUserProfile({ desc: '用于完善会员资料' });
    if (userInfo.errMsg !== 'getUserProfile:ok') {
      that.showTips("您已经拒绝获取用户信息~", "error");
      return;
    }
    let code = await Api.getCode();
    console.log(code);
    console.log(userInfo);
    let res = await Api.auth({
      code: code,
      encryptedData: userInfo.encryptedData,
      iv: userInfo.iv,
      signature: userInfo.signature,
      rawData: userInfo.rawData
    });
    console.log(res);
    if (res.code == 0) {
      that.showTips("授权成功,请重新发送弹幕内容~", "success");
      that.setData({
        auth: true
      });
      wx.setStorageSync('auth', true);
    } else {
      that.showTips(res.msg, "error");
    }
  },
  async submit(e) {
    console.log(e);
    let data = e.detail.value;
    let content = e.detail.value.content;
    if (content) {
      let res = await Api.addBarrage(data);
      console.log(res);
      if (res.code == 0) {
        that.showTips("提交成功~", "success");
        that.setData({
          firework: true
        })
      } else {
        that.showTips(res.msg, "error");
      }
    } else {
      that.showTips("请输入弹幕内容再发送", "error");
    }
  }
})