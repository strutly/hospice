var that;
const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data:{
    noDataMsg:'您还没关注任何人,赶快去主页逛逛吧!',
    noDataTo:'/pages/index/index',
    noDataBtn:'去主页看看'
  },
  async onLoad(options){
    that = this;
    that.setData({
      options:options
    })
    let res = await api.meFans({});
    if(res.data.fans.length>0){
        that.setData({
          fans:res.data.fans
        })
      }else{
        that.setData({
          noData:true          
        })
      } 
  },
  async follow(e){
    let uid = e.currentTarget.dataset.uid;
    let index = e.currentTarget.dataset.index;
    let res = await api.addFans({oid:uid})
    if(res.code==0){
      let fans = that.data.fans;
      fans.splice(fans.findIndex(item => item === index), 1);
      if(fans.length==0){
        that.setData({
          noData:true
        })
      }
      that.setData({
        fans:fans
      })
    } 
  }
})