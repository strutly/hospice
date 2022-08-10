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
    pageName: '发表日志',
    types:[['这一口有味道#','这一眼还可以#','这一句让我感动#','这个瞬间非常留恋#'],
      [],[],['亲历身边事','影音中的故事'],['自我照护经验分享','病人照护经验分享','求助贴']]
  },
  onLoad(options) {
    that = this;
    let formData = wx.getStorageSync('formData') || { open: 1, imgs: [], type: 0 };
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
  open() {
    let open = that.data.formData.open;
    that.setData({
      ['formData.open']: 1 ^ open,
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
  addVideo() {
    wx.chooseMedia({
      mediaType: ['video'],
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back',//默认拉起的是前置或者后置摄像头，默认back
      compressed: true,//是否压缩所选择的视频文件
      success: function (res) {
        console.log(res)
        let tempFile = res.tempFiles[0];//选择定视频的临时文件路径（本地路径）
        let duration = tempFile.duration //选定视频的时间长度
        let size = parseFloat(tempFile.size / 1024 / 1024).toFixed(1) //选定视频的数据量大小
        that.data.duration = duration
        if (parseFloat(size) > 100) {
          that.setData({
            clickFlag: true,
            duration: ''
          })
          let beyondSize = parseFloat(size) - 100
          wx.showToast({
            title: '上传的视频大小超限，超出' + beyondSize + 'MB,请重新上传',
            //image: '',//自定义图标的本地路径，image的优先级高于icon
            icon: 'none'
          })
        } else {
          console.log(tempFile)
          //2.本地视频资源上传到服务器
          that.upload(tempFile.tempFilePath, tempFile.thumbTempFilePath);
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //这功能好像没用上，不改了
  async upload(tempFilePath, cover) {
    console.log(tempFilePath)
    let imgs = that.data.formData.imgs;
    let res = await Api.uploadFile(tempFilePath);
    let res2 = await Api.uploadImg(cover);
    console.log(res);
    console.log(res2);
    let data = JSON.parse(res.data);
    let data2 = JSON.parse(res2.data);
    if (data.code != 0) {
      return that.topTips(data.msg, 'error');
    }
    if (data2.code != 0) {
      return that.topTips("封面" + data2.msg, 'error');
    }

    let item = { type: 1, url: data.data.src, cover: data2.data.src };
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