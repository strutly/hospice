// components/left-touch/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    left:Number,//左移菜单的宽度
    move:Boolean//是否是左划状态
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart(e){
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        move: false,
        delete:false,
        put:false
      })
    },
    //滑动事件处理
    touchmove: function (e) {
  
      var index = e.currentTarget.dataset.index,//当前索引
      startX = this.data.startX,//开始X坐标
      startY = this.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      if (Math.abs(angle) > 30) return;
      if(touchMoveX < startX){
        this.setData({
          move:true,
          // moveIndex:index
          style:"transform: translateX(0rpx)"
        })
      }
    },
    angle: function (start, end) {
      var _X = end.X - start.X,
      _Y = end.Y - start.Y
      //返回角度 /Math.atan()返回数字的反正切值
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
  }
})
