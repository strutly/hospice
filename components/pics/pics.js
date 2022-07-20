// components/pics/pics.js
//多图片上传插件，未完成
const api = require("../../config/api");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pics:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    pics:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadPics:function(e){
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back'
      }).then(res => {
        console.log(res)
        res.tempFiles.forEach(async function(k){
          let token = await api.getToken();
          const uploadTask = wx.uploadFile({
            url: api.urls.QiniuImg, 
            filePath: k.tempFilePath,
            name: 'file',
            header: {
              'token': token
            },
            success (res){
                  
            }
          });
          uploadTask.onProgressUpdate((res) => {
            console.log('上传进度', res.progress)
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          })
          
          uploadTask.abort() // 取消上传任务
        })
        
      });
    },
    delPic:function(e){
      var index = e.currentTarget.dataset.index;
      var currThat = getApp().currThat;
      var pics = currThat.data.pics;
      pics.splice(index,1);
      currThat.setData({pics:pics,value:pics.join()});
    },
    showImage:function(event){
      var src = event.currentTarget.dataset.src;
      if (src) {
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: event.target.dataset.srcs||[src] // 需要预览的图片http链接列表
        })
      }
    }
  }
})
