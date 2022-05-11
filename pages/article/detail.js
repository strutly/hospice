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
    let res = await Api.getArticleDetail({
      id:options.id
    })
    var jsonDa = JSON.stringify(res.data.content).replace(/<img/gi, "<img class='richImg'");
    var arr = jsonDa.split(/([\d\.\-]+?)px/);
    arr.forEach(function(v,k){if(k%2==1){arr[k]=parseInt(v)/14+"rem"}});
    jsonDa=arr.join("");
    var newResData = JSON.parse(jsonDa);

    that.setData({
      article:res.data,
      htmlSnip: newResData,
      videos:res.data.videos.split(",")||[],
      videosPics:res.data.videosPics.split(",")||[]
    })
  },
  onShow() {
    this.setData({
      systemFontSize: wx.getStorageSync('systemFontSize') || "14px"
    })
  },
  onReady(){
    innerAudioContext = wx.createInnerAudioContext();
    console.log(innerAudioContext)
    //innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.article.audios||"";
    that.video = that.selectComponent("#video");
  },
  play(){
    console.log(innerAudioContext)
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
    
  },

  onShareAppMessage(){
    return {
      title: that.data.article.name,
      path: '/pages/article/detail?id='+that.data.article.id
    }
  }

})