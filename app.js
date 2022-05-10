import Api from "./config/api";
App({
  onLaunch() {
    let that = this;
    Api.login().then(res => {      
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
    login: false
  }
})
