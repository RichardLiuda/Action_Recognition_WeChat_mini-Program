interface IMessage {
  id: string;
  type: 'system' | 'interaction';
  content: string;
  createTime: string;
  isRead: boolean;
  sender?: {
    avatarUrl: string;
    nickName: string;
  };
}

Page({
  data: {
    ios: true, // 默认为iOS
    currentType: 'all' as 'all' | 'interaction' | 'system',
    messageList: [] as IMessage[],
    isLoading: false,
    isRefreshing: false,
    hasMore: true,
    pageNum: 1,
    pageSize: 10
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
    this.loadMessages();
  },

  // 切换消息类型
  onTabChange(e: WechatMiniprogram.CustomEvent) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type,
      messageList: [],
      pageNum: 1,
      hasMore: true
    }, () => {
      this.loadMessages();
    });
  },

  // 加载消息列表
  async loadMessages() {
    if (this.data.isLoading || !this.data.hasMore) return;

    try {
      this.setData({ isLoading: true });

      // TODO: 替换为实际的API调用
      const response = await this.mockFetchMessages();
      
      const { list, total } = response;
      const hasMore = this.data.messageList.length + list.length < total;

      this.setData({
        messageList: [...this.data.messageList, ...list],
        hasMore,
        pageNum: this.data.pageNum + 1
      });
    } catch (error) {
      console.error('加载消息失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 下拉刷新
  async onRefresh() {
    this.setData({
      isRefreshing: true,
      messageList: [],
      pageNum: 1,
      hasMore: true
    });

    await this.loadMessages();
    this.setData({ isRefreshing: false });
  },

  // 触底加载更多
  onLoadMore() {
    this.loadMessages();
  },

  // 点击消息项
  onTapMessage(e: WechatMiniprogram.CustomEvent) {
    const { id, type } = e.currentTarget.dataset;
    
    // 标记消息为已读
    this.markMessageAsRead(id);

    // 根据消息类型跳转到不同页面
    if (type === 'system') {
      wx.navigateTo({
        url: `/pages/notification/detail?id=${id}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/interaction/detail?id=${id}`
      });
    }
  },

  // 标记消息为已读
  async markMessageAsRead(messageId: string) {
    try {
      // TODO: 替换为实际的API调用
      await this.mockMarkAsRead(messageId);
      
      const messageList = this.data.messageList.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      );
      
      this.setData({ messageList });
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  },

  // Mock API调用
  mockFetchMessages(): Promise<{ list: IMessage[], total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          list: Array(5).fill(null).map((_, index) => ({
            id: `msg_${Date.now()}_${index}`,
            type: index % 2 === 0 ? 'system' : 'interaction',
            content: index % 2 === 0 
              ? '系统消息内容示例'
              : '互动消息内容示例',
            createTime: new Date().toLocaleString(),
            isRead: false,
            ...(index % 2 === 1 && {
              sender: {
                avatarUrl: '/images/486o.jpg',
                nickName: '用户昵称'
              }
            })
          })) as IMessage[],
          total: 100
        };
        resolve(mockData);
      }, 500);
    });
  },

  mockMarkAsRead(messageId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }
}); 