//index.js

const util = require("../../utils/util");
const api = require("../../config/api");
//获取应用实例
const app = getApp()
var that;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    index:1,
    user:wx.getStorageSync('userInfo'),
    num:app.globalData.num,
    myRecords:[]
  },
  async onLoad(options) {
    that = this;
    that.setData({
      source:options.source||0
    })
    that.recordList(1);
  },
  async onShow(){

  },

  async recordList(pageNo){
    let datas = that.data.datas||[];
    let res = await api.getRecordMy({pageNo:pageNo,source:that.data.source||0});
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
    let column=e.currentTarget.dataset.column;
    console.log(datas)
    let index = datas.findIndex((value) => {
      return value.id == id;
    })
    console.log(index)
    let res;
    if(type=="delete"){
      res = await api.editRecord({id:id,type:type});
    }else{
      res = await api.changeRecord({id:id,type:type,column:column});
    }
    console.log(res);

    that.setData({
      move:false
    })
    console.log(type=="delete")
    if(type=="delete"){
      console.log("delete")
      datas.splice(index,1);

    }else{
      datas[index][column] = !datas[index][column];
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
}));;

