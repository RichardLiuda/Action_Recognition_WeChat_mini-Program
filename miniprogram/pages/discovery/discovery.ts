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
		ios: true, // 默认为iOS
		navBarHeight: 0, // 导航栏高度
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

	onLoad() {
		// 判断平台
		wx.getSystemInfo({
			success: (res) => {
				const isAndroid = res.platform === 'android'
				const statusBarHeight = res.statusBarHeight || 0
				const navBarContentHeight = isAndroid ? 48 : 44
				const navBarHeight = statusBarHeight + navBarContentHeight
				
				this.setData({
					ios: !isAndroid,
					navBarHeight: navBarHeight
				});
			}
		});
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
	},

	// 处理导航栏高度变化
	onNavBarHeightChange(e: {detail: {height: number}}) {
		if (e.detail && e.detail.height) {
			this.setData({
				navBarHeight: e.detail.height
			});
			
			// 获取页面容器组件
			const pageContainer = this.selectComponent('#pageContainer');
			if (pageContainer) {
				pageContainer.onNavBarHeightChange(e);
			}
		}
	}
})
