var that, interval;
import Api from "../../../config/api";
var basePage = require("../../../utils/basePage.js");
import WxValidate from "../../../utils/WxValidate";
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {
    lists: [],
    level: ['无症状', '轻微症状', '中等症状', '严重症状'],
    num: 11
  },
  async onLoad(options) {
    console.log(options)
    that = this;
    let res = await Api.getScaleFormByPidAndFid(options);
    console.log(res);
    let scaleForm = res.data;
    let checks = {};
    let evaluation = scaleForm.evaluation || { fid: options.fid,pid:options.pid,checkList: [] }
    evaluation.checkList.forEach(c=>{
      checks[c.qid] = c;
    })
    that.setData({
      scaleForm: scaleForm,
      checks:checks,
      evaluation: evaluation
    })
    that.initValidate();
  },
  onShow() {
    page.onShow.call(this);
  },
  initValidate() {
    let rules = {};
    let messages = {};
    let scaleForm = that.data.scaleForm;
    console.log(scaleForm);
    scaleForm.questionGroups.forEach(function (group) {
      group.questions.forEach(q => {
        if (q.required) {
          rules[q.id] = { required: true };
          messages[q.id] = { required: "请选择" + q.title + "的分数" };
        }
      })
    })

    that.WxValidate = new WxValidate(rules, messages);
  },
  radioChange(e) {
    console.log(e);
    let set_val = e.target.dataset;
    let scaleForm = that.data.scaleForm;
    let question;
    try{
      scaleForm.questionGroups.forEach(group=>{
        question = group.questions.find(q=>q.id == set_val.qid);
        if(question) throw new Error("EndIterative");
      })
    }catch(e) {

    } 

    console.log(question)

    let val = e.detail.value;
    let des = ""; 
    let red = false; 
    let color = "";
    if(val==0){ 
      des = "无症状"; 
      color = "blue"; 
    }else if(val>0&&val<5){ 
      des = "轻微症状"; 
      color = "yellow"; 
    }else if(val>4&&val<7){ 
      des = "中等症状"; 
      color = "orange"; 
    }else{ 
      des = "严重症状"; 
      color = "red"; 
      red = true; 
    };
    question.color = color;
    question.des = des; 
    question.red = red;

    let options = set_val.options;
    set_val.options = options.filter(o => o.value == val);
    console.log(set_val)
    console.log(options);
    let checks = that.data.checks || {};
    checks[set_val.qid] = set_val;
    let evaluation = that.data.evaluation;
    evaluation.checkList = Object.values(checks);
    that.setData({
      scaleForm:scaleForm,
      checks: checks,
      evaluation: evaluation
    })
  },
  showTopTips(msg, type) {
    that.setData({
      show: true,
      msg: msg,
      type: type || "error"
    })
  },
  async submit(e) {
    console.log(e);
    let params = e.detail.value
    if (!that.WxValidate.checkForm(params)) {
      let error = that.WxValidate.errorList[0];
      var query = wx.createSelectorQuery();
      query.select("#item" + error.param).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        console.log(res);
        //已经滚动的高度
        let scrollTop = res[1].scrollTop;
        //目标距离顶部的高度
        let top = res[0].top;
        wx.pageScrollTo({
          scrollTop: top + scrollTop - 150
        });
      });
      return that.showTopTips(error.msg)
    }
    let res = {}
    if(params.id){
      res = await Api.updateEvaluation(that.data.evaluation);
    }else{
      res = await Api.addEvaluation(that.data.evaluation);
    }
    that.showTopTips(res.msg,res.code==0?'success':'error');
    if(res.code==0){
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 2000);
    }
    
  }
}))