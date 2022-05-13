const app = getApp();
import util from '../../utils/util.js';
import api from '../../config/api.js';
var that;
Page({
  data:{
    like:0,
    store:0,
    comment:false,
    uid:wx.getStorageSync('uid')||"",
    confirmMsg:"确认删除这条评论吗?",
    url:'http://pic.strutly.cn/mylove/e649640d-5c37-4a86-9597-a8a0128345ac.mp4',
    full:false,
    playVideo:false
  },
  onLoad(options){
    console.log(options)
    that = this;
    let id = options.id;
    that.setData({
      options:options,
      id:id
    })
  },
  screenChange(e){
    console.log(e);
    that.setData({
      full:e.detail.fullScreen
    })
  },
  video(e){
    that.setData({
      playVideo:true,
      url:e.currentTarget.dataset.src
    })
  },

  hiddenVideo(){
    that.setData({
      playVideo:false
    })    
  },
  async onShow(){
    let id = that.data.id;
    let res = await api.getRecordDetail({id:id});
    console.log(res)
    if(res.data!=null){
      let detail = res.data;
      let imgs=[];
      detail.imgs.forEach(img=>{
        if(img.type==0){
          imgs.push(img.url)
        }
      })
      console.log(imgs);
      that.setData({
        imgs:imgs,
        detail:res.data,
        likes:res.data.counts[1]||[],
        replys:res.data.counts[2]||[],
        id:id
      })
    }else{
      that.setData({
        noData:true,
        noDataTo:"/pages/index/index",
        noDataMsg:"该内容不存在或已经隐藏,去主页看看吧!",
        noDataBtn:"主页"
      })
    } 
  },
  async onReady(){
    let auth = wx.getStorageSync('auth')||false;
    if(auth){
      let res = await api.commentDetail({id:that.data.id});
      that.setData({
        like:res.data.like?1:0,
        store:res.data.store?1:0,
      })
    };
      
  },
  comment(e){
    let auth = wx.getStorageSync('auth');
    if(auth){
      that.setData({
        comment:true,
        otherName:e.target.dataset.othername||"",
        oid:e.target.dataset.oid||""
      })
    }else{
      that.setData({
        auth:true,
        callBack:function(){
          that.comment(e)
        }
      })      
    }    
  },
  async auth(e){
    let res = {};
    try {
      res = await wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })
    } catch (error) {
      return that.showTips("授权失败,请重试~");
    }
    let code = await api.getCode();
    console.log(res)
    if(res.errMsg=="getUserProfile:ok"){
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo);      
      let authRes = await api.auth({
        code:code,
        encryptedData:res.encryptedData,
        iv:res.iv,
        signature:res.signature,
        rawData:res.rawData
      });
      wx.setStorageSync('auth', true);
      if(authRes.code==0){
        that.setData({
          auth:false
        })
        that.data.callBack();
      }else{
        that.showTips(authRes.msg);
      }
    }else{
      that.showTips("授权失败,请重试~");
    }       
  },
  authModal() {
    that.setData({
      authModal: !that.data.authModal
    })
  },
  showTips(msg, type="error") {
    that.setData({
      show: true,
      msg: msg,
      type: type
    })
  }, 
  giveup(e){
    that.setData({
      comment:false,
      content:e.detail.value
    })
  },
  cancle(){
    that.setData({
      auth:false
    })
  },
  submit(e){
    console.log(e)
    if(e.detail.value){
      that.setData({
        content:e.detail.value
      })
      that.handle(2);
    }else{
      that.setData({
        comment:true
      })
      that.showTips("回复内容不能为空!","error");
      
    }
  },
  like(e){
    console.log(e)
    let auth = wx.getStorageSync('auth');
    if(auth){
      that.handle(e.currentTarget.dataset.type);
    }else{
      that.setData({
        auth:true,
        callBack:function(){
          that.like(e)
        }
      })      
    } 
  },
  onShareAppMessage(e){
    console.log(e);
  },
  onShareAppMessage: function (res) {
    return {
      title: 'Baby-Record',
      path: '/pages/index/detail?id='+that.data.id
    }
  },
  onShareTimeline:function(res){
    return {
      title: 'Baby-Record',
      path: '/pages/index/detail?id='+that.data.id
    }
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.imgs // 需要预览的图片http链接列表  
    })
  },
  userHome(e){
    let auth = wx.getStorageSync('auth')||false;
    if(auth){
      let uid = e.currentTarget.dataset.uid;
      let id = wx.getStorageSync('uid');
      if(uid != id){
        wx.navigateTo({
          url: "/pages/index/you?uid="+uid,
        })
      }else{
        wx.switchTab({
          url:"/pages/index/my"
        })
      }
      
    }else{
      that.setData({
        auth:true,
        callBack:function(){
          that.userHome(e)
        }
      })
    }    
  },
  async handle(type){
    let userInfo = wx.getStorageSync('userInfo');
    let data = {
      rid:that.data.id,
      msg:that.data.detail.msg,
      pic:that.data.detail.imgs[0].cover,
      oid:that.data.oid||null,
      otherName:that.data.otherName||"",
      content:that.data.content||"",
      type:type
    };
    console.log(data);
    let res = await api.addComment(JSON.stringify(data));
    if(res.code==0){
      if(type==1){
        let like = that.data.like;
        like = -1*like + 1;
        let likes = that.data.likes;
        if(like==1){
          likes.push({uid:that.data.uid,nickName:userInfo.nickName})
        }else{
          let index =  likes.findIndex(item => item.uid === that.data.uid);
          console.log(index);
          likes.splice(index,1);
          console.log(likes)
        }
        that.setData({
          like:like,
          likes:likes
        })
      }else if(type==3){
        let store = that.data.store;
        store = -1*store + 1;
        that.setData({
          store:store
        })
      }else{
        let replys = that.data.replys;
        data.id = res.data;
        data.uid = that.data.uid;
        data.nickName = userInfo.nickName;
        data.avatarUrl = userInfo.avatarUrl;
        data.createTime = util.dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss');
        replys.push(data)
        that.setData({
          replys:replys
        })
      }
    }else{
      that.showTips(res.msg,"error");
    };        
  },
  authModal() {
    that.setData({
      authModal: !that.data.authModal
    })
  },
  confirm(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    that.setData({
      confirm:true
    })
    that.yes =async ()=>{
      let res = await api.deleteComment({id:e.currentTarget.dataset.id});
      console.log(res);
      let replys = that.data.replys;
      replys.splice(index,1);
      that.setData({
        confirm:false,
        replys:replys
      })    
    }
    that.no =()=>{
      that.setData({
        confirm:false
      })
    }
  }
})