// var app = getApp();

var that;
module.exports = {
  //构建每个页面基础page数据
  buildBasePage:function(obj){
    return {
      onLoad(options) {
        console.log(options)
        that = obj.that=this;
      },
      onShow(){//将当前页面的this共享给所有人
        console.log("show")
        this.setData({
          systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
        });
        getApp().currThat=this;
        // getApp().watch(function (value) {
        //   obj.that.setData({
        //     systemFontSize:value
        //   })      
        // });
      },
      onShareAppMessage: function (res) {
        return {//靠默认值就够了
          // title: '',
          // imageUrl:'http://gridpic.tsing-tec.com/20220627/2680cec2-1a7b-4fc5-9201-32836242aa99.png',
          // path: getCurrentPageUrlWithArgs()
        }
      },
      toUrl: function (event) {
        var url = event.currentTarget.dataset.url;
        if (url) {
          wx.navigateTo({
            url: url
          });
        }else{
          this.alert("目前正在建设或完善中，敬请期待");
        }
      },
      alert(text,fun) {
        wx.showModal({
          content: text,
          showCancel: false,
          success:fun
        })
      },
      confirm(text,succFun,canFun){
        wx.showModal({
          content: text,
          success: res=>{
            if (res.confirm) {
              succFun&&succFun();
            }else{
              canFun&&canFun();
            }
          }
        })
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
  }
}

 //  获取当前页带参数的url,https://blog.csdn.net/weixin_47430078/article/details/121448752
 function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages(); //获取加载的页面
  var currentPage = pages[pages.length - 1]; //获取当前页面的对象 修改数量可以获取之前跳转页面的地址
  var url ='/' + currentPage.route; //当前页面url
  // console.log("url====", url);
  var options = currentPage.options; //如果要获取url中所带的参数可以查看options
  // console.log("options====", options);

  //拼接url的参数
  var urlWithArgs = url + '?';
  for (var key in options) {
      var value = options[key];
      urlWithArgs += key + '=' + value + '&';
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs;
}