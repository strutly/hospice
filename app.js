import Api from "./config/api";
App({
  onLaunch() {
    let that = this;
    Api.login().then(res => {
      console.log(res)      
      setTimeout(function () {
        that.globalData.login = true;
        if (res.code == 0) {
          that.globalData.auth = true;
        }else{
          that.globalData.auth = false;
        }
      }, 500);
    });
  },
  globalData: {
    normalFontSize:"14px",
    elderlyFontSize:"20px",
    auth: false,
    login: false,
    systemFontSize:"14px",
    change:false
  },
  //当前页面的that,可以不定义，定义是为了避免报错
  currThat: {},
  watch(method) {
    var obj = this.globalData;
    Object.defineProperty(obj, 'systemFontSize', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        method(value);
      },
      get: function () {
        return this._name;
      }
    })
    if (obj.change) {
      method(obj.systemFontSize);
    }
  }
})
