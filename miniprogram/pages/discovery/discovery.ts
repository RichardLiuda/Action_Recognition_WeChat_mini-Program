Page({
	data: {
		searchQuery: '', // 保存用户输入的搜索关键词
		// tabs: ['关注', '体操区', '舞蹈区', '运动区', 'xx区'], // 选项数据，以后跟数据库链接
		tabs: [
			{ name: '关注', index: 0 },
			{ name: '体操区', index: 1 },
			{ name: '舞蹈区', index: 2 },
			{ name: '运动区', index: 3 },
			{ name: 'xx区', index: 4 }
		], // 选项数据，以后跟数据库链接
		activeTab: 0, // 当前选中项的索引
		videoContentIndex: 0,
		videoRows: [
			[
				[
					{
						id: 1,
						thumbnail: '/images/video1.jpg',
						title: '我的关注',
						author: '爱穿绿衣服'
					},
					{
						id: 2,
						thumbnail: '/images/video2.jpg',
						title: '我的关注',
						author: '爱穿绿衣服'
					}
				]
			],
			[
				[
					{
						id: 1,
						thumbnail: '/images/video1.jpg',
						title: '体操区',
						author: '爱穿绿衣服'
					},
					{
						id: 2,
						thumbnail: '/images/video2.jpg',
						title: '体操区',
						author: '爱穿绿衣服'
					}
				],
				[
					{
						id: 3,
						thumbnail: '/images/video1.jpg',
						title: '体操区',
						author: '爱穿绿衣服'
					},
					{
						id: 4,
						thumbnail: '/images/video2.jpg',
						title: '体操区',
						author: '爱穿绿衣服'
					}
				]
			],
			[
				[
					{
						id: 1,
						thumbnail: '/images/video1.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					},
					{
						id: 2,
						thumbnail: '/images/video2.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					}
				],
				[
					{
						id: 3,
						thumbnail: '/images/video1.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					},
					{
						id: 4,
						thumbnail: '/images/video2.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					}
				],
				[
					{
						id: 5,
						thumbnail: '/images/video3.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					},
					{
						id: 6,
						thumbnail: '/images/video4.jpg',
						title: '舞蹈区',
						author: '爱穿绿衣服'
					}
				]
			],
			[
				[
					{
						id: 1,
						thumbnail: '/images/video1.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					},
					{
						id: 2,
						thumbnail: '/images/video2.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					}
				],
				[
					{
						id: 3,
						thumbnail: '/images/video1.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					},
					{
						id: 4,
						thumbnail: '/images/video2.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					}
				],
				[
					{
						id: 5,
						thumbnail: '/images/video3.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					},
					{
						id: 6,
						thumbnail: '/images/video4.jpg',
						title: '运动区',
						author: '爱穿绿衣服'
					}
				]
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
			url: '/pages/search-results/search-results?query=${query}'
		})
	},

	onTabClick(event: any) {
		const index = event.currentTarget.dataset.index
		this.setData({
			activeTab: index
		})
		this.setData({
			videoContentIndex: index
		})
		console.log('videoContentIndex=' + this.data.videoContentIndex)
	},

	navigateToUpload() {
		wx.navigateTo({
			url: '/pages/upload/upload'
		})
	},

	onVideoTap(event: any) {
		const videoId = event.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/video-detail/video-detail?id=${videoId}`
		});
	}
})
