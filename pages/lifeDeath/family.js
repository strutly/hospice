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
      catalogId:33
    });
    that.setData({
      swiperList:res.data.content
    })
  },  
  onShow() {    
    this.setData({
      systemFontSize:wx.getStorageSync('systemFontSize')||"14px"
    });
    getApp().watch(function (value) {      
      that.setData({
        systemFontSize:value
      })      
    });
  },
  develop(){
    that.setData({
      show:true,
      msg:"该功能正在开发中~",
      type:"error"
    })
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
    if(!title) return;
    
    let res = await Api.searchMaterila({
      source:1,
      title:e.detail.value
    });
    that.setData({
      searchData:res.data
    })    
  }
})