const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var that;
Page({
  data:{
    noDataMsg:'还没人关注你,赶快去主页逛逛吧!',
    noDataTo:'/pages/index/index',
    noDataBtn:'去主页看看'
  },
  async onLoad(options){
    that = this;
    that.setData({
      options:options
    })
    let res = await api.fans({});
    if(res.data.fans.length>0){
      that.setData({
        fans:res.data.fans,
        follows:res.data.toids
      })
    }else{
      that.setData({
        noData:true          
      })
    };
  },
  async follow(e){
    let uid = e.currentTarget.dataset.uid;
    let index = e.currentTarget.dataset.index;
    let res = await api.addFans({oid:uid});
    if(res.code==0){
      let follows = that.data.follows;
      if(follows.indexOf(uid)>-1){
        follows.splice(follows.findIndex(item => item === index), 1);
      }else{
        follows.push(uid);
      }        
      that.setData({
        follows:follows
      })
    }
  }
})