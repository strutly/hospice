import Api from "../../config/api";
var that;
Page({
  data: {
    domain:Api.domain,
    cardCur: 0,
    swiperList: [],
    dotStyle: false,
    towerStart: 0,
    direction: ''
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getArticle({
      catalogId:32
    });
    that.setData({
      swiperList:res.data.content
    })
  },   
  onShow() {    
    that.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    });
    getApp().watch(function (value) {      
      that.setData({
        systemFontSize:value
      })      
    });
  },
  search(){
    that.setData({
      search:!that.data.search,
      searchData:[]
    })
  },
  async submit(e){
    console.log(e);
    let title = e.detail.value;
    if(!title) return that.setData({
      msg:"请输入关键词再搜索",
      show:true
    })
    let res = await Api.searchMaterila({
      source:0,
      title:e.detail.value
    });
    that.setData({
      searchData:res.data
    })    
  }
})