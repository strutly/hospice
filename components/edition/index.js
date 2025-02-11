// components/edition/index.js
Component({
  data: {

  },
  properties: {
    systemFontSize: {
      type: String,
      value: "16px"
    }
  },
  methods: {
    switch(e) {
      console.log(e)
      let systemFontSize = wx.getStorageSync('systemFontSize') || "16px";
      systemFontSize = systemFontSize == "16px" ? '20px' : '16px';
      wx.setStorageSync('systemFontSize', systemFontSize);
      getApp().globalData.systemFontSize = systemFontSize;
    }
  }
})
