// pages/share/album.js
var api = require("../../config/api");
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来
var oys={},page = basePage.buildBasePage.call(this,oys),that;
var innerAudioContext;
Page(Object.assign({},page,{
  data: {
    pageNum:1,
    musics:[]
  },
  onLoad(options) {
    page.onLoad.call(this,options);
    that=oys.that;
    this.getList(1);
    innerAudioContext = wx.createInnerAudioContext();
  },
  onShow() {
    page.onShow.call(this);
  },
  formSubmit: async function (e) {
    console.log(e)
    let data = e.detail.value;
    if(data.name){}
    // data.music={id:};
    // let res = await api.addAlbum(data);
    // console.log(res);
  },
  async getList(page) {
    let param = {
      pageNum: page,
      pageSize: 20
    }
    let res = await api.getMusic(param);
    let musics = that.data.musics;
    musics = musics.concat(res.data.content);
    console.log(musics)
    let pageNum = that.data.pageNum;
    pageNum = page;
    let endline = that.data.endline;
    endline = res.data.last;
    var array = [];
    musics.forEach(function(v){
      array.push(v.name);
    });
    oys.that.setData({
      pageNum: pageNum,
      endline:endline,
      musics: musics,
      array:array
    });
  },
  playAudio(e){
    var index = e.detail.value;
    this.setData({
      index: index
    });
    var url = this.data.musics[index].url;
    
    innerAudioContext.autoplay = true
    innerAudioContext.src = url;
    innerAudioContext.onPlay(() => {
      
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  onUnload(){
    innerAudioContext.stop();
  },
}));