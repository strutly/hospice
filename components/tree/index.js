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
	},
	methods: {
		detail:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/article/detail?id="+id,
      })
    }
	}
})