interface IPost {
    id: string;
    username: string;
    avatar: string;
    timeAgo: string;
    content: string;
    images: string[];
    tags: string[];
    likes: number;
    comments: number;
    isLiked: boolean;
    isFollowed: boolean;
}

Page({
  data: {
    searchQuery: '',
    activeTab: 'follow',
    posts: [] as IPost[],
  },
  onLoad(options) {
    this.loadPosts();
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {
    return {
      title: '',
    };
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

	// 处理搜索操作
	onSearch() {
		wx.navigateTo({
			url: '/pages/search/search'
		});
	},


  // 加载帖子数据
  loadPosts() {
    const { activeTab } = this.data;
    let mockPosts: IPost[] = [];

    // 关注标签的内容
    if (activeTab === 'follow') {
        mockPosts = [
            {
                id: '1',
                username: '李田所',
                avatar: '../../images/486o.jpg',
                timeAgo: '1天前',
                content: '兄啊，最新的动作已经在马不停蹄地录制了，很快就能端上来了！',
                images: [
                    '../../images/video1.jpg',
                    '../../images/video2.jpg',
                    '../../images/video3.jpg'
                ],
                tags: ['仙贝的瑜伽教程', '每日打卡'],
                likes: 114,
                comments: 514,
                isLiked: false,
                isFollowed: true
            },
            {
                id: '2',
                username: '小姐姐',
                avatar: '../../images/486w.jpg',
                timeAgo: '2天前',
                content: '努力学习，早日成为舞蹈区百大！',
                images: [
                    '../../images/video2.jpg',
                    '../../images/video3.jpg',
                    '../../images/video4.jpg'
                ],
                tags: ['舞动青春', '舞蹈教学'],
                likes: 114,
                comments: 514,
                isLiked: true,
                isFollowed: false
            }
        ];
    }
    // 体操区的内容
    else if (activeTab === 'exercise') {
        mockPosts = [
            {
                id: '3',
                username: '健身教练王',
                avatar: '../../images/486o.jpg',
                timeAgo: '3小时前',
                content: '今天教大家一套简单的拉伸动作，每天坚持5分钟，改善体态效果显著！',
                images: [
                    '../../images/video3.jpg',
                    '../../images/video1.jpg'
                ],
                tags: ['拉伸运动', '体态改善', '每日打卡'],
                likes: 256,
                comments: 45,
                isLiked: false,
                isFollowed: false
            },
            {
                id: '4',
                username: '瑜伽达人',
                avatar: '../../images/486w.jpg',
                timeAgo: '1小时前',
                content: '瑜伽初学者必看！这些动作要领要牢记，避免错误姿势带来的伤害。',
                images: [
                    '../../images/video4.jpg'
                ],
                tags: ['瑜伽教学', '初学者指南'],
                likes: 328,
                comments: 67,
                isLiked: true,
                isFollowed: true
            }
        ];
    }
    // 舞蹈区的内容
    else if (activeTab === 'dance') {
        mockPosts = [
            {
                id: '5',
                username: '舞蹈小天后',
                avatar: '../../images/486w.jpg',
                timeAgo: '5小时前',
                content: '新编舞来啦！这是我根据最新流行歌曲编的舞，大家一起来跳吧~',
                images: [
                    '../../images/video2.jpg',
                    '../../images/video3.jpg',
                    '../../images/video4.jpg'
                ],
                tags: ['街舞', '编舞', '舞蹈教学'],
                likes: 892,
                comments: 156,
                isLiked: true,
                isFollowed: true
            },
            {
                id: '6',
                username: '古典舞小仙女',
                avatar: '../../images/486o.jpg',
                timeAgo: '1天前',
                content: '中国古典舞身韵组合，适合零基础学习，一起来感受中国舞的美！',
                images: [
                    '../../images/video1.jpg'
                ],
                tags: ['古典舞', '身韵', '舞蹈教学'],
                likes: 567,
                comments: 89,
                isLiked: false,
                isFollowed: false
            }
        ];
    }

    this.setData({
        posts: mockPosts
    });
  },

  // 切换标签页
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
    this.loadPosts(); // 根据标签重新加载数据
  },

  // 点赞
  handleLike(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const { posts } = this.data;
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });

    this.setData({
      posts: updatedPosts
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 什么都不做，只是阻止事件冒泡
  },

  // 跳转到帖子详情页
  navigateToDetail(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${id}`
    });
  },

  // 评论
  handleComment(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    // 直接跳转到帖子详情页的评论区
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${id}&focus=comment`
    });
  },

  // 关注/取消关注
  toggleFollow(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    const { posts } = this.data;
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isFollowed: !post.isFollowed
        };
      }
      return post;
    });

    this.setData({
      posts: updatedPosts
    });

    wx.showToast({
      title: updatedPosts.find(p => p.id === id)?.isFollowed ? '已关注' : '已取消关注',
      icon: 'none'
    });
  },

  // 预览图片
  previewImage(e: WechatMiniprogram.TouchEvent) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      urls,
      current
    });
  }
});