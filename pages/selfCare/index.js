var that;
import Api from "../../config/api";
var basePage = require("../../utils/basePage.js");
var oys={},page = basePage.buildBasePage.call(this,oys);
Page(Object.assign({},page,{
  data: {

  },
  onLoad(options) {
    that = this;
  }
}));