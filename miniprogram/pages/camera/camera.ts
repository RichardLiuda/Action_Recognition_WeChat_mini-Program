interface PoseData {
  accuracy: number;
  progress: number;
  poseName: string;
  poseTip: string;
}

Page({
  data: {
    accuracy: 0,
    progress: 0,
    poseName: '',
    poseTip: ''
  },

  ctx: null as any, // 相机上下文

  onLoad() {
    // 获取相机上下文
    this.ctx = wx.createCameraContext();
    
    // 检查相机权限
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        // 相机权限获取成功
        this.startPoseDetection();
      },
      fail: () => {
        wx.showToast({
          title: '请授权相机权限',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });

    // 获取初始姿势数据
    this.getPoseData();
  },

  startPoseDetection() {
    // 开始接收实时姿势数据
    this.startReceivingPoseData();
  },

  getPoseData() {
    // 模拟初始数据
    this.setData({
      poseName: '鸽子式',
      poseTip: '请保持髋部打开，脊柱挺直，呼吸均匀。'
    });
  },

  startReceivingPoseData() {
    // 模拟每秒接收实时数据
    setInterval(() => {
      this.updatePoseData({
        accuracy: Math.floor(Math.random() * 20 + 80),
        progress: Math.floor(Math.random() * 20 + 80),
        poseName: this.data.poseName,
        poseTip: this.data.poseTip
      });
    }, 1000);
  },

  updatePoseData(data: PoseData) {
    this.setData({
      accuracy: data.accuracy,
      progress: data.progress
    });
  },

  onExitTap() {
    wx.showModal({
      title: '提示',
      content: '确定要退出学习吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/video-detail/video-detail'
          });
        }
      }
    });
  },

  onUnload() {
    // 清理定时器等资源
    // TODO: 关闭WebSocket连接
  }
}); 