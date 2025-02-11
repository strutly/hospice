import util from "../../utils/util";
import Api from "../../config/api";
const app = getApp();
var that;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    navHeight: app.globalData.navHeight,
    navTop: app.globalData.navTop,
    delete: false,
    pageName: '发表日志'
  },
  onLoad(options) {
    that = this;
    let formData = wx.getStorageSync('formData') || { open: 1, imgs: [], type: 0 ,anonymous:0,comment:1};
    formData.source = options.source||0;
    that.setData({
      formData: formData,
      options: options
    })
  },
  chooseType(e) {
    console.log(e);
    that.setData({
      ['formData.type']: e.currentTarget.dataset.type
    })
  },
  anonymous() {
    let anonymous = that.data.formData.anonymous;
    that.setData({
      ['formData.anonymous']: 1 ^ anonymous,
    })
  },
  comment() {
    let comment = that.data.formData.comment;
    that.setData({
      ['formData.comment']: 1 ^ comment,
    })
  },
  handleLongPress() {
    let de = that.data.delete;
    that.setData({
      delete: !de
    })
  },
  remove(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let imgs = that.data.formData.imgs;
    imgs.splice(index, 1);
    console.log(imgs)
    that.setData({
      ['formData.imgs']: imgs
    })
    wx.setStorageSync('formData', that.data.formData);
  },
  previewImage(e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },
  addImg() {
    that.setData({
      delete: false
    })
    let imgs = that.data.formData.imgs;
    // 微信 Api 选择图片（从相册）
    wx.chooseImage({
      count: 9 - imgs.length,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        console.log(res);
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          that.uploadImg(tempFilePaths[i],res.tempFiles[i]);
        }
      }
    })
  },
  async uploadImg(tempFilePaths,tempFiles) {
    let imgs = that.data.formData.imgs;
    let res = await Api.uploadImg(tempFilePaths,tempFiles);

    let data = JSON.parse(res);
    if (data.code != 0) {
      return util.warn(that, data.msg);
    }
    let item = { type: 0, url: data.data.src, cover: data.data.src };
    imgs.push(item);
    that.setData({
      ['formData.imgs']: imgs
    })
    wx.setStorageSync('formData', that.data.formData)
  },
  async form() {
    let formData = that.data.formData
    if (formData.msg == "") {
      return that.topTips("请输入内容后再提交", 'error');
    }if (formData.title == "") {
      return that.topTips("请输入标题后再提交", 'error');
    }

    let res = await Api.addRecord(JSON.stringify(formData));
    if (res.code == 0) {
      wx.removeStorageSync('formData');

      that.topTips("分享成功", "success");
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    } else {
      that.topTips(res.msg, "error");
    }
  },
  topTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  bindTitleBlur(e) {
    that.setData({
      ['formData.title']: e.detail.value
    })
    wx.setStorageSync('formData', that.data.formData);
  },
  bindTextAreaBlur(e) {
    console.log(e);
    that.setData({
      ['formData.msg']: e.detail.value
    })
    wx.setStorageSync('formData', that.data.formData);
  },
  cancle() {
    that.setData({
      auth: false
    })
  }
}));;