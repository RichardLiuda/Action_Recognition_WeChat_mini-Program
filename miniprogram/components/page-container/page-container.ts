Component({
  properties: {
    customStyle: {
      type: String,
      value: ''
    },
    navBarHeight: {
      type: Number,
      value: 0
    }
  },
  data: {
    ios: true, // 默认为iOS
    paddingTop: 'padding-top: calc(60px + env(safe-area-inset-top))' // 默认内边距
  },
  lifetimes: {
    attached() {
      // 判断平台
      wx.getSystemInfo({
        success: (res) => {
          const isAndroid = res.platform === 'android'
          // 计算默认的内边距
          const statusBarHeight = res.statusBarHeight || 0
          const navBarContentHeight = isAndroid ? 48 : 44
          const paddingTop = statusBarHeight + navBarContentHeight + 10 // 加10px的额外空间
          
          this.setData({
            ios: !isAndroid,
            paddingTop: `padding-top: ${paddingTop}px`
          });
        }
      });
    }
  },
  methods: {
    // 接收导航栏高度变化的通知
    onNavBarHeightChange(e: {detail?: {height?: number}}) {
      if (e.detail && e.detail.height) {
        const paddingTop = e.detail.height + 10; // 加10px的额外空间
        this.setData({
          paddingTop: `padding-top: ${paddingTop}px`
        });
      }
    }
  }
}) 