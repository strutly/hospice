import Api from "../../config/api";
Component({
  properties: {
    firework: {
      type: Boolean,
      value: false,
      observer: '_fireworkChange'
    },
    showImg: {
      type: Boolean,
      value: false
    },
    marqueeDistance: {        //初始滚动距离
      type: Number,
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
      type: Number,
      value: 20
    },
    marqueePace: {      // 滚动速度
      type: Number,
      value: 1
    }
  },
  data: {
    tabIndex: -1,
    fixedLeft: 0,
    timeOut:null
  },
  methods: {
    _fireworkChange(newVal) {
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
    showPic(e) {
      console.log(e)
      this.setData({
        showImg: !this.data.showImg,
        pic: e.currentTarget.dataset.pic
      })
    },
    showGood(e) {
     let timeOut = this.data.timeOut;
      if(timeOut)clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.setData({
          tap: false,
          tabIndex: -1,
          fixedLeft: this.data.marqueeDistance
        })
      }, 3500);
      this.setData({
        timeOut:timeOut,
        tap: true,
        tabIndex: e.currentTarget.dataset.index,
        fixedLeft: this.data.marqueeDistance
      })
    },
    async praise(e) {
      let res = await Api.addPraise({
        bid: e.currentTarget.dataset.id,
        type: 0
      });
      let index = this.data.tabIndex;
      let list = this.data.horseRaceLampList;
      if (res.code == 0) {
        list[index].ifPraise = false;
        list[index].praiseNum++;
      }
      this.setData({
        horseRaceLampList: list,
        tap: false,
        tabIndex: -1,
        fixedLeft: this.data.marqueeDistance
      })
    }
  }
})