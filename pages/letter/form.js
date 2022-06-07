
var that;
import Api from "../../config/api";
Page({
  data: {
    auth: wx.getStorageSync('auth') || false,
    formData: { pics: [],msg:"",type:1}
  },
  onLoad(options) {
    that = this;
    that.setData({
      formData:wx.getStorageSync('letterData')||{ pics: [],msg:"",type:1}
    })
  },
  bindTextAreaBlur(e) {
    console.log(e);
    that.setData({
      ['formData.msg']: e.detail.value
    })
    console.log(that.data);
    wx.setStorageSync('letterData', that.data.formData);
  },
  bindInputBlur(e){
    console.log(e);
    that.setData({
      ['formData.title']: e.detail.value
    })
    wx.setStorageSync('letterData', that.data.formData);
  },
  showTopTips(msg,type){
    that.setData({
      show:true,
      msg:msg,
      type:type||"error"
    })
  },
  async addImg() {
    that.setData({
      delete: false
    })
    let imgs = that.data.formData.pics;
    // 微信 Api 选择图片（从相册）
    let res = await wx.chooseMedia({
      count: 9 - imgs.length,
      mediaType: ['image']
    })
    console.log(res);
    var tempFiles = res.tempFiles;
    console.log(tempFiles);

    for (var i = 0; i < tempFiles.length; i++) {
      that.uploadImg(tempFiles[i].tempFilePath);
    }
  },
  async uploadImg(filePath) {
    let pics = that.data.formData.pics;
    let res = await Api.uploadImg(filePath);
    res = JSON.parse(res);
    if (res.code != 0) {
      return that.showTopTips(res.msg,"error");
    }
    pics.push(res.data.src);
    that.setData({
      ['formData.pics']: pics
    })
    wx.setStorageSync('letterData', that.data.formData)
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
    let pics = that.data.formData.pics;
    pics.splice(index, 1);
    console.log(pics)
    that.setData({
      ['formData.pics']: pics
    })
    wx.setStorageSync('letterData', that.data.formData);
  },
  previewImage(e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },
  authModal() {
    that.setData({
      authModal: !that.data.authModal
    })
  },
  //授权
  async getUserProfile(e) {
    console.log(e);
    that.authModal();
    let userInfo = {};
    try {
      userInfo = await wx.getUserProfile({ desc: '用于完善会员资料' });
    } catch (error) {
      return that.showTopTips("您已经拒绝获取用户信息","error");
    }
    console.log(userInfo);
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
      that.showTopTips("授权成功,请重新将信件塞入信箱~","success");
      that.setData({
        auth: true        
      });
      wx.setStorageSync('auth', true);
    } else {
      wx.removeStorageSync('code');
      that.showTopTips(res.msg,"error");
    }
  },
  async submit(e) {
    console.log(e);
    let tmpID = "wCU3LJudvCOktVftBcl6eGl62OEszTPvxAooJbpVUyY";
    let data = that.data.formData;
    if(!data.msg && data.pics.length==0){
      return that.showTopTips("请编辑信件内容或者上传信件图片后再提交","error");
    }
    let tmpResp = await wx.requestSubscribeMessage({
      tmplIds: [tmpID]
    })
    console.log(tmpResp);
    data.ifAccept = tmpResp[tmpID] === 'accept' ? true : false;
    let res = await Api.addLetter(JSON.stringify(data));
    console.log(res);
    if(res.code==0){
      that.showTopTips("信件投递成功","success");
      wx.removeStorageSync('letterData');
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
      },2000);
    }else{
      that.showTopTips(res.msg,"error");
    }    
  }
})