var that;
import Api from "../../../config/api";
var basePage = require("../../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {

  data: {
    move:false,
    moveIndex:-1,
    patients:[]
  },

  onLoad(options) {
    that = this;
    that.getList(1,"")
  },
  async getList(pageNo,name){
    let res = await Api.pagePatient({
      pageNo:pageNo,
      name:name
    });
    let patients = that.data.patients||[];
    that.setData({
      patients:patients.concat(res.data.content),
      endline:res.data.last,
      pageNo: pageNo,
      name:name
    })
  },
  onShow() {
    page.onShow.call(this);
  },
  touchstart(e) {    
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
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
    that.setData({
      move: touchMoveX < startX,
      moveIndex: touchMoveX < startX ? index : -1
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  onReachBottom() {
    let endline = that.data.endline;
    let name = that.data.name;
    if(!endline){
      let pageNo = that.data.pageNo[index] + 1;
      that.getList(pageNo,name);
    }
  },
  submit(e){
    console.log(e);
    let name = e.detail.value.name;
    that.search(name);
    
  },
  search(name){
    that.setData({
      patients:[],
      moveIndex:-1
    })
    that.getList(1,name);
  },
  async delete(e){
    console.log(e)
    wx.showModal({
      title:"确认删除此患者?",
      success:async function(res){
        if (res.confirm) {
          let res = await Api.detailPatient(e.currentTarget.dataset);
          console.log(res);
        }
      }
    })
  }
}))