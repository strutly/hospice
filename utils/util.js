const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

function dateFormat(date, format) {
	if(date==""||date==null){
		return "";
	}
  if (typeof date === "string") {
      var mts = date.match(/(\/Date\((\d+)\)\/)/);
      if (mts && mts.length >= 3) {
          date = parseInt(mts[2]);
      }
      date = new Date(date.replace(/-/g, "/"));
  }
  
  if (!date || date.toUTCString() == "Invalid Date") {
      return "";
  }

  var map = {
      "M": date.getMonth() + 1, //月份 
      "d": date.getDate(), //日 
      "h": date.getHours(), //小时 
      "m": date.getMinutes(), //分 
      "s": date.getSeconds(), //秒 
      "q": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
  };
  format = format.replace(/([yMdhmsqS])+/g, function(all, t){
      var v = map[t];
      if(v !== undefined){
          if(all.length > 1){
              v = '0' + v;
              v = v.substr(v.length-2);
          }
          return v;
      }
      else if(t === 'y'){
          return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
  });
  return format;
};

function prompt(that,msg){
  that.setData({
    prompt:true,
    promptMsg:msg
  })
};
//提示
function warn(that, warnMsg) {
  that.setData({
    warn: true,
    warnMsg: warnMsg
  });
  setTimeout(function () {
    that.setData({
      warn: false,
      warnMsg: ''
    })
  }, 1500);
};
//数组分组
function ItemGroupBy(arr, key) {
  let newArr = [],
      types = {},
      newItem, i, j, cur;
  for (i = 0, j = arr.length; i < j; i++) {
      cur = arr[i];
      if (!(cur[key] in types)) {
          types[cur[key]] = { type: cur[key], data: [] };
          newArr.push(types[cur[key]]);
      }
      types[cur[key]].data.push(cur);
  }
  return newArr;
};
const groupBy = (list, fn) => {
  const groups = {};
  list.forEach(function (o) {
      const group = fn(o);
      groups[group] = groups[group] || [];
      groups[group].push(o);
  });

  return groups;
}
module.exports = {
  dateFormat,
  formatTime,
  warn,
  prompt,
  groupBy
}
