//index.js

const util = require("../../utils/util");
import Api from '../../config/api';
//获取应用实例
const app = getApp()
var that;
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    tabIndex:0,
    user:wx.getStorageSync('userInfo'),
    // num:app.globalData.num,
    myRecords:[[],[],[]],
    navs:["全部","待生成","已生成"],
    statuss:[null,0,1],
    pageNo: [0, 0,0],
    endline:[false,false,false]
  },
  async onLoad(options) {
    that = this;
    that.video = that.selectComponent("#video");
    that.topTips1 = that.selectComponent("#topTips1");
    // that.setData({
    //   source:options.source||0
    // })
    // that.recordList(1);
  },
  onShow() {
    that.setData({myRecords: [[], [],[]]});
    that.getList(0,1);
    page.onShow.call(this);
  },
  async getList(index, page) {
    let param = {
      pageNum: page
    }
    if(that.data.status!=null){
      param.status = that.data.status;
    }
    console.log(index)
    let res = await Api.getAlbumMy(param);

    let myRecords = that.data.myRecords;
    myRecords[index] = myRecords[index].concat(res.data.content);
    console.log(myRecords)
    let pageNo = that.data.pageNo;
    pageNo[index] = page;
    let endline = that.data.endline;
    endline[index] = res.data.last;
    that.setData({
      pageNo: pageNo,
      endline:endline,
      myRecords: myRecords
    });
  },
  // async recordList(pageNo){
  //   let datas = that.data.datas||[];
  //   let res = await api.getWishMy({pageNum:pageNo});
  //   datas = datas.concat(res.data.content);
  //   let arr = util.groupBy(datas,(data)=>{
  //     return util.dateFormat(data.createTime,'yyyy年MM月')
  //   })
  //   that.setData({
  //     pageNo:pageNo,
  //     endline: res.data.last,
  //     datas:datas,
  //     myRecords:arr
  //   })
  // },
  onReachBottom(){
    let endline = that.data.endline;
    let index = that.data.tabIndex;
    if(!endline[index]){
      let pageNo = that.data.pageNo[index] + 1;
      that.getList(index,pageNo);
    }
  },
  async comeTrue(e) {
    var index = e.currentTarget.dataset.index;
    var i = this.data.tabIndex;
    
    var obj = {
      pageNo: [0, 0,0],
      endline:[false,false,false],
      myRecords :[[],[],[]],
      videoThumb:"",
    videoStyle:'position: absolute;left:0;top:0;'
    }
    var myRecords = this.data.myRecords[i];
    obj.myRecords[i]=myRecords;
    obj.pageNo[i]=this.data.pageNo[i];
    obj.endline[i]=this.data.endline[i];
    
    var id = e.currentTarget.dataset.id;
    var comeTrue=!myRecords[index].comeTrue;
    myRecords[index].comeTrue=comeTrue;
    let res = await Api.editWish(JSON.stringify({id:id,comeTrue:comeTrue}));
    if (res.code == 0) {
      that.setData(obj)
    } else {
      that.topTips(res.msg, "error");
    }

  },
  async delete(e) {
    var index = e.currentTarget.dataset.index;
    var i = this.data.tabIndex;
    
    var obj = {
      pageNo: [0, 0,0],
      endline:[false,false,false],
      myRecords :[[],[],[]]
    }
    var myRecords = this.data.myRecords[i];
    obj.myRecords[i]=myRecords;
    obj.pageNo[i]=this.data.pageNo[i];
    obj.endline[i]=this.data.endline[i];
    
    var id = e.currentTarget.dataset.id;
    that.confirm("确认删除吗",async function(){
      let res = await Api.deleteAlbum({id:id});
      if (res.code == 0) {console.log(obj.myRecords[i][index]);
        obj.myRecords[i].splice(index,1);
        console.log(obj.myRecords[i][index]);
        obj.move=false;
        that.setData(obj)
      } else {
        that.topTips(res.msg, "error");
      }
    });
  },
  
  topTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  },
  tabSelect(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex:index,
      status:e.currentTarget.dataset.status
    })
    if (!that.data.pageNo[index]) {
      that.getList(index, 1);
    }
  },
  playVideo(e){
    console.log(e);
    if(!e.currentTarget.dataset.url)return;
    that.video.playVideo(Api.realPath(e.currentTarget.dataset.url));
    that.setData({videoThumb:"hide"});
  },
  download(e){
    var index = e.currentTarget.dataset.index;
    var i = this.data.tabIndex;
    var myRecords = this.data.myRecords[i];
    var oysUtils=require("../../utils/oysUtils");
    oysUtils.downloadVideo(Api.qiniuToMine(myRecords[index].videoUrl),null,
      function(){that.topTips1.alert("下载中",null,0)},
      function(){that.topTips1.hide();},function(res){that.topTips1.alert("下载进度："+res.progress+"%",null,0)});
  }
}));

