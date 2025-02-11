Component({
	properties: {
		treeArr: {
			type: Array,
			value: []
    },
    child: {
			type: Boolean,
			value: false
    },
    show: {
			type: Array,
			value: []
    },
	},
	methods: {
		detail:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/article/detail?id="+id,
      })
    },
    showchild(e){
      let index = e.currentTarget.dataset.index;
      let show = this.data.show;
      show[index] = !show[index];
      this.setData({
        show
      })
    }
	}
})