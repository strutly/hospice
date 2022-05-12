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
    auth: false,
    login: false,
    systemFontSize:"14px",
    change:false
  },
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
