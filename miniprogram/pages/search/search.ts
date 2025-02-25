interface ISearchResult {
    id: string;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
}

interface IData {
    searchQuery: string;
    searchHistory: string[];
    searchResults: ISearchResult[];
}

interface ICustom {
    onInput(event: WechatMiniprogram.Input): void;
    onSearch(): void;
    onHistoryTap(event: WechatMiniprogram.TouchEvent): void;
    onResultTap(event: WechatMiniprogram.TouchEvent): void;
    onBackTap(): void;
    clearHistory(): void;
    saveToHistory(query: string): void;
    mockSearchResults(): ISearchResult[];
    performSearch(query: string): void;
}

Page<IData, ICustom>({
    data: {
    ios: true, // 默认为iOS
        searchQuery: '', // 搜索关键词
        searchHistory: [], // 搜索历史
        searchResults: [], // 搜索结果
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
        // 从本地存储加载搜索历史
        const history = wx.getStorageSync('searchHistory') || [];
        this.setData({ searchHistory: history });

        // 如果有传入的搜索关键词，立即执行搜索
        if (options.query) {
            const query = decodeURIComponent(options.query);
            this.setData({ searchQuery: query });
            this.performSearch(query);
        }
    },

    onInput(event: WechatMiniprogram.Input) {
        const value = event.detail.value;
        this.setData({ 
            searchQuery: value,
            searchResults: value.trim() ? this.mockSearchResults() : []
        });
    },

    performSearch(query: string) {
        // 保存到搜索历史
        this.saveToHistory(query);
        
        // 执行搜索
        this.setData({
            searchResults: this.mockSearchResults()
        });
    },

    onSearch() {
        const query = this.data.searchQuery.trim();
        if (!query) {
            wx.showToast({
                title: '请输入搜索内容',
                icon: 'none'
            });
            return;
        }

        this.performSearch(query);
    },

    onHistoryTap(event: WechatMiniprogram.TouchEvent) {
        const query = event.currentTarget.dataset.query as string;
        this.setData({
            searchQuery: query,
            searchResults: this.mockSearchResults()
        });
    },

    onResultTap(event: WechatMiniprogram.TouchEvent) {
        const id = event.currentTarget.dataset.id as string;
        wx.navigateTo({
            url: `/pages/video-detail/video-detail?id=${id}`
        });
    },

    onBackTap() {
        wx.navigateBack();
    },

    clearHistory() {
        wx.showModal({
            title: '提示',
            content: '确定要清空搜索历史吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.removeStorageSync('searchHistory');
                    this.setData({ searchHistory: [] });
                }
            }
        });
    },

    saveToHistory(query: string) {
        let history = [...this.data.searchHistory];
        // 移除重复项
        history = history.filter(item => item !== query);
        // 添加到开头
        history.unshift(query);
        // 限制历史记录数量
        if (history.length > 10) {
            history.pop();
        }
        // 保存到本地存储和数据
        wx.setStorageSync('searchHistory', history);
        this.setData({ searchHistory: history });
    },

    // 模拟搜索结果
    mockSearchResults(): ISearchResult[] {
        return [
            {
                id: '1',
                title: '瑜伽基础动作教学：鸽子式',
                thumbnail: '../../images/video1.jpg',
                author: '瑜伽教练小美',
                views: 1000
            },
            {
                id: '2',
                title: '初级瑜伽系列：站姿前屈',
                thumbnail: '../../images/video2.jpg',
                author: '瑜伽教练小美',
                views: 800
            },
            {
                id: '3',
                title: '瑜伽呼吸法：完整冥想指南',
                thumbnail: '../../images/video3.jpg',
                author: '瑜伽教练小美',
                views: 1200
            }
        ];
    }
}); 