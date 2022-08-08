// components/pics/pics.js
/**多图片上传插件，
 * 未完成，终止上传先不做了
 * 由于有上传失败的情况，所以不能直接把外部给过来的值渲染
 * 由于插件中的input无法被form直接识别，所以用这种写法，{{pics}}对应的是表单的数据,由于插件内我并没有写solt，
 *      所以input不会显示出来，name="pics"用于告知表单name
 *  <pics pics="{{pics}}" name="pics" status="picStatus">
      <!--<input name="pics" value="{{pics}}"/>-->
    </pics>
    本打算用外部form直接读取所有表单数据，结果测试发现input，textarea这玩意靠这方法赋值不靠谱，字符数达到一定长度就会被丢失，只能手动获取了，
      name表示在data中的名字，图片按逗号拼接的字符串;
      status表示在data中的名字，进度是否完成
  增加删除时终止上传
 * */
const api = require("../../config/api");
const qiniuUploader = require("../../utils/qiniuUploader");
var that,currThat,name,currTask,uploading;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pics:String,
    uploading:String,
    name:String//对应表单中的名称
  },

  /**
   * 组件的初始数据
   */
  data: {
    picList:[],
    
  },
  pageLifetimes: {
    show: function() {
      that=this;currThat = getApp().currThat;
      // var pics = this.data.pics;
      // if(pics){
      //   var picArr = this.data.pics.split(",");
      //   var picList = [];
      //   for (let i = 0; i < picArr.length; i++) {
      //     var val = picArr[i];
      //     picList.push({name:val,index:i});
      //   }
      //   // var jindus = new Array(picArr.length).fill(false);//是否上传中
      //   // var indexs = new Array(picArr.length);
      //   // this.setData({jindus:jindus,picArr:picArr});
      //   this.setData({picList:picList});
      // }
      name=this.data.name;
      uploading=this.data.uploading;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    uploadPics:function(e){
      // 初始化七牛云配置
      initQiniu();
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back'
      }).then(async res => {
        console.log(res);
        let token = await api.getToken();
        var picList = that.data.picList;
        var index = picList.length;
        //多线程上传图片会内存溢出，所以改成一张一张上传，让用户一次选择
        for(var i=0,len=res.tempFiles.length;i<len;i++){
          var k = res.tempFiles[i];
          var tempFilePath = k.tempFilePath;
          var data={name:tempFilePath,jindu:"上传中"};
          if(k.size>3*1024*1024){//大于3兆压缩80%
            if(k.size>10*1024*1024){//大于10兆压缩50%
              data.quality=50;
            }else
              data.quality=80;
            data.jindu="等待中";
              compressImage(tempFilePath,data,function(tempFilePath,data){//异步与原逻辑脱离
                var picList = that.data.picList;
                var index = picList.indexOf(data);
                if(index==-1){//目标已被删除，不需要操作了
                  console.log("目标已被删除，不需要操作了");
                  return;
                }else{
                  picList[index].name=tempFilePath;
                  picList[index].jindu="上传中";
                }
                that.setData({picList:picList});
              });
          }
          picList.push(data);
        }
        console.log(picList);
        //上传前渲染
        that.setData({picList:picList,isUpload:true});
        var temp = {};
        temp[uploading]=true;
        currThat.setData(temp);
        startUpload();
      });
    },
    //删除图片
    delPic:function(e){
      var index = e.currentTarget.dataset.index;
      var picList = that.data.picList;
      that.data.picList.splice(index,1);
      that.setData({picList:picList});
      //如果删除的是正在上传的就终止当前上传
      if(currTask&&currTask.index==index){
          currTask.task.abort();currTask=undefined;
      }
      var picArr=[];
      picList.forEach(function(val){if(!val.jindu){picArr.push(val.name);}});
      var temp = {};
      temp[name]=picArr.join();
      currThat.setData(temp);
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
});
//上传任务管理
async function startUpload(){
  var picList = that.data.picList;
  // let token = await api.getToken();
  for(var i=0,len=picList.length;i<len;i++){//将准备好的资源上传
    var data=picList[i];
    if(data.jindu=="上传中"){//代表该资源就绪准备上传
      console.log("上传开始");
      data.jindu="上传中...";
      that.setData({picList:picList});
      // await upload(data,token);//异步改同步
      try {
        uploadQiniu(data);
      } catch (error) {
        console.log(error)
        return;
      }
      console.log("上传完成");
    }
  }
  picList = that.data.picList;
  for(var i=0,len=picList.length;i<len;i++){//核验是否存在漏网的
    var data=picList[i];
    if(data.jindu=="等待中"||data.jindu=="上传中"){
      setTimeout(startUpload, 1000);
      return;//存在未上传完成的，重新启动上传
    }
  }
  //全部图片已上传完成
  var temp = {};
  temp[uploading]=false;
  console.log(temp)
  currThat.setData(temp);
  that.setData({isUpload:false});
  // setTimeout(startUpload, 1000);
}
/**先传七牛，然后再告诉自己服务器*/
function uploadQiniu(data,token){
  var time= Date.now();
  var picList = that.data.picList;
  var index = picList.indexOf(data);
  if(index==-1){//目标已被删除，不需要操作了
    console.log("目标已被删除，不需要操作了");
    callBack();
  }
  qiniuUploader.upload(data.name, async (res) => {
      picList = that.data.picList;
      console.log(picList);
      // resp = JSON.parse(resp.data);
      currTask=undefined;
      // if(resp.code != 0){
      //   picList[index].jindu=resp.msg||"上传失败";
      //   wx.showToast({
      //     title: resp.msg,
      //     icon:"error"
      //   });
      //   that.setData({picList:picList});
      //   return false;
      // }else
      {
        // var src = res.fileURL;
        let resp = await api.wxAudit(res.key);
        if(resp.code != 0){
          picList[index].jindu=resp.msg||"上传失败";
          wx.showToast({
            title: resp.msg,
            icon:"error"
          });
          that.setData({picList:picList});
          return false;
        }else{
          var src = resp.data.src;
          //上传完成去除进度条
          picList[index].jindu=false;
          //，图片切换为服务器图片，从服务器下载预览图片，不喜欢可以注释掉
          // picList[index].name=src;
          picList[index].src=src;
          that.setData({picList:picList});
          //反馈到真实页面
          // var pics = currThat.data[name];
          // if(!pics){pics="";}else{pics+=",";}
          // pics+=src;
          console.log(picList);
          var picArr=[];
          picList.forEach(function(val){if(!val.jindu){picArr.push(val.src);}});
          var temp = {};
          temp[name]=picArr.join();
          currThat.setData(temp);
          console.log(temp);
          // callBack();
        }
        // //上传完成去除进度条
        // picList[index].jindu=false;
        // //，图片切换为服务器图片，从服务器下载预览图片，不喜欢可以注释掉
        // // picList[index].name=src;
        // picList[index].src=src;
        // that.setData({picList:picList});
        // //反馈到真实页面
        // // var pics = currThat.data[name];
        // // if(!pics){pics="";}else{pics+=",";}
        // // pics+=src;
        // console.log(picList);
        // var picArr=[];
        // picList.forEach(function(val){if(!val.jindu){picArr.push(val.src);}});
        // var temp = {};
        // temp[name]=picArr.join();
        // currThat.setData(temp);
        // console.log(temp);
        // callBack();
      }
    }, (error) => {
      picList = that.data.picList;
      picList[index].jindu="上传失败";
      that.setData({picList:picList});
      console.error('error: ' + JSON.stringify(error));
    },
    null,
    (res) => {
      picList = that.data.picList;
      var progress =res.progress;
      if(progress==100){//上传完成后等待时间有点久，加这个平衡一下
        that.data.picList[index].jindu="核验中";
        
      }else{
        that.data.picList[index].jindu=res.progress+"%";
        if(Date.now()-time>999)
          that.setData({picList:picList});
      }
    }, cancelTask => that.setData({ cancelTask })
  );
}
/**直接传自己服务器(暂时废弃)*/
function upload(data,token){
  
  return new Promise((callBack,failFun)=>{
    var picList = that.data.picList;
    var index = picList.indexOf(data);
    if(index==-1){//目标已被删除，不需要操作了
      console.log("目标已被删除，不需要操作了");
      callBack();
    }
    const uploadTask = wx.uploadFile({
      timeout:9999999,
      url: api.urls.QiniuLocal, 
      filePath: data.name,
      name: 'file',
      header: {
        'token': token
      },
      success (resp){//由于这里只能返回string，所以要手动转换成json
        picList = that.data.picList;
        console.log(picList);
        resp = JSON.parse(resp.data);
        currTask=undefined;
        if(resp.code != 0){
          picList[index].jindu=resp.msg||"上传失败";
          wx.showToast({
            title: resp.msg,
            icon:"error"
          });
          that.setData({picList:picList});
          return false;
        }else{
          var src = resp.data.src;
          //上传完成去除进度条
          picList[index].jindu=false;
          //，图片切换为服务器图片，从服务器下载预览图片，不喜欢可以注释掉
          // picList[index].name=src;
          picList[index].src=src;
          that.setData({picList:picList});
          //反馈到真实页面
          // var pics = currThat.data[name];
          // if(!pics){pics="";}else{pics+=",";}
          // pics+=src;
          console.log(picList);
          var picArr=[];
          picList.forEach(function(val){if(!val.jindu){picArr.push(val.src);}});
          var temp = {};
          temp[name]=picArr.join();
          currThat.setData(temp);
          console.log(temp);
          // callBack();
        }
      },
      complete(){
        
        callBack();
      }
    });
    uploadTask.onProgressUpdate((res) => {
      picList = that.data.picList;
      var progress =res.progress;
      if(progress==100)//上传完成后等待时间有点久，加这个平衡一下
        that.data.picList[index].jindu="核验中";
      else
        that.data.picList[index].jindu=res.progress+"%";
      console.log(res.progress);
      that.setData({picList:picList});
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    });
    currTask={index:index,task:uploadTask};
  });
  
}
//压缩图片异步转同步，结果发现改同步是烂棋，这货执行太慢了
function compressImage(tmpPath,data,callBack){
  // return new Promise((callBack,failFun)=>{
    wx.compressImage({//压缩图片
      src: tmpPath, // 图片路径
      quality: data.quality, // 压缩质量
      success:function(res){
        callBack(res.tempFilePath,data);
      }
    })
  // });
}

// 初始化七牛云相关配置
async function initQiniu() {
  console.log(api.QINIU)
  var options = {
      // bucket所在区域，这里是华北区。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
      region: 'ECN',

      // 获取uptoken方法三选一即可，执行优先级为：uptoken > uptokenURL > uptokenFunc。三选一，剩下两个置空。推荐使用uptokenURL，详情请见 README.md
      // 由其他程序生成七牛云uptoken，然后直接写入uptoken
      uptoken: '',
      // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
      uptokenURL: api.QINIU,
      // uptokenFunc 这个属性的值可以是一个用来生成uptoken的函数，详情请见 README.md
      uptokenFunc: function () { },

      // bucket 外链域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 fileURL 字段。否则需要自己拼接
      domain: 'http://gridpic.tsing-tec.com',
      // qiniuShouldUseQiniuFileName 如果是 true，则文件的 key 由 qiniu 服务器分配（全局去重）。如果是 false，则文件的 key 使用微信自动生成的 filename。出于初代sdk用户升级后兼容问题的考虑，默认是 false。
      // 微信自动生成的 filename较长，导致fileURL较长。推荐使用{qiniuShouldUseQiniuFileName: true} + "通过fileURL下载文件时，自定义下载名" 的组合方式。
      // 自定义上传key 需要两个条件：1. 此处shouldUseQiniuFileName值为false。 2. 通过修改qiniuUploader.upload方法传入的options参数，可以进行自定义key。（请不要直接在sdk中修改options参数，修改方法请见demo的index.js）
      // 通过fileURL下载文件时，自定义下载名，请参考：七牛云“对象存储 > 产品手册 > 下载资源 > 下载设置 > 自定义资源下载名”（https://developer.qiniu.com/kodo/manual/1659/download-setting）。本sdk在README.md的"常见问题"板块中，有"通过fileURL下载文件时，自定义下载名"使用样例。
      shouldUseQiniuFileName: false
  };
  options.serverToken = await api.getToken();
  // 将七牛云相关配置初始化进本sdk
  qiniuUploader.init(options);
}