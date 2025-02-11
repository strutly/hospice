var that, yuelineChart;
import Api from "../../config/api";
import wxCharts from "../../utils/wxChart";
import WxValidate from "../../utils/WxValidate";
var basePage = require("../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {
    disable:true,
    sexArr:['请选择性别','男','女'],
    patient:{gender:0},
    indexTab: 0,
    options:{
      id:0
    },
    open:[true,false]
  },
  async onLoad(options) {
    that = this;
    let res = await Api.getPatientMy();
    console.log(res);
    if(res.code==0){
      let patient = res.data||{gender:0};
      if(patient.id){
        let res = await Api.getEvaluationStatistics({
          pid: patient.id,
          fid: 1
        })
        console.log(res);
        
        that.setData({
          patient:patient,
          fid: 1,
          times: res.data.times,
          titles:res.data.titles,
          vals: res.data.vals,
          changeShow: res.data.times.length > 0 ? true : false
        });
        if (res.data.times.length > 0) {
          that.showLine(0);
        }
      }
    }
    that.initValidate();
  },
  async onShow() {
    page.onShow.call(this);
    
  },
  showLine(index) {
    let vals = that.data.vals;
    let times = that.data.times;
    console.log(1)
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    yuelineChart = new wxCharts({
      canvasId: 'myChart',
      type: 'line',
      categories: times,
      animation: true,
      series: [{
        name: '日期',
        data: vals[index],
        format: function (val, name) {
          console.log(val)
          return val+'';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '数值',
        format: function (val) {
          return val;
        },
        max: 10,
        min: 0
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  changeQuestion(e) {
    console.log(e);
    let index = e.target.dataset.index;
    that.setData({
      indexTab: index
    })
    yuelineChart.updateData({
      series: [{
        name: '日期',
        data: that.data.vals[index],
      }]
    })
  },
  open(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let open = that.data.open;
    open[index] = !open[index]
    that.setData({
      open:open
    })
  },
  edit(){
    that.setData({
      disable:false
    })
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
      delete data.id;
      res = await Api.addPatient(data);
    }    
    console.log(res);
    if(res.code==0){
      that.showTips("提交成功","success");
      that.onLoad();
      that.setData({
        disable:true
      })      
    }else{
      that.showTips(res.msg,"error");
    }
  }
}))