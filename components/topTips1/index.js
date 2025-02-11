var callBack;
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    typeClassMap: {
      warn: 'weui-toptips_warn',
      info: 'weui-toptips_info',
      success: 'weui-toptips_success',
      error: 'weui-toptips_error',
      successCenter:"weui-toptips_success_center"
    },
    delay:2000
  },

  attached() {
  },

  methods: {
    alert(text,fun,delay=this.data.delay) {
      callBack=fun;
      if (text && delay) {
        setTimeout(() => {
          this.setData({
            show: false
          }, () => {
            this.triggerEvent('hide', {}, {});
            fun&&fun();
          });
        }, delay);
      }
      this.setData({
        show: true,
        msg:text,
        className: this.data.typeClassMap['success']
      });
    },
    error(text,fun,delay=this.data.delay) {
      callBack=fun;
      if (text && delay) {
        setTimeout(() => {
          this.setData({
            show: false
          }, () => {
            this.triggerEvent('hide', {}, {});
            fun&&fun();
          });
        }, delay);
      }
      this.setData({
        show: true,
        msg:text,
        className: this.data.typeClassMap['error']
      });
    },
    hide(){
      console.log(this.data)
      this.setData({
        show: false
      }, () => {
        this.triggerEvent('hide', {}, {});
        callBack&&callBack();
      });
      
    }
  }
});
