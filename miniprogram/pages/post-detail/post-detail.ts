interface IPostDetail {
  id: string;
  content: string;
  images: string[];
  createTime: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  tags?: string[];
  userInfo: {
    id: string;
    avatarUrl: string;
    nickName: string;
    isFollowed: boolean;
  }
}

interface IComment {
  id: string;
  content: string;
  createTime: string;
  likeCount?: number;
  isLiked?: boolean;
  userInfo: {
    id: string;
    avatarUrl: string;
    nickName: string;
  }
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

Page({
  data: {
    post: {} as IPostDetail,
    comments: [] as IComment[],
    commentText: '',
    page: 1,
    pageSize: 20,
    loading: false,
    hasMore: true,
    showCommentInput: false
  },

  onLoad(options) {
    if (options.id) {
      this.getPostDetail(options.id);
      this.getComments(options.id);
      
      // 如果需要聚焦到评论区
      if (options.focus === 'comment') {
        // 延迟一下，等待页面渲染完成
        setTimeout(() => {
          this.setData({
            showCommentInput: true
          });
        }, 500);
      }
    }
  },

  // 获取帖子详情
  async getPostDetail(postId: string) {
    try {
      // 模拟API调用
      const mockPost: IPostDetail = {
        id: postId,
        content: '冲击100分！',
        images: ['../../images/video1.jpg', '../../images/video2.jpg'],
        createTime: '1小时前',
        likeCount: 11,
        commentCount: 3,
        isLiked: false,
        tags: ['物理拉伸', '每日打卡'],
        userInfo: {
          id: '1',
          avatarUrl: '../../images/486w.jpg',
          nickName: '妹子1号',
          isFollowed: false
        }
      };

      this.setData({
        post: mockPost
      });
    } catch (error) {
      wx.showToast({
        title: '获取帖子详情失败',
        icon: 'none'
      });
    }
  },

  // 获取评论列表
  async getComments(postId: string, refresh = false) {
    if (this.data.loading || (!refresh && !this.data.hasMore)) return;

    try {
      this.setData({ loading: true });

      const page = refresh ? 1 : this.data.page;
      // 模拟API调用
      const mockComments: IComment[] = [
        {
          id: '1',
          content: '女神加油！',
          createTime: '1小时前',
          likeCount: 1,
          isLiked: false,
          userInfo: {
            id: '2',
            avatarUrl: '../../images/486o.jpg',
            nickName: 'Manba'
          }
        },
        {
          id: '2',
          content: '看好你！',
          createTime: '2小时前',
          likeCount: 0,
          isLiked: false,
          userInfo: {
            id: '3',
            avatarUrl: '../../images/486o.jpg',
            nickName: 'Out!'
          }
        }
      ];

      const mockResponse = {
        total: 2,
        items: mockComments
      };

      const { items, total } = mockResponse;
      this.setData({
        comments: refresh ? items : [...this.data.comments, ...items],
        page: page + 1,
        hasMore: this.data.comments.length < total,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: '获取评论失败',
        icon: 'none'
      });
    }
  },

  // 预览图片
  previewImage(e: any) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data.post;
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  // 点赞/取消点赞
  async toggleLike() {
    try {
      const { post } = this.data;
      
      // 先更新UI，提供即时反馈
      this.setData({
        'post.isLiked': !post.isLiked,
        'post.likeCount': post.isLiked ? post.likeCount - 1 : post.likeCount + 1
      });

      // 模拟API调用
      const mockResponse = {
        isLiked: !post.isLiked,
        likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
      };

      // 如果API调用失败，回滚UI状态
      if (!mockResponse) {
        this.setData({
          'post.isLiked': post.isLiked,
          'post.likeCount': post.likeCount
        });
        throw new Error('点赞失败');
      }

      // 可以添加震动反馈
      wx.vibrateShort({
        type: 'medium'
      });
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 关注/取消关注
  async toggleFollow() {
    try {
      const { userInfo } = this.data.post;
      // 模拟API调用
      const mockResponse = {
        isFollowed: !userInfo.isFollowed
      };

      this.setData({
        'post.userInfo.isFollowed': mockResponse.isFollowed
      });

      wx.showToast({
        title: mockResponse.isFollowed ? '已关注' : '已取消关注',
        icon: 'none'
      });
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 评论输入
  onCommentInput(e: WechatMiniprogram.Input) {
    this.setData({
      commentText: e.detail.value
    });
  },

  // 提交评论
  async submitComment() {
    const { commentText, post } = this.data;
    if (!commentText.trim()) {
      return wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
    }

    try {
      // 模拟API调用
      const mockNewComment: IComment = {
        id: Date.now().toString(),
        content: commentText,
        createTime: '刚刚',
        userInfo: {
          id: '4',
          avatarUrl: '../../images/486o.jpg',
          nickName: '当前用户'
        }
      };

      this.setData({
        comments: [mockNewComment, ...this.data.comments],
        commentText: '',
        'post.commentCount': post.commentCount + 1
      });

      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: '发表评论失败',
        icon: 'none'
      });
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    const { id } = this.data.post;
    await Promise.all([
      this.getPostDetail(id),
      this.getComments(id, true)
    ]);
    wx.stopPullDownRefresh();
  },

  // 触底加载更多
  onReachBottom() {
    const { id } = this.data.post;
    this.getComments(id);
  },

  // 点赞评论
  async toggleCommentLike(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const { comments } = this.data;
    const commentIndex = comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) return;

    try {
      const comment = comments[commentIndex];
      // 先更新UI
      this.setData({
        [`comments[${commentIndex}].isLiked`]: !comment.isLiked,
        [`comments[${commentIndex}].likeCount`]: comment.isLiked ? 
          (comment.likeCount || 0) - 1 : 
          (comment.likeCount || 0) + 1
      });

      // 可以添加震动反馈
      wx.vibrateShort({
        type: 'light'
      });
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  }
}); 