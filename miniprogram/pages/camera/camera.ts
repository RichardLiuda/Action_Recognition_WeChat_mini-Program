interface PoseData {
  accuracy: number;
  progress: number;
  poseName: string;
  poseTip: string;
}

Page({
  data: {
    ios: true, // 默认为iOS
    accuracy: 0,
    progress: 0,
    poseName: '',
    poseTip: ''
  },

  ctx: null as any, // 相机上下文

  onLoad() {
    // 判断平台
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });
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
    // 使用示例数据
    this.setData({
      poseName: '鸽子式',
      poseTip: '请保持髋部打开，脊柱挺直，呼吸均匀。注意保持双肩放松，目光平视前方。'
    });
  },

  startReceivingPoseData() {
    let timeElapsed = 0;
    const totalTime = 15; // 15秒完成评测
    
    // 模拟每秒接收实时数据
    const timer = setInterval(() => {
      timeElapsed++;
      
      // 生成渐进式的数据
      const progress = Math.min(Math.floor((timeElapsed / totalTime) * 100), 100);
      const baseAccuracy = 85; // 基础准确度
      const variance = 5; // 上下浮动范围
      
      // 模拟真实场景的准确度波动
      const accuracy = baseAccuracy + Math.floor(Math.random() * variance * 2) - variance;

      this.updatePoseData({
        accuracy,
        progress,
        poseName: this.data.poseName,
        poseTip: this.data.poseTip
      });

      // 评测完成后跳转到结果页
      if (timeElapsed >= totalTime) {
        clearInterval(timer);
        this.onPoseComplete();
      }
    }, 1000);
  },

  updatePoseData(data: PoseData) {
    this.setData({
      accuracy: data.accuracy,
      progress: data.progress
    });
  },

  onPoseComplete() {
    wx.redirectTo({
      url: '/pages/pose-result/pose-result',
      success: () => {
        wx.showToast({
          title: '评测完成',
          icon: 'success'
        });
      }
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