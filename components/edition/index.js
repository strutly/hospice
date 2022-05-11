// components/edition/index.js
Component({
  data: {

  },
  properties: {
    systemFontSize: {
      type: String,
      value: "14px"
    }
  },
  methods: {
    switch(e) {
      console.log(e)
      let systemFontSize = wx.getStorageSync('systemFontSize') || "14px";
      systemFontSize = systemFontSize == "14px" ? '22px' : '14px';
      wx.setStorageSync('systemFontSize', systemFontSize);
      getApp().globalData.systemFontSize = systemFontSize;
    }
  }
})
