Page({
  data: {
    ios: true, // 默认为iOS
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
    hasLiked: false,
    commentList: [
      {
        id: 1,
        username: '用户1',
        content: '这个动作讲解得很清楚，对初学者很有帮助！',
        time: '2024-01-24 22:10',
        likes: 0,
        hasLiked: false,
        replyCount: 1
      },
      {
        id: 2,
        username: '用户2',
        content: '非常实用的教程，讲解很专业！',
        time: '2024-01-24 22:15',
        likes: 0,
        hasLiked: false,
        replyCount: 0
      },
      {
        id: 3,
        username: '用户3',
        content: '动作要领讲解得很到位，学到了很多！',
        time: '2024-01-24 22:20',
        likes: 0,
        hasLiked: false,
        replyCount: 2
      }
    ],
    isAscending: true
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
  },

  onBackTap() {
    wx.navigateBack();
  },

  onCommentLikeTap(event: any) {
    const { index } = event.currentTarget.dataset;
    const commentList = this.data.commentList;
    const comment = commentList[index];
    
    comment.hasLiked = !comment.hasLiked;
    comment.likes = comment.hasLiked ? comment.likes + 1 : comment.likes - 1;
    
    this.setData({ 
      [`commentList[${index}]`]: comment 
    });
  },

  onSortTap() {
    const { commentList, isAscending } = this.data;
    const sortedList = [...commentList].reverse();
    
    this.setData({
      commentList: sortedList,
      isAscending: !isAscending
    });
  },

  onStartLearning() {
    wx.redirectTo({
      url: '/pages/camera/camera',
      success: () => {
        wx.showToast({
          title: '请对准摄像头',
          icon: 'none'
        });
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '打开相机失败',
          icon: 'none'
        });
      }
    });
  }
}); 