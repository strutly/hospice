var that, interval;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {
    lists:[],
    level:['无症状','轻微症状','中等症状','严重症状'],
    num:11
  },
  onLoad(options) {
    that = this;
    let lists = wx.getStorageSync('lists')||[{title:"您的症状有多严重?",des:"癌症患者常有疾病本身或治疗相关的各种症状。我们想知道您在过去的24小时中下列症状的严重程度。请将下列每一项从0(无症状)至10(能想象的最严重程度)之间圈一数字以表示症状的严重度。",questions:[{"title":"您疼痛最严重的程度为?","score":-1},{"title":"您疲劳(乏力)最严重程度为?","score":-1},{"title":"您恶心最严重的程度为?","score":-1},{"title":"您睡眠不安最严重的程度为?","score":-1},{"title":"您最苦恼的程度为?","score":-1},{"title":"您气短最严重的程度为?","score":-1},{"title":"您健忘最严重的程度为?","score":-1},{"title":"您胃口最差的程度为?","score":-1},{"title":"您瞌睡(昏昏欲睡)最严重的程度为?","score":-1},{"title":"您口干最严重的程度为?","score":-1}]},{title:"您的症状妨碍您生活的程度?",des:"症状常常干扰我们的感受和功能我们想知道在过去的24小时中症状干扰您下列各项活动的严重程度。",questions:[{"title":"您悲伤感最严重的程度为?","score":-1},{"title":"您呕吐最严重的程度为?","score":-1},{"title":"您麻木感最严重的程度为?","score":-1},{"title":"一般活动?","score":-1},{"title":"情绪?","score":-1},{"title":"工作(包括家务劳动)?","score":-1},{"title":"与他人的关系?","score":-1},{"title":"走路?","score":-1},{"title":"生活乐趣?","score":-1}]}];
    that.setData({
      lists:lists
    })
  },
  onShow() {
    page.onShow.call(this);    
  },
  scoreChange(e){
    console.log(e);
    let i = e.currentTarget.dataset.i;
    let k = e.currentTarget.dataset.k;
    let lists = that.data.lists;
    let question = lists[i].questions[k];
    console.log(question)
    let score = e.detail.value;
    let des = "";
    let red = false;
    let color = ""
    if(score==0){
      des = "无症状";
      color = "blue";
    }else if(score>0&&score<5){
      des = "轻微症状";
      color = "yellow";
    }else if(score>4&&score<7){
      des = "中等症状";
      color = "orange";
    }else{
      des = "严重症状";
      color = "red";
      red = true;
    }
    question.score = e.detail.value;
    question.des = des;
    question.red = red;
    question.color = color;
    console.log(question)
    console.log(lists);
    that.setData({
      lists:lists
    })
  },
  showTopTips(msg,type){
    that.setData({
      show:true,
      msg:msg,
      type:type||"error"
    })
  },
  submit(){
    let flag = true;
    let lists = that.data.lists;
    lists.some(list=>{
      list.questions.some(item=>{
        if(item.score<0){
          flag = false;
          that.showTopTips('请选择'+item.title+'的分值');
          return true;
        }
      });      
    });
    if(flag){
      wx.setStorageSync('lists', lists);
      that.showTopTips("保存成功~","success");
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        });
      }, 2000);
    }
  }
}))