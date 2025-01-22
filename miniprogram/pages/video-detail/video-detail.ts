Page({
  data: {
    video: {
      id: '',
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      author: '',
      views: 0,
      likes: 0,
      comments: 0,
      createTime: ''
    },
    isPlaying: false,
    isFollowing: false,
    hasLiked: false
  },

  onLoad(options) {
    if (options.id) {
      // TODO: 根据id获取视频详情
      this.getVideoDetail(options.id);
    }
  },

  getVideoDetail(id: string) {
    // TODO: 调用接口获取视频详情
    // 这里暂时使用模拟数据
    const mockData = {
      id,
      title: '瑜伽基础动作教学：鸽子式',
      description: '鸽子式是一个很好的髋部开启体式，能够帮助我们打开髋关节，缓解腰背疼痛。本视频将为您详细讲解鸽子式的正确体式和注意事项。',
      thumbnail: '../../images/video3.jpg',
      videoUrl: '',
      author: '瑜伽教练小美',
      views: 1000,
      likes: 100,
      comments: 28,
      createTime: '2024-03-20'
    };
    
    this.setData({
      video: mockData
    });
  },

  onPlayVideo() {
    this.setData({
      isPlaying: true
    });
  },

  onFollowTap() {
    const isFollowing = !this.data.isFollowing;
    this.setData({ isFollowing });
    
    wx.showToast({
      title: isFollowing ? '已关注' : '已取消关注',
      icon: 'success'
    });
  },

  onLikeTap() {
    const hasLiked = !this.data.hasLiked;
    const video = this.data.video;
    video.likes = hasLiked ? video.likes + 1 : video.likes - 1;
    
    this.setData({ 
      hasLiked,
      video
    });
    
    wx.showToast({
      title: hasLiked ? '已点赞' : '已取消点赞',
      icon: 'success'
    });
  },

  onCommentTap() {
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },

  onShareAppMessage() {
    const { video } = this.data;
    return {
      title: video.title,
      path: `/pages/video-detail/video-detail?id=${video.id}`,
      imageUrl: video.thumbnail
    };
  }
}); 