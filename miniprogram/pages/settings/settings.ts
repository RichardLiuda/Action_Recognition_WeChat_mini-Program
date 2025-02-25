type VisibilityType = 'public' | 'friends' | 'private';

// 本地存储的key
const STORAGE_KEY = {
  SETTINGS: 'user_settings',
  SYNC_QUEUE: 'settings_sync_queue'
};

interface IPageData {
  settings: {
    notificationEnabled: boolean;
    privacySettings: {
      videoVisibility: VisibilityType;
      allowComment: boolean;
      allowMessage: boolean;
    }
  };
  visibilityOptions: string[];
  visibilityIndex: number;
  cacheSize: string;
  isSyncing: boolean;
}

interface IPageMethods {
  fetchSettings: () => Promise<void>;
  onNotificationChange: (e: WechatMiniprogram.SwitchChange) => void;
  onVisibilityChange: (e: WechatMiniprogram.PickerChange) => void;
  onCommentChange: (e: WechatMiniprogram.SwitchChange) => void;
  onMessageChange: (e: WechatMiniprogram.SwitchChange) => void;
  onTapClearCache: () => void;
  onTapAbout: () => void;
  onTapLogout: () => void;
  updateSettings: (settings: Partial<IPageData['settings']>) => Promise<void>;
  calculateCacheSize: () => Promise<void>;
  saveSettingsLocally: (settings: IPageData['settings']) => void;
  loadLocalSettings: () => IPageData['settings'] | null;
  syncSettingsWithServer: () => Promise<void>;
  addToSyncQueue: (settings: Partial<IPageData['settings']>) => void;
  processSyncQueue: () => Promise<void>;
}

interface SettingsResponse {
  code: number;
  message: string;
  data: IPageData['settings'];
}

const visibilityMap: Record<VisibilityType, number> = {
  'public': 0,
  'friends': 1,
  'private': 2
};

const visibilityTypes: VisibilityType[] = ['public', 'friends', 'private'];

const defaultSettings: IPageData['settings'] = {
  notificationEnabled: true,
  privacySettings: {
    videoVisibility: 'public',
    allowComment: true,
    allowMessage: true
  }
};

Page<IPageData, IPageMethods>({
  data: {
    ios: true, // 默认为iOS
    settings: defaultSettings,
    visibilityOptions: ['公开', '仅关注者可见', '私密'],
    visibilityIndex: 0,
    cacheSize: '0MB',
    isSyncing: false
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
    // 先加载本地设置
    const localSettings = this.loadLocalSettings();
    if (localSettings) {
      this.setData({
        settings: localSettings,
        visibilityIndex: visibilityMap[localSettings.privacySettings.videoVisibility]
      });
    }

    // 然后从服务器获取最新设置
    this.fetchSettings();
    this.calculateCacheSize();
    
    // 处理未同步的设置
    this.processSyncQueue();
  },

  onShow() {
    // 每次页面显示时尝试同步队列
    this.processSyncQueue();
  },

  // 保存设置到本地
  saveSettingsLocally(settings: IPageData['settings']) {
    try {
      wx.setStorageSync(STORAGE_KEY.SETTINGS, settings);
    } catch (error) {
      console.error('保存设置到本地失败:', error);
    }
  },

  // 从本地加载设置
  loadLocalSettings(): IPageData['settings'] | null {
    try {
      const settings = wx.getStorageSync(STORAGE_KEY.SETTINGS);
      return settings || null;
    } catch (error) {
      console.error('从本地加载设置失败:', error);
      return null;
    }
  },

  // 添加到同步队列
  addToSyncQueue(settings: Partial<IPageData['settings']>) {
    try {
      let queue = wx.getStorageSync(STORAGE_KEY.SYNC_QUEUE) || [];
      queue.push({
        settings,
        timestamp: Date.now()
      });
      wx.setStorageSync(STORAGE_KEY.SYNC_QUEUE, queue);

      // 监听网络状态变化，网络恢复时自动同步
      wx.onNetworkStatusChange((res) => {
        if (res.isConnected) {
          this.processSyncQueue();
        }
      });
    } catch (error) {
      console.error('添加到同步队列失败:', error);
    }
  },

  // 处理同步队列
  async processSyncQueue() {
    if (this.data.isSyncing) return;

    try {
      // 检查网络状态
      const networkType = await new Promise((resolve) => {
        wx.getNetworkType({
          success: (res) => resolve(res.networkType)
        });
      });

      if (networkType === 'none') return;

      this.setData({ isSyncing: true });
      
      const queue = wx.getStorageSync(STORAGE_KEY.SYNC_QUEUE) || [];
      if (queue.length === 0) return;

      // 按时间戳排序，确保按正确顺序同步
      queue.sort((a, b) => a.timestamp - b.timestamp);

      // 使用批量同步接口
      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: '/api/users/settings/sync',
          method: 'POST',
          data: { settings: queue },
          success: resolve,
          fail: reject
        });
      });

      const res = result as WechatMiniprogram.RequestSuccessCallbackResult<{
        code: number;
        message: string;
        data: {
          syncedCount: number;
          failedCount: number;
          lastSyncTime: number;
        }
      }>;

      if (res.statusCode === 200 && res.data.code === 200) {
        // 同步成功，清空队列
        wx.setStorageSync(STORAGE_KEY.SYNC_QUEUE, []);
        
        if (queue.length > 1) {
          wx.showToast({
            title: '设置已同步',
            icon: 'success'
          });
        }
      }
    } catch (error) {
      console.error('处理同步队列失败:', error);
    } finally {
      this.setData({ isSyncing: false });
    }
  },

  // 获取设置
  async fetchSettings() {
    try {
      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: '/api/users/settings',
          method: 'GET',
          success: resolve,
          fail: reject
        });
      });

      const res = result as WechatMiniprogram.RequestSuccessCallbackResult<SettingsResponse>;

      if (res.statusCode === 200 && res.data.code === 200) {
        const settings = res.data.data;
        
        // 更新本地存储和页面数据
        this.saveSettingsLocally(settings);
        this.setData({
          settings,
          visibilityIndex: visibilityMap[settings.privacySettings.videoVisibility]
        });
      }
    } catch (error) {
      console.error('获取设置失败:', error);
      wx.showToast({
        title: '获取设置失败',
        icon: 'error'
      });
    }
  },

  // 更新设置
  async updateSettings(settings: Partial<IPageData['settings']>) {
    try {
      // 检查网络状态
      const networkType = await new Promise((resolve) => {
        wx.getNetworkType({
          success: (res) => resolve(res.networkType)
        });
      });

      // 如果没有网络，直接保存到本地并加入同步队列
      if (networkType === 'none') {
        const currentSettings = this.data.settings;
        const newSettings = {
          ...currentSettings,
          ...settings,
          privacySettings: {
            ...currentSettings.privacySettings,
            ...(settings.privacySettings || {})
          }
        };
        
        this.setData({ settings: newSettings });
        this.saveSettingsLocally(newSettings);
        this.addToSyncQueue(settings);
        
        wx.showToast({
          title: '已保存，待同步',
          icon: 'none'
        });
        return;
      }

      // 有网络时，直接同步到服务器
      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: '/api/users/settings',
          method: 'PUT',
          data: settings,
          success: resolve,
          fail: reject
        });
      });

      const res = result as WechatMiniprogram.RequestSuccessCallbackResult<SettingsResponse>;

      if (res.statusCode === 200 && res.data.code === 200) {
        // 同步成功，更新本地数据
        const currentSettings = this.data.settings;
        const newSettings = {
          ...currentSettings,
          ...settings,
          privacySettings: {
            ...currentSettings.privacySettings,
            ...(settings.privacySettings || {})
          }
        };
        
        this.setData({ settings: newSettings });
        this.saveSettingsLocally(newSettings);

        wx.showToast({
          title: '设置已更新',
          icon: 'success'
        });
      } else {
        throw new Error('同步到服务器失败');
      }
    } catch (error) {
      console.error('更新设置失败:', error);
      
      // 网络请求失败，保存到本地并加入同步队列
      const currentSettings = this.data.settings;
      const newSettings = {
        ...currentSettings,
        ...settings,
        privacySettings: {
          ...currentSettings.privacySettings,
          ...(settings.privacySettings || {})
        }
      };
      
      this.setData({ settings: newSettings });
      this.saveSettingsLocally(newSettings);
      this.addToSyncQueue(settings);

      wx.showToast({
        title: '已保存，待同步',
        icon: 'none'
      });
    }
  },

  // 计算缓存大小
  async calculateCacheSize() {
    try {
      const res = await wx.getStorageInfo();
      const size = (res.currentSize / 1024).toFixed(1);
      this.setData({
        cacheSize: `${size}MB`
      });
    } catch (error) {
      console.error('获取缓存大小失败:', error);
    }
  },

  // 通知开关变化
  onNotificationChange(e: WechatMiniprogram.SwitchChange) {
    const notificationEnabled = e.detail.value;
    this.updateSettings({
      notificationEnabled
    });
  },

  // 视频可见性变化
  onVisibilityChange(e: WechatMiniprogram.PickerChange) {
    const videoVisibility = visibilityTypes[e.detail.value];
    
    this.setData({
      visibilityIndex: e.detail.value,
      'settings.privacySettings.videoVisibility': videoVisibility
    });

    this.updateSettings({
      privacySettings: {
        ...this.data.settings.privacySettings,
        videoVisibility
      }
    });
  },

  // 评论开关变化
  onCommentChange(e: WechatMiniprogram.SwitchChange) {
    const allowComment = e.detail.value;
    this.updateSettings({
      privacySettings: {
        ...this.data.settings.privacySettings,
        allowComment
      }
    });
  },

  // 私信开关变化
  onMessageChange(e: WechatMiniprogram.SwitchChange) {
    const allowMessage = e.detail.value;
    this.updateSettings({
      privacySettings: {
        ...this.data.settings.privacySettings,
        allowMessage
      }
    });
  },

  // 清除缓存
  async onTapClearCache() {
    try {
      await wx.clearStorage();
      await this.calculateCacheSize();
      wx.showToast({
        title: '清除成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('清除缓存失败:', error);
      wx.showToast({
        title: '清除失败',
        icon: 'error'
      });
    }
  },

  // 关于我们
  onTapAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  // 退出登录
  onTapLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          wx.clearStorageSync();
          // 返回登录页
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
}); 