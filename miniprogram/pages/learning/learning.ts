Page({
	data: {
		searchQuery: '',
		activeTab: 0, // 当前活动标签
		images: [
			// 我想学的
			'https://example.com/image1.jpg',
			'https://example.com/image2.jpg',
			'https://example.com/image3.jpg',
			'https://example.com/image4.jpg',
			'https://example.com/image5.jpg'
		],
		myUploads: [
			// 我上传的
			'https://example.com/upload1.jpg',
			'https://example.com/upload2.jpg',
			'https://example.com/upload3.jpg'
		],
		wantToLearnList: [
			{
				id: '1',
				title: '瑜伽基础动作教学：鸽子式',
				thumbnail: '../../images/video1.jpg',
				author: '瑜伽教练小美',
				views: 1000
			},
			{
				id: '2',
				title: '初级瑜伽系列：站姿前屈',
				thumbnail: '../../images/video2.jpg',
				author: '瑜伽教练小美',
				views: 800
			},
			{
				id: '3',
				title: '瑜伽呼吸法：完整冥想指南',
				thumbnail: '../../images/video3.jpg',
				author: '瑜伽教练小美',
				views: 1200
			}
		],
		myUploadList: [
			{
				id: '4',
				title: '瑜伽进阶：倒立教学',
				thumbnail: '../../images/video4.jpg',
				author: '我',
				views: 500
			},
			{
				id: '5',
				title: '瑜伽拜日式教学',
				thumbnail: '../../images/video5.jpg',
				author: '我',
				views: 600
			}
		]
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

	onSearch() {
		wx.navigateTo({
			url: '/pages/search/search'
		});
	},

	// 切换标签
	onTabClick(e: any) {
		const tab = parseInt(e.currentTarget.dataset.tab);
		this.setData({
			activeTab: tab,
			images: tab === 0 ? this.data.images : this.data.myUploads
		});
	},

	onVideoTap(e: any) {
		const { id } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/video-detail/video-detail?id=${id}`
		});
	},

	onLoad(options) {},
	onReady() {},
	onShow() {},
	onHide() {},
	onUnload() {},
	onShareAppMessage() {
		return {
			title: ''
		}
	}
})
