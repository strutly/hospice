//index.js

const util = require("../../utils/util");
const api = require("../../config/api");
//获取应用实例
const app = getApp()
var that;
Page({
  data: {
    index:1,
    user:wx.getStorageSync('userInfo'),
    num:app.globalData.num,
    myRecords:[]
  },  
  async onLoad(options) {
    that = this;
    let uid = options.id || wx.getStorageSync('uid');   
    that.setData({
      uid:uid,
      options:options||{}
    })
    console.log(uid);
    let res = await api.userInfo({id:uid});
    that.setData({
      userInfo:res.data
    })
    that.recordList(1);
  },
  async onShow(){
    if (typeof that.getTabBar === 'function' && that.getTabBar()) {
      that.getTabBar().setData({
        selected: 2
      })
    }
    let res = await api.notice({});
    that.setData({
      num:res.data.length||0
    })
  },
  async auth(e){
    console.log(e)
    let res = {};
    try {
      res = await wx.getUserProfile({
        desc: '用于更新会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })
    } catch (error) {
      console.log(error)
      return util.warn(that,"授权失败,请重试~");
    }
    let code = await api.getCode();
    console.log(res)
    if(res.errMsg=="getUserProfile:ok"){
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo);      
      let authRes = await api.authorize({
        code:code,
        encryptedData:res.encryptedData,
        iv:res.iv,
        signature:res.signature,
        rawData:res.rawData
      });
      wx.setStorageSync('token', authRes.data);
      wx.setStorageSync('uid', authRes.data.id);
      wx.setStorageSync('ifAuth', true);
      if(authRes.code==0){
        util.warn(that,"用户信息更新成功");
      }else{
        util.warn(that,authRes.msg);
      }
    }else{
      util.warn(that,"授权失败,请重试~");
    }       
  },  
  async recordList(pageNo){
    let datas = that.data.datas||[];
    let id = wx.getStorageSync('uid');
    let res = await api.recordByUid({pageNo:pageNo,uid:id});
    datas = datas.concat(res.data.content);
    let arr = util.groupBy(datas,(data)=>{
      return util.dateFormat(data.createTime,'yyyy年MM月')
    })
    that.setData({
      pageNo:pageNo,
      endline: res.data.last,
      datas:datas,
      myRecords:arr
    })
  },
  confirm(e){
    let type = e.currentTarget.dataset.type;
    that.setData({
      [type]:true
    })
  },
  async handle(e){
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let datas = that.data.datas;
    console.log(datas)
    let index = datas.findIndex((value) => {
      return value.id == id;
    })
    console.log(index)
    let res = await api.recordById({id:id,type:type});
    console.log(res);
    util.warn(that,"操作成功!");
    that.setData({
      move:false
    })
    console.log(type=="delete")
    if(type=="delete"){
      console.log("delete")
      datas.splice(index,1);
      
    }else{
      datas[index].open = !datas[index].open;
    }

    let arr = util.groupBy(datas,(data)=>{
      return util.dateFormat(data.createTime,'yyyy年MM月')
    })
    that.setData({
      myRecords:arr
    })
  },
  touchstart(e){
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,      
      move: false,
      delete:false,
      put:false
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    
    var index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标    
    startY = that.data.startY,//开始Y坐标    
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标    
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标    
    //获取滑动角度    
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 30) return;
    if(touchMoveX < startX){
      that.setData({
        move:true,
        moveIndex:index
      })
    }  
  },
  angle: function (start, end) {
    var _X = end.X - start.X,    
    _Y = end.Y - start.Y    
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);    
  },
  push(){
    wx.switchTab({
      url: '/pages/index/form',
    })
  },
  onReachBottom(){
    let endline = that.data.endline;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.recordList(pageNo);
    }    
  },
  notice(){
    wx.navigateTo({
      url: '/pages/index/notice',
      success(){        
        that.getTabBar().setData({
          num: 0
        })
      }
    })    
  }
});

