Component({
  properties: {
    firework:{
      type:Boolean,
      value:false,
      observer: '_fireworkChange'
    },
    showImg:{
      type:Boolean,
      value:false
    },
    marqueeDistance: {        //初始滚动距离
      type: [String, Number],
      value: 0        
    },
    size: {       // 字体大小
      type: Number,
      value: 14
    },
    horseRaceLampList: {         // 跑马灯内容
      type: Array,
      value: []
    },
    orientation: {    // 滚动方向
      type: String,
      value: 'left'
    },
    interval: {       // 时间间隔
      type: [String, Number],
      value: 20
    },
    marqueePace: {      // 滚动速度
      type: Number,
      value: 1
    }
  },
  data: {
    showImg:true
  },
  methods: {
    _fireworkChange(newVal){
      if (newVal) {
        setTimeout(() => {
          this.setData({
            firework: false
          }, () => {
            this.triggerEvent('hide', {}, {});
          });
        }, 5000);
      }
      this.setData({
        firework: newVal
      });
    },
    showImg(e){
      console.log(e)
      this.setData({
        showImg:!this.data.showImg,
        pic:e.currentTarget.dataset.pic
      })
    }
  }
})