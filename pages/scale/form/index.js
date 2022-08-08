var that,yuelineChart;
import Api from "../../../config/api";
import wxCharts from "../../../utils/wxChart";
var basePage = require("../../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
Page(Object.assign({}, page, {
  data: {
    indexTab:0
  },
  async onLoad(options) {
    that = this;
    console.log(options);
    that.setData({
      options:options
    })
       
  },
  async onShow() {
    
    page.onShow.call(this);
    let options = that.data.options;
    let res = await Api.getEvaluationStatistics({
      pid:options.id,
      fid:2
    })
    console.log(res);
    that.setData({
      fid:2,
      pid:options.id,
      times:res.data.times,
      vals:res.data.vals,
      changeShow:res.data.times.length>0?true:false
    })
    console.log(res);
    if(res.data.times.length>0){
      that.showLine(0);
    } 
  },
  showLine(index){
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
        name: 'A',
        data: vals[index],
        format: function (val, name) {
          return val + '';
        }
      },
      ],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '数值',
        format: function (val) {
          return val;
        },
        max:10,        
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
  changeQuestion(e){
    console.log(e);
    let index = e.target.dataset.index;
    that.setData({
      indexTab:index
    })
    yuelineChart.updateData({
      series: [{        
        data: that.data.vals[index],
      }]
    })
  }
}))