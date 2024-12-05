Page({
	data: {
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
		]
	},
	// 切换标签
	onTabClick(e: WechatMiniprogram.BaseEvent) {
		const tab = parseInt(e.currentTarget.dataset.tab)
		this.setData({
			activeTab: tab,
			images: tab === 0 ? this.data.images : this.data.myUploads
		})
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
