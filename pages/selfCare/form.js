var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
import WxValidate from "../../utils/WxValidate";
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {
    sum:0,
    qindex: 0,
    showResult: ['最高分是30分，最低分就是6分，您的分数是（num），分数越高，代表您的自我关怀意识越强。', '最高分是25分，最低分是5分，您的分数是（num），分数越高，代表您的自我关怀知识掌握程度越高。', '最高分是30分，最低分是6分，您的分数是（num），分数越高，代表您健康自我保持能力越强。', '最高分是50分，最低分是10分，您的分数是（num），分数越高，代表您的职业自我发展潜力越高。','最高分是45分，最低分是9分，您的分数是（num），分数越高，代表您内在自我调节能力越强。']
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getScaleFormByUidAndFid({
      fid: 1
    });
    console.log(res);
    let scaleForm = res.data;
    let checks = {};
    let evaluation = scaleForm.evaluation || { fid: 1, checkList: [] }
    evaluation.checkList.forEach(c => {
      checks[c.qid] = c;
    })
    that.setData({
      scaleForm: scaleForm,
      checks: checks,
      evaluation: evaluation
    });
    that.initValidate(0);
  },
  initValidate(index) {
    let rules = {};
    let messages = {};
    let scaleForm = that.data.scaleForm;
    console.log(scaleForm.questionGroups[index]);
    scaleForm.questionGroups[index].questions.forEach(q => {
      if (q.required) {
        rules[q.id] = { required: true };
        messages[q.id] = { required: q.showTitle + "为必答题" };
      }
    })
    console.log(rules);
    console.log(messages);
    that.WxValidate = new WxValidate(rules, messages);
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
    });
    that.countResult();
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
    let qindex = that.data.qindex;
    let scaleForm = that.data.scaleForm;
    if (qindex + 1 < scaleForm.questionGroups.length) {
      that.setData({
        qindex: qindex + 1
      })
      wx.pageScrollTo({
        scrollTop: 0
      });
      that.initValidate(qindex + 1);
      that.countResult();
      return;
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
  },
  countResult() {
    let qindex = that.data.qindex;
    let scaleForm = that.data.scaleForm;
    let checkList = that.data.evaluation.checkList;
    console.log(checkList)
    let gsort = scaleForm.questionGroups[qindex].sort;
    let checks = checkList.filter(function (item) { return item.groupSort == gsort });
    console.log(checks);
    let sum = 0;
    checks.forEach(item=>{
      console.log(item)
      sum += item.options[0].value;      
    });
    that.setData({
      sum:sum
    })


  }
}));