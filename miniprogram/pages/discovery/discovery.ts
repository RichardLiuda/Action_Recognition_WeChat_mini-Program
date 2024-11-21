Page({
	data: {
		searchQuery: '', // 保存用户输入的搜索关键词
		tabs: ['关注', '体操区', '舞蹈区', '运动区', 'xx区'], // 选项数据，以后跟数据库链接
		activeTab: 0, // 当前选中项的索引
		videoRows: [
			[
				{
					id: 1,
					thumbnail: '/images/video1.jpg',
					title: '瑜伽第一组，静心冥坐',
					description: '爱穿绿衣服'
				},
				{
					id: 2,
					thumbnail: '/images/video2.jpg',
					title: '瑜伽第二组，静心冥坐的正确姿态',
					description: '爱穿绿衣服'
				}
			],
			[
				{
					id: 3,
					thumbnail: '/images/video3.jpg',
					title: '瑜伽第三组，过去年十年都做错了',
					description: '爱穿绿衣服'
				},
				{
					id: 4,
					thumbnail: '/images/video4.jpg',
					title: '瑜伽第四组，坚持锻炼，是练成好身材的关键',
					description: '爱穿绿衣服'
				}
			]
		]
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
