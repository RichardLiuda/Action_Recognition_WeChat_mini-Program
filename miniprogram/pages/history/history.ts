interface HistoryItem {
  id: string;
  type: 'video' | 'post';
  title: string;
  coverUrl: string;
  createTime: string;
  duration?: number;
}

interface IPageData {
  currentType: 'video' | 'post';
  historyList: HistoryItem[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
}

interface IPageMethods {
  fetchHistory: (isLoadMore?: boolean) => Promise<void>;
  onTabChange: (e: WechatMiniprogram.TouchEvent) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onTapVideo: (e: WechatMiniprogram.TouchEvent) => void;
  onTapPost: (e: WechatMiniprogram.TouchEvent) => void;
  formatTime: (time: string) => string;
}

interface QueueItem {
  timestamp: number;
  settings: any;
}

Page<IPageData, IPageMethods>({
  data: {
    ios: true, // 默认为iOS
    currentType: 'video',
    historyList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    isLoading: false,
    isRefreshing: false
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
    this.fetchHistory();
  },

  // 获取历史记录
  async fetchHistory(isLoadMore = false) {
    if (this.data.isLoading) return;

    try {
      this.setData({ isLoading: true });

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: '/api/users/history',
          method: 'GET',
          data: {
            type: this.data.currentType,
            page: this.data.page,
            pageSize: this.data.pageSize
          },
          success: resolve,
          fail: reject
        });
      });

      const res = result as WechatMiniprogram.RequestSuccessCallbackResult<{
        code: number;
        message: string;
        data: {
          total: number;
          items: HistoryItem[];
        }
      }>;

      if (res.statusCode === 200 && res.data.code === 200) {
        const { items, total } = res.data.data;
        
        // 格式化时间
        const formattedItems = items.map(item => ({
          ...item,
          createTime: this.formatTime(item.createTime)
        }));

        this.setData({
          historyList: isLoadMore ? [...this.data.historyList, ...formattedItems] : formattedItems,
          hasMore: this.data.historyList.length + formattedItems.length < total
        });
      }
    } catch (error) {
      console.error('获取历史记录失败:', error);
      wx.showToast({
        title: '获取历史记录失败',
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
      historyList: [],
      page: 1,
      hasMore: true
    });

    this.fetchHistory();
  },

  // 加载更多
  onLoadMore() {
    if (!this.data.hasMore || this.data.isLoading) return;

    this.setData({
      page: this.data.page + 1
    });

    this.fetchHistory(true);
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      isRefreshing: true,
      page: 1,
      hasMore: true
    });

    this.fetchHistory();
  },

  // 点击视频
  onTapVideo(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/video-detail/video-detail?id=${id}`
    });
  },

  // 点击帖子
  onTapPost(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${id}`
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