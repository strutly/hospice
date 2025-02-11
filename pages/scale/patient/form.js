var that;
import Api from "../../../config/api";
import WxValidate from "../../../utils/WxValidate";
var basePage = require("../../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {
    sexArr:['请选择性别','男','女'],
    patient:{gender:0},
    endDay:new Date().toLocaleDateString()
  },
  async onLoad(options) {
    that = this;
    that.initValidate();
    let res = await Api.detailPatient({
      id:options.id
    });
    that.setData({
      patient:res.data||{gender:0}
    })
  },
  onShow() {
    page.onShow.call(this);
  },
  initValidate() {
    const rules = {
      name: {
        required: true
      },
      gender:{
        required: true,
        min:1
      },
      phone: {
        required: true,
        tel:true
      },
      birthday: {
        required: true
      }
      
    };
    const messages = {
      name: {
        required: "请输入姓名"
      },
      phone: {
        required: "请输入手机号",
        tel:"请输入正确的手机号"
      },
      birthday: {
        required: "请选择出生日期"
      },
      gender:{
        required: "请选择性别",
        min:"请选择性别1"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  pickerChange(e){
    console.log(e)
    let type = e.currentTarget.dataset.type;
    that.setData({
      ["patient."+type]:e.detail.value
    })
  },
  showTips(msg, type = "error") {
    that.setData({
      msg: msg,
      type: type,
      show: true
    })
  },
  async submit(e){
    console.log(e)
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    } 
    let res = {};
    if(data.id){
      res = await Api.updatePatient(data);
    }else{
      res = await Api.addPatient(data);
    }    
    console.log(res);
    if(res.code==0){
      that.showTips("提交成功","success");
      var pages = getCurrentPages(); //当前页面
      var beforePage = pages[pages.length - 2]; //前一页      

      setTimeout(function(){
        beforePage.search("");
        wx.navigateBack({
          delta: 1,
        })
      },2000);
    }else{
      that.showTips(res.msg,"error");
    }
  }
}))