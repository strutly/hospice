var that, yuelineChart;
import Api from "../../../config/api";
var basePage = require("../../../utils/basePage.js");
//以对象形式传参能是参数共享起来,以后要用this,用oys.that,在不声明onload的前提下
var oys = {}, page = basePage.buildBasePage.call(this, oys);
/**
 * if(val==0){ 
      des = "无症状"; 
      color = "blue"; 
    }else if(val>0&&val<5){ 
      des = "轻微症状"; 
      color = "yellow"; 
    }else if(val>4&&val<7){ 
      des = "中等症状"; 
      color = "orange"; 
    }else{ 
      des = "严重症状"; 
      color = "red"; 
      red = true; 
    }
 */

Page(Object.assign({}, page, {

  data: {
    colors:{
      0:'blue',
      1:'yellow'
    }
  },

  async onLoad(options) {
    that = this;
    let res = await Api.getEvaluationDetail(options);
    console.log(res);

    let lists = that.getList(res.data.checkList);
    console.log(lists);
    that.setData({
      lists:lists
    })

  },
  getList(list) {
    const map = {}
    list.forEach((item) => {
      if (!map[item.groupName]) {
        map[item.groupName] = [];
      }
      let option = item.options[0];      
      let val = option.value;
      if(val==0){        
        item.color = "blue"; 
      }else if(val>0&&val<5){        
        item.color = "yellow"; 
      }else if(val>4&&val<7){        
        item.color = "orange"; 
      }else{        
        item.color = "red";        
      };      
      map[item.groupName].push(item)
    })
    return map;
  }

}))