interface IPageData {
  userInfo: Partial<WechatMiniprogram.UserInfo>;
  followCount: number;
  fansCount: number;
  introduction: string;
  isLoading: boolean;
}

interface IPageMethods {
  getUserProfile: () => void;
  onTapSettings: () => void;
  onTapHistory: () => void;
  onTapMessages: () => void;
  onTapFavorites: () => void;
  fetchUserProfile: () => Promise<void>;
  onTapEditIntro: () => void;
  updateIntroduction: (intro: string) => Promise<void>;
}

interface UserProfileResponse {
  code: number;
  message: string;
  data: {
    nickname: string;
    avatarUrl: string;
    introduction: string;
    followingCount: number;
    followersCount: number;
  }
}

Page<IPageData, IPageMethods>({
  data: {
    userInfo: {
      avatarUrl: '/images/486o.jpg',
      nickName: '夏也',
    },
    followCount: 52,
    fansCount: 22,
    introduction: '',
    isLoading: true
  },

  onLoad() {
    this.fetchUserProfile();
  },

  // 获取用户资料
  async fetchUserProfile() {
    try {
      this.setData({ isLoading: true });
      
      // 由于API还未实现，先使用模拟数据
      const mockData = {
        nickname: '夏也',
        avatarUrl: '/images/486o.jpg',
        introduction: '这是一个示例简介',
        followingCount: 52,
        followersCount: 22
      };

      this.setData({
        userInfo: {
          nickName: mockData.nickname,
          avatarUrl: mockData.avatarUrl
        },
        introduction: mockData.introduction,
        followCount: mockData.followingCount,
        fansCount: mockData.followersCount
      });
      
    } catch (error) {
      console.error('获取用户信息失败:', error);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'error'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 编辑简介
  onTapEditIntro() {
    const that = this;
    wx.showModal({
      title: '编辑简介',
      content: '请输入个人简介',
      editable: true,
      placeholderText: '请输入...',
      success: async (res) => {
        if (res.confirm && res.content) {
          await that.updateIntroduction(res.content);
        }
      }
    });
  },

  // 更新简介
  async updateIntroduction(intro: string) {
    try {
      const res = await wx.request<{code: number; message: string; data: {introduction: string}}>({
        url: '/api/users/introduction',
        method: 'PUT',
        data: {
          introduction: intro
        }
      });

      if (res.statusCode === 200 && res.data.code === 200) {
        this.setData({ introduction: intro });
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('更新简介失败:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'error'
      });
    }
  },

  // 设置
  onTapSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 历史记录
  onTapHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 消息
  onTapMessages() {
    wx.navigateTo({
      url: '/pages/messages/messages'
    });
  },

  // 收藏
  onTapFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  onPullDownRefresh() {
    this.fetchUserProfile().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onShareAppMessage() {
    return {
      title: '查看我的主页',
      path: '/pages/profile/profile'
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
});