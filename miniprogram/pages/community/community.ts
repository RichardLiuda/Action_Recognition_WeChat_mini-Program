Page({
  data: {

  },
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {
    return {
      title: '',
    };
  },

  	// 获取输入框的内容
	onInput(event: any) {
		const value = event.detail.value;
		if (value.trim()) {
			wx.navigateTo({
				url: `/pages/search/search?query=${encodeURIComponent(value)}`
			});
			// 清空输入框
			this.setData({
				searchQuery: ''
			});
		}
  },
  	// 处理搜索操作
	onSearch() {
		wx.navigateTo({
			url: '/pages/search/search'
		});
	},
});