var that,innerAudioContext;
import Api from "../../config/api";
Page({
  data: {
    domain:Api.domain,
    play:false,
    htmlSnip: "",
    article:{
      videos:""
    },
    videos:[],
    videosPics:[]
  },
  async onLoad(options) {
    that = this;
    that.video = that.selectComponent("#video");
    let res = await Api.getArticleDetail({
      id:options.id
    })
    var jsonDa = res.data.content.replace(/<img/gi, "<img class='richImg'");
    var arr = jsonDa.split(/([\d\.\-]+?)px/);
    arr.forEach(function(v,k){if(k%2==1){arr[k]=parseInt(v)/14+"rem"}});
    jsonDa=arr.join("");
    // var newResData = JSON.parse(jsonDa);

    that.setData({
      article:res.data,
      htmlSnip: jsonDa,
      videos:res.data.videos.split(",")||[],
      videosPics:res.data.videosPics.split(",")||[]
    })
  },
  onShow() {
    this.setData({
      systemFontSize: wx.getStorageSync('systemFontSize') || "14px"
    })
  },
  onUnload(){
    innerAudioContext.stop();
  },
  onReady(){
    innerAudioContext = wx.createInnerAudioContext();
    console.log(innerAudioContext)
    //innerAudioContext.autoplay = true
    
    
  },
  play(){
    console.log(innerAudioContext)
    innerAudioContext.src = that.data.article.audios||"";
    innerAudioContext.play()
    that.setData({
      play:true
    })
  },
  stop(){
    innerAudioContext.stop();
    that.setData({
      play:false
    })
  },
  playVideo(e){
    console.log(e);
    that.video.playVideo(e.currentTarget.dataset.url);
    // that.video.fullScreen();
  },
  onShareAppMessage(){
    return {
      title: that.data.article.name,
      path: '/pages/article/detail?id='+that.data.article.id
    }
  }

})