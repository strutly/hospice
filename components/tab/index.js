// components/edition/index.js
//实现悬浮菜单，top是顶部间距，小程序自己实现顶部菜单时指定
Component({
  data: {
    x:999,y:0,
    direction:"vertical"
  },
  properties: {
    // systemFontSize: {
    //   type: String,
    //   value: "14px"
    // }
    top:Number
  },
  lifetimes: {
    attached: function() {// 在组件实例进入页面节点树时执行
      
    },
    
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.setData({systemFontSize:wx.getStorageSync('systemFontSize') || "14px",
      x:wx.getStorageSync('zuobiao')?wx.getStorageSync('zuobiao').x:9999,//算不出来位置，只能溢出的方式，让系统自己重置位置了
      y:wx.getStorageSync('zuobiao')?wx.getStorageSync('zuobiao').y:0});
      console.log(this.data);
    }
  },
  methods: {
    switch(e) {
      var that=this;console.log(that.data);
      console.log(e)
      let systemFontSize = wx.getStorageSync('systemFontSize') || "14px";
      systemFontSize = systemFontSize == "14px" ? '20px' : '14px';
      wx.setStorageSync('systemFontSize', systemFontSize);
      that.setData({systemFontSize:systemFontSize});
      // getApp().globalData.systemFontSize = systemFontSize;
      getApp().currThat.setData({systemFontSize:systemFontSize});
      // that.setData({x:9999});
      // that.setData({direction:"vertical"});
      console.log(that.data);
      // setTimeout(function(){ that.setData({x:9999})},2000);
    },
    onChange(e) {
      var zuobiao =e.detail;
      
      wx.setStorageSync('zuobiao',zuobiao);
      // this.setData({x:9999});
    },
    tap() {
      this.setData({
        x: 30,
        y: 30
      })
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
    }
  }
})
