Page({
	data: {
    ios: true, // 默认为iOS
		visibilityOptions: ['公开可见', '好友可见', '仅自己可见'], // 可见范围选项
		visibility: '公开可见', // 当前选中的可见范围
		content: '', // 输入的正文内容
		imagePath: '' // 上传的图片路径
	},

  onLoad() {
    // 判断平台
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });
  },

	// 上传图片
	onUploadImage() {
		wx.chooseMedia({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				this.setData({
					imagePath: res.tempFilePaths[0] // 保存图片路径
				})
			},
			fail: () => {
				wx.showToast({ title: '上传失败', icon: 'none' })
			}
		})
	},

	// 输入正文
	onInputText(e: WechatMiniprogram.Input) {
		this.setData({
			content: e.detail.value // 保存输入内容
		})
	},

	// 选择可见范围
	onVisibilityChange(e: WechatMiniprogram.PickerChange) {
		this.setData({
			visibility: this.data.visibilityOptions[parseInt(e.detail.value)]
		})
	},

	// 发布按钮点击事件
	onPublish() {
		if (!this.data.imagePath || !this.data.content) {
			wx.showToast({ title: '请完善内容', icon: 'none' })
			return
		}

		wx.showToast({
			title: '发布成功',
			icon: 'success'
		})

		// 这里可以添加上传到服务器的逻辑
	}
})
