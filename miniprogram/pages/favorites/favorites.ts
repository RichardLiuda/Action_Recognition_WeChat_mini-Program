interface FavoriteItem {
  id: string;
  type: 'video' | 'post';
  title: string;
  coverUrl: string;
  createTime: string;
  duration?: number;
  author: {
    id: string;
    avatarUrl: string;
    nickName: string;
  };
}

interface IPageData {
  currentType: 'video' | 'post';
  favoritesList: FavoriteItem[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
}

interface IPageMethods {
  fetchFavorites: (isLoadMore?: boolean) => Promise<void>;
  onTabChange: (e: WechatMiniprogram.TouchEvent) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onTapVideo: (e: WechatMiniprogram.TouchEvent) => void;
  onTapPost: (e: WechatMiniprogram.TouchEvent) => void;
  mockFetchFavorites: () => Promise<{ items: FavoriteItem[], total: number }>;
  formatTime: (time: string) => string;
}

Page<IPageData, IPageMethods>({
  data: {
    currentType: 'video',
    favoritesList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    isLoading: false,
    isRefreshing: false
  },

  onLoad() {
    this.fetchFavorites();
  },

  // 获取收藏列表
  async fetchFavorites(isLoadMore = false) {
    if (this.data.isLoading) return;

    try {
      this.setData({ isLoading: true });

      // 使用mock数据
      const response = await this.mockFetchFavorites();
      
      const { items, total } = response;
      const hasMore = this.data.favoritesList.length + items.length < total;

      // 格式化时间
      const formattedItems = items.map(item => ({
        ...item,
        createTime: this.formatTime(item.createTime)
      }));

      this.setData({
        favoritesList: isLoadMore ? [...this.data.favoritesList, ...formattedItems] : formattedItems,
        hasMore,
        page: this.data.page + 1
      });
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      wx.showToast({
        title: '获取收藏失败',
        icon: 'error'
      });
    } finally {
      this.setData({ 
        isLoading: false,
        isRefreshing: false
      });
    }
  },

  // 切换类型
  onTabChange(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type as 'video' | 'post';
    if (type === this.data.currentType) return;

    this.setData({
      currentType: type,
      favoritesList: [],
      page: 1,
      hasMore: true
    });

    this.fetchFavorites();
  },

  // 加载更多
  onLoadMore() {
    if (!this.data.hasMore || this.data.isLoading) return;
    this.fetchFavorites(true);
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      isRefreshing: true,
      page: 1,
      hasMore: true
    });

    this.fetchFavorites();
  },

  // 点击视频
  onTapVideo(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/video-detail/video-detail?id=${id}&from=favorites`
    });
  },

  // 点击帖子
  onTapPost(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${id}&from=favorites`
    });
  },

  // Mock API调用
  mockFetchFavorites(): Promise<{ items: FavoriteItem[], total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 生成示例数据
        const mockItems = Array(5).fill(null).map((_, index) => {
          const isVideo = this.data.currentType === 'video';
          return {
            id: `favorite_${Date.now()}_${index}`,
            type: this.data.currentType,
            title: isVideo 
              ? `示例视频标题 ${index + 1}`
              : `这是一个示例帖子内容 ${index + 1}，展示一下长文本的效果。这是一个示例帖子内容，展示一下长文本的效果。`,
            coverUrl: '/images/486o.jpg',
            createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            duration: isVideo ? Math.floor(Math.random() * 10) + 1 : undefined,
            author: {
              id: `user_${index + 1}`,
              avatarUrl: '/images/486o.jpg',
              nickName: `用户${index + 1}`
            }
          };
        });

        // 模拟API响应格式
        const mockData = {
          items: mockItems,
          total: 100 // 模拟总数
        };

        resolve(mockData);
      }, 500); // 模拟网络延迟
    });
  },

  // 格式化时间
  formatTime(time: string): string {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 一小时内
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }
    
    // 24小时内
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }
    
    // 30天内
    if (diff < 2592000000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
    
    // 超过30天
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}); 