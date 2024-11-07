Page({
	data: {
		searchQuery: '', // 保存用户输入的搜索关键词
		tabs: ['关注', '体操区', '舞蹈区', '运动区', 'xx区'], // 选项数据，以后跟数据库链接
		activeTab: 0 // 当前选中项的索引
	},

	// 获取输入框的内容
	onInput(event: any) {
		this.setData({
			searchQuery: event.detail.value
		})
	},

	// 处理搜索操作
	onSearch() {
		const query = this.data.searchQuery.trim()

		if (!query) {
			wx.showToast({
				title: '请输入搜索内容',
				icon: 'none'
			})
			return
		}

		// 在这里执行搜索逻辑，比如请求 API 或在本地数组中查找
		wx.showToast({
			title: `搜索: ${query}`,
			icon: 'success'
		})

		// 例如：可以跳转到搜索结果页面并传递关键词
		wx.navigateTo({
			url: `/pages/search-results/search-results?query=${query}`
		})
	},

	onTabClick(event: any) {
		const index = event.currentTarget.dataset.index
		this.setData({
			activeTab: index
		})
	}
})
