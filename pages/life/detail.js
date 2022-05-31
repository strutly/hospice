const app = getApp();
import util from '../../utils/util.js';
import api from '../../config/api.js';
var that;
Page({
  data: {
    like: 0,
    store: 0,
    comment: false,
    confirmMsg: "确认删除这条评论吗?",
    url: 'http://pic.strutly.cn/mylove/e649640d-5c37-4a86-9597-a8a0128345ac.mp4',
    full: false,
    playVideo: false
  },
  async onLoad(options) {
    console.log(options)
    that = this;
    let id = options.id;
    let res = await api.getRecordDetail({ id: id });
    let detail = res.data;
    let imgs = [];
    detail.imgs.forEach(img => {
      if (img.type == 0) {
        imgs.push(img.url)
      }
    })
    console.log(imgs);
    that.setData({
      imgs: imgs,
      detail: res.data,
      id: id,
      options: options,
    })
  },
  comment(e) {
    let auth = wx.getStorageSync('auth');
    if (auth) {
      that.setData({
        comment: true,
        otherName: e.target.dataset.othername || "",
        oid: e.target.dataset.oid || ""
      })
    } else {
      that.setData({
        auth: true,
        callBack: function () {
          that.comment(e)
        }
      })
    }
  },
  async auth(e) {
    let res = {};
    try {
      res = await wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })
    } catch (error) {
      return that.showTips("授权失败,请重试~");
    }

    console.log(res)
    if (res.errMsg == "getUserProfile:ok") {
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo);
      let code = await api.getCode();
      let authRes = await api.auth({
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
        that.data.callBack();
      } else {
        that.showTips(authRes.msg);
      }
    } else {
      that.showTips("授权失败,请重试~");
    }
  },
  authModal() {
    that.setData({
      auth: !that.data.auth
    })
  },
  showTips(msg, type = "error") {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  giveup(e) {
    that.setData({
      comment: false,
      content: e.detail.value
    })
  },
  cancle() {
    that.setData({
      auth: false
    })
  },
  submit(e) {
    console.log(e)
    if (e.detail.value) {
      that.setData({
        content: e.detail.value
      })
      that.handle(2);
    } else {
      that.setData({
        comment: true
      })
      that.showTips("回复内容不能为空!", "error");

    }
  },
  like(e) {
    console.log(e)
    let auth = wx.getStorageSync('auth');
    if (auth) {
      that.handle(e.currentTarget.dataset.type);
    } else {
      that.setData({
        auth: true,
        callBack: function () {
          that.like(e)
        }
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '详细',
      path: '/pages/life/detail?id=' + that.data.id
    }
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.imgs // 需要预览的图片http链接列表  
    })
  },
  async handle(type) {
    let userInfo = wx.getStorageSync('userInfo') || { nickName: '微信用户' };
    let data = {
      rid: that.data.id,
      msg: that.data.detail.msg,
      pic: that.data.detail.imgs.length > 0 ? that.data.detail.imgs[0].cover : '/images/add.png',
      oid: that.data.oid || null,
      otherName: that.data.otherName || "",
      content: that.data.content || "",
      type: type
    };
    console.log(data);
    let res = await api.addComment(JSON.stringify(data));
    if (res.code == 0) {
      let detail = that.data.detail;
      if (type == 1) {
        detail.like = !detail.like;
        if (detail.like) {
          detail.likes.push({ uid: that.data.uid, nickName: userInfo.nickName })
        } else {
          let index = detail.likes.findIndex(item => item.uid === that.data.uid);
          console.log(index)
          detail.likes.splice(index, 1);
        }
      } else if (type == 3) {
        detail.store = !detail.store;
      } else {
        let replys = detail.replys;
        data.id = res.data;
        data.uid = that.data.uid;
        data.nickName = userInfo.nickName;
        data.avatarUrl = userInfo.avatarUrl;
        data.createTime = util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        replys.push(data);
      }
      that.setData({
        detail: detail
      })
    } else {
      that.showTips(res.msg, "error");
    };
  },
  authModal() {
    that.setData({
      auth: !that.data.auth
    })
  },
  confirm(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      confirm: true
    })
    that.yes = async () => {
      let res = await api.deleteComment({ id: e.currentTarget.dataset.id });
      console.log(res);
      let replys = that.data.replys;
      replys.splice(index, 1);
      that.setData({
        confirm: false,
        replys: replys
      })
    }
    that.no = () => {
      that.setData({
        confirm: false
      })
    }
  }
})