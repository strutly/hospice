// pages/share/album.js
var api = require("../../config/api");
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来
var oys={},page = basePage.buildBasePage.call(this,oys),that;
var innerAudioContext,topTips;
Page(Object.assign({},page,{
  data: {
    pageNum:1,
    musics:[]//,
    //pic:["http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png","http://gridpic.tsing-tec.com/hospice%2Fshare-logo-1.png"]
  },
  onLoad(options) {
    page.onLoad.call(this,options);
    that=oys.that;
    this.getList(1);
    innerAudioContext = wx.createInnerAudioContext();
    topTips=this.selectComponent("#topTips");
  },
  onShow() {
    page.onShow.call(this);
  },
  formSubmit: async function (e) {
    console.log(e)
    let data = e.detail.value;
    if(!data.name){topTips.error("请填写标题");return;}
    console.log(this.data.picStatus);
    if(this.data.picStatus){topTips.error("图片还没上传完成");return;}
    if(!this.data.pic){topTips.error("请上传图片");return;}
    var musicIndex = this.data.index;
    if(!musicIndex){topTips.error("请选择音乐");return;}
    data.pic = this.data.pic;
    data.music=this.data.musics[musicIndex];//{id:this.data.musics[musicIndex].id,url:this.data.musics[musicIndex].url};
    let tmpID = "jm7Cj-7sLodfq_kxMk4P3aCvs33bQT9tFWTzgnzuan0";
    let tmpResp = await wx.requestSubscribeMessage({
      tmplIds: [tmpID]
    })
    console.log(tmpResp);
    data.ifAccept = tmpResp[tmpID] === 'accept' ? true : false;
    let res = await api.addAlbum(data);
    if(res.code==0){
      topTips.alert("上传成功,制作完成后通知您",function(e){wx.navigateBack({
        delta: 1,
      })},3000);
    }
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