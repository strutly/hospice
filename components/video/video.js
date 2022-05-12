// components/video.js
var videoContext;
Component({
  properties: {

  },
  data: {
    playVideo:false,
    url:"",
    direction:0,
    zindex:-1
  },
  methods: {
    playVideo:function(url) {
      let that = this;
      console.log(url);
      //执行全屏方法  
      videoContext = wx.createVideoContext('myvideo', that);
      // videoContext.requestFullScreen();
      that.setData({
        playVideo: true,
        direction: 90,
        zindex:10000,
        url: url
      })
    },
    stop:function(){
      videoContext.stop();
    },
    fullScreen:function(){
      videoContext.requestFullScreen();
    },
    screenChange(e) {
      let that = this;
      console.log(e);
      let fullScreen = e.detail.fullScreen;
      if (fullScreen) {
        videoContext.requestFullScreen();
        that.setData({
          direction: 90
        })
      } else {
        that.setData({
          playVideo: false,
          zindex:-1
        })
      }
    },
    videoErrorCallback(e) {
      console.log('视频错误信息:')
      console.log(e.detail.errMsg)
    }
  }
})
