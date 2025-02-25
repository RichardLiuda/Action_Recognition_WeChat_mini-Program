interface EvaluationItem {
  part: string;
  suggestions: string[];
}

interface PoseResult {
  finalScore: number;
  accuracy: number;
  completion: number;
  fluency: number;
  evaluations: EvaluationItem[];
}

Page({
  data: {
    ios: true, // 默认为iOS
    finalScore: 0,
    accuracy: 0,
    completion: 0,
    fluency: 0,
    evaluations: [] as EvaluationItem[]
  },

  onLoad(options) {
    // 判断平台
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });
    // 使用示例数据
    const mockData: PoseResult = {
      finalScore: 92,
      accuracy: 95,
      completion: 88,
      fluency: 93,
      evaluations: [
        {
          part: "髋部",
          suggestions: [
            "髋部打开程度良好，继续保持",
            "注意保持髋部水平，避免左右倾斜"
          ]
        },
        {
          part: "脊柱",
          suggestions: [
            "脊柱挺直度非常好",
            "建议在保持挺直的同时放松肩膀"
          ]
        },
        {
          part: "呼吸",
          suggestions: [
            "呼吸节奏均匀，配合动作很好",
            "可以尝试加深呼吸，让动作更流畅"
          ]
        },
        {
          part: "整体表现",
          suggestions: [
            "动作完成度很高",
            "建议放慢速度，更好地体会每个阶段"
          ]
        }
      ]
    };

    this.setData(mockData);
  },

  onRetryTap() {
    // 返回相机页面重新练习
    wx.redirectTo({
      url: '/pages/camera/camera'
    });
  },

  onBackTap() {
    // 返回视频详情页
    wx.redirectTo({
      url: '/pages/video-detail/video-detail'
    });
  }
}); 