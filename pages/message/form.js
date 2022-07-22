var that;
import WxValidate from '../../utils/WxValidate';
import Api from "../../config/api";
Page({
  data: {
    minDate:new Date().toLocaleDateString(),
    pics:[]
    
  },
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  initValidate() {
    const rules = {
      email:{
        required: true,
        email:true
      },      
      sendDay: {
        required: true
      },
      content: {
        required: true
      },
      pics:{
        min:1
      }       
    };
    const messages = {
      email:{
        required: "请输入发送邮箱",
        email:"请输入有效的邮箱账号"
      },      
      sendDay: {
        required: "请选择发送日期"
      },
      content: {
        required: "请输入寄语内容"
      },
      pics:{
        min:"请至少上传一张照片"
      }   
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  showTips(msg, type = "error") {
    that.setData({
      msg: msg,
      type: type,
      show: true
    })
  },
  dateChange(e){
    console.log(e);
    that.setData({
      sendDay:e.detail.value
    })
  },

  delImg(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let pics = that.data.pics;
    pics.splice(index, 1);
    console.log(pics)
    that.setData({
      pics: pics
    });
  },
  viewImage(e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },
  chooseImage() {
    let pics = that.data.pics;
    // 微信 Api 选择图片（从相册）
    wx.chooseMedia({
      mediaType:['image'],
      count: 9 - pics.length,
      success: function (res) {
        var tempFilePaths = res.tempFiles;
        console.log(tempFilePaths);
        console.log(res);
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.uploadImg(tempFilePaths[i].tempFilePath);
        }
      }
    })
  },
  async uploadImg(tempFilePaths) {
    let pics = that.data.pics;
    let res = await Api.uploadImg(tempFilePaths);
    let data = JSON.parse(res);
    if (data.code != 0) {
      return that.showTips(data.msg);
    }
    pics.push(data.data.src);
    that.setData({
      pics: pics
    })
  },
  async submit(e){
    console.log(e)
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    } 
    data.pics = that.data.pics;
    let res = await Api.addMessage(data);
    console.log(res);
  }

})