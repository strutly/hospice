var that;
const api = require("../../config/api");
const util = require("../../utils/util");
Page({
  data:{
    lists:[],
    noDataMsg:"您还为评论任何人哦!去主页看看吧!",
    noDataBtn:"主页",
    noDataTo:"/pages/index/index",
    confirm:false,
    confirmMsg:"确认删除这条评论吗?"
  },
  onLoad(options){
    that = this;
    that.setData({
      options:options
    })
    that.pageComment(0);
  },
  async pageComment(pageNo){
    let lists = that.data.lists;
    let res = await api.comment({pageNo:pageNo});
    if((pageNo==0)&&(res.data==null || res.data.length==0)){
      that.setData({
        noData:true,
      })
    }else if((pageNo!=0)&&(res.data==null || res.data.length==0)){
        that.setData({
          endline:true
        })
    }else{      
      that.setData({
        pageNo:pageNo,
        lists:lists.concat(res.data)
      })
    }
  },
  onReachBottom(){
    let endline = that.data.endline;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.pageComment(pageNo);
    }    
  },
  handleLongPress(e){
    console.log(e);
    let comments = that.data.lists;
    let index = e.currentTarget.dataset.index
    that.setData({
      confirm:true
    })
    that.yes =async ()=>{
      let res = await api.deleteComment({id:comments[index].id})
      if(res.code==0){
        comments.splice(index,1)
      }
      that.setData({
        confirm:false,
        lists:comments
      })
      util.warn(that,res.msg);    
    }
    that.no =()=>{
      that.setData({
        confirm:false
      })
    }
  }
})