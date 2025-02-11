/**封装一些功能
 *  var oysUtils=require("../../utils/oysUtils");
 * 申请授权及回调
    oysUtils.auth('scope.writePhotosAlbum',function(){},'请打开添加到相册才能使用该功能');
  下载视频
    oysUtils.downloadVideo(Api.domain+myRecords[index].videoUrl,null,
      function(){that.topTips1.alert("下载中",null,0)},
      function(){that.topTips1.hide();});
 * 
*/
function auth(authStr,succFun,msg='若点击不允许，将无法使用该功能'){
  // 获取用户是否开启 
  wx.getSetting({
    success (res) {
      // 如果没有授权
      if (!res.authSetting[authStr]) {
        // 则拉起授权窗口
        wx.authorize({
          scope: authStr,
          success (data) {
            succFun();
          },
          fail (error) {
            //点击了拒绝授权后--就一直会进入失败回调函数--此时就可以在这里重新拉起授权窗口
            console.log('拒绝授权', error)
            wx.showModal({
              title: '提示',
              content: msg,
              cancelText: '拒绝',
              cancelColor: '#999',
              confirmText: '允许',
              confirmColor: '#f94218',
              success (res) {
                console.log(res)
                if (res.confirm) {
                  // 选择弹框内授权
                  wx.openSetting({
                    success (res) {
                      console.log(res.authSetting)
                    }
                  })
                } else if (res.cancel) {
                  // 选择弹框内 不授权
                  console.log('用户点击不授权')
                }
              }
            })
          }
        })
      } else {
        succFun();
      }
    }
  })
}
module.exports = {
  downloadVideo(url,succFun,beforeFun,afterFun,loadingFun){
    auth('scope.writePhotosAlbum',function(){
      beforeFun&&beforeFun();
      var task = wx.downloadFile({
        url: url, 
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            wx.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success (res) {
                succFun&&succFun(res)
                console.log(res.errMsg)
              },
              complete(){
                wx.showToast({
                  title: "下载完成"
                });
                afterFun&&afterFun();
              }
            })
          }
        },fail(res){
          wx.showToast({
            title: JSON.stringify(res),icon:"error"
          });
        }
      });
      loadingFun&&task.onProgressUpdate(loadingFun);

    },'请打开添加到相册才能使用该功能');
    
  },
  //授权字符串，回调函数，授权提示信息
  auth:auth,
  
}