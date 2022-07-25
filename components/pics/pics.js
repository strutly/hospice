// components/pics/pics.js
/**多图片上传插件，
 * 未完成，终止上传先不做了
 * 由于有上传失败的情况，所以不能直接把外部给过来的值渲染
 * 由于插件中的input无非被form直接识别，所以用这种写法，{{pics}}对应的是表单的数据,由于插件内我并没有写solt，
 *      所以input不会显示出来，name="pics"用于告知表单name
 *  <pics pics="{{pics}}" name="pics">
      <input name="pics" value="{{pics}}"/>
    </pics>
 * */
const api = require("../../config/api");
var that,currThat,name;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pics:String,
    name:String//对应表单中的名称
  },

  /**
   * 组件的初始数据
   */
  data: {
    picList:[]
  },
  pageLifetimes: {
    show: function() {
      that=this;currThat = getApp().currThat;
      var pics = this.data.pics;
      if(pics){
        var picArr = this.data.pics.split(",");
        var picList = [];
        for (let i = 0; i < picArr.length; i++) {
          var val = picArr[i];
          picList.push({name:val,index:i});
        }
        // var jindus = new Array(picArr.length).fill(false);//是否上传中
        // var indexs = new Array(picArr.length);
        // this.setData({jindus:jindus,picArr:picArr});
        this.setData({picList:picList});
      }
      name=this.data.name;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    uploadPics:function(e){
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back'
      }).then(async res => {
        let token = await api.getToken();
        res.tempFiles.forEach(function(k){
          var picList = that.data.picList;
          var index = picList.length;
          var tempFilePath = k.tempFilePath;
          picList.push({name:tempFilePath,jindu:"0%"});
          //上传前渲染
          that.setData({picList:picList});
          const uploadTask = wx.uploadFile({
            url: api.urls.QiniuLocal, 
            filePath: tempFilePath,
            name: 'file',
            header: {
              'token': token
            },
            success (resp){//由于这里只能返回string，所以要手动转换成json
              resp = JSON.parse(resp.data);
              if(resp.code != 0){
                picList[index].jindu="上传失败";
                that.setData({picList:picList});
                return false;
              }else{
                var src = resp.data.src;
                //上传完成去除进度条，图片切换为服务器图片
                picList[index].jindu=false;
                picList[index].name=src;
                that.setData({picList:picList});
                //反馈到真实页面
                var pics = currThat.data[name];
                if(pics){pics="";}else{pics+=",";}
                pics+=src;
                var temp = {};
                temp[name]=pics;
                currThat.setData(temp);
              }
            }
          });
          uploadTask.onProgressUpdate((res) => {
            var progress =res.progress;
            if(progress==100)//上传完成后等待时间有点久，加这个平衡一下
              that.data.picList[index].jindu="核验中";
            else
              that.data.picList[index].jindu=res.progress+"%";
            that.setData({picList:picList});
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          })
        })
        
      });
    },
    //删除图片
    delPic:function(e){
      var index = e.currentTarget.dataset.index;
      
      //删除输入框中的图片
      var picArr = currThat.data.pics.split(",");
      picArr.splice(that.data.picList[index].index,1);
      var temp = {};
      temp[name]=picArr.join();
      currThat.setData(temp);

      //删除插件内的图片
      // that.data.picList.jindu[index]=false;
      that.data.picList.splice(index,1);
      that.setData({picList:that.data.picList});
    },
    showImage:function(event){
      var src = event.currentTarget.dataset.src;
      
      if (src) {
        var picArr = [];
        this.data.picList.forEach(function(val){
          picArr.push(val.name);
        });
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: picArr
        })
      }
    }
  }
})
