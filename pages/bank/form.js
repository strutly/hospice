var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {

  },
  async onLoad(options) {
    that = this;
    let res = await Api.getScaleFormByUidAndFid({
      fid:3
    });
    let scaleForm = res.data;
    let checks = {};
    let evaluation = scaleForm.evaluation || {fid:3,checkList: []}
    evaluation.checkList.forEach(c=>{
      checks[c.qid] = c;
    })
    that.setData({
      scaleForm: scaleForm,
      checks:checks,
      evaluation: evaluation
    })
  },
  onShow() {
    page.onShow.call(this);
  },
  radioChange(e) {
    console.log(e);
    let val = e.detail.value;
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
  checkboxChange(e){
    console.log(e);
    let val = e.detail.value;
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
    let options = set_val.options;
    console.log(val)
    set_val.options = options.filter(o => {
      console.log(o);
      return val.indexOf(o.value+"")>-1;
    });
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
  inputChange(e){
    console.log(e);
    let val = e.detail.value;
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
    let options = set_val.options;
    set_val.options = [{
      lable:set_val.title,
      value:val,
      des:val
    }]
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
  }
}))