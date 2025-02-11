var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
import WxValidate from "../../utils/WxValidate";
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {

  },
  async onLoad(options) {
    that = this;
    let res = await Api.getScaleFormByUidAndFid({
      fid: 3
    });
    let scaleForm = res.data;
    let checks = {};
    let evaluation = scaleForm.evaluation || { fid: 3, checkList: [] }
    evaluation.checkList.forEach(c => {
      checks[c.qid] = c;
    })
    that.setData({
      scaleForm: scaleForm,
      checks: checks,
      evaluation: evaluation
    });
    that.initValidate();
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
          messages[q.id] = { required: q.showTitle + "为必答题" };
        }
      })
    })
    that.WxValidate = new WxValidate(rules, messages);
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
    try {
      scaleForm.questionGroups.forEach(group => {
        question = group.questions.find(q => q.id == set_val.qid);
        if (question) throw new Error("EndIterative");
      })
    } catch (e) {

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
      scaleForm: scaleForm,
      checks: checks,
      evaluation: evaluation
    })
  },
  checkboxChange(e) {
    console.log(e);
    let val = e.detail.value;
    let set_val = e.target.dataset;
    let scaleForm = that.data.scaleForm;
    let question;
    try {
      scaleForm.questionGroups.forEach(group => {
        question = group.questions.find(q => q.id == set_val.qid);
        if (question) throw new Error("EndIterative");
      })
    } catch (e) {

    }
    let options = set_val.options;
    console.log(val)
    set_val.options = options.filter(o => {
      console.log(o);
      return val.indexOf(o.value + "") > -1;
    });
    console.log(set_val)
    console.log(options);
    let checks = that.data.checks || {};
    checks[set_val.qid] = set_val;
    let evaluation = that.data.evaluation;
    evaluation.checkList = Object.values(checks);
    that.setData({
      scaleForm: scaleForm,
      checks: checks,
      evaluation: evaluation
    })
  },
  inputChange(e) {
    console.log(e);
    let val = e.detail.value;
    let set_val = e.target.dataset;
    let scaleForm = that.data.scaleForm;
    let question;
    try {
      scaleForm.questionGroups.forEach(group => {
        question = group.questions.find(q => q.id == set_val.qid);
        if (question) throw new Error("EndIterative");
      })
    } catch (e) {

    }
    let options = set_val.options;
    set_val.options = [{
      lable: set_val.title,
      value: val,
      des: val
    }]
    console.log(set_val)
    console.log(options);
    let checks = that.data.checks || {};
    checks[set_val.qid] = set_val;
    let evaluation = that.data.evaluation;
    evaluation.checkList = Object.values(checks);
    that.setData({
      scaleForm: scaleForm,
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
    if (params.id) {
      res = await Api.updateEvaluation(that.data.evaluation);
    } else {
      res = await Api.addEvaluation(that.data.evaluation);
    }
    that.showTopTips(res.msg, res.code == 0 ? 'success' : 'error');
    if (res.code == 0) {
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 2000);
    }

  }
}))