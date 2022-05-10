Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
 
  /**
   * 组件的初始数据
   */
  data: {
    
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
 
  }
})