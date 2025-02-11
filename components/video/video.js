// components/video.js
//多个缩略图对应一个视频播放器
var videoContext;
Component({
  properties: {
    vstyle:{
      type:String,
      value:''
    }
  },
  data: {
    playVideo:false,
    url:"",
    direction:0,
    zindex:-1
  },
  methods: {
    playVideo:function(url) {
      // let that = this;
      // videoContext = wx.createVideoContext('myvideo', that);
      // //执行全屏方法  
      // // videoContext.requestFullScreen();
      // that.setData({
      //   playVideo: true,
      //   direction: 90,
      //   zindex:100,
      //   url: url
      // })
    },
    stop:function(){
      videoContext.stop();
    },
    screenChange(e) {
      let that = this;
      console.log(e);
      let fullScreen = e.detail.fullScreen;
      if (fullScreen) {        
        that.setData({
          direction: 90
        })
        videoContext.requestFullScreen();
        console.log(that.data)
      } else {

        videoContext.exitFullScreen();
      }
    },
    videoErrorCallback(e) {
      console.log('视频错误信息:')
      console.log(e.detail.errMsg)
    }
  }
})
