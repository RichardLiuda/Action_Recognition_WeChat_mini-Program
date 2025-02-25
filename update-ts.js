const fs = require('fs');
const path = require('path');

// 页面列表，与app.json中保持一致
const pages = [
  "pages/index/index",
  "pages/learning/learning",
  "pages/community/community",
  "pages/logs/logs",
  "pages/upload/upload",
  "pages/video-detail/video-detail",
  "pages/camera/camera",
  "pages/pose-result/pose-result",
  "pages/search/search",
  "pages/post-detail/post-detail",
  "pages/settings/settings",
  "pages/history/history",
  "pages/messages/messages",
  "pages/favorites/favorites"
];

// 已经处理过的页面 
const processedPages = [
  "pages/discovery/discovery", 
  "pages/profile/profile"
];

// 更新页面TS文件
function updatePageTs(pagePath) {
  const tsPath = path.join(__dirname, 'miniprogram', pagePath + '.ts');
  
  // 检查文件是否存在
  if (!fs.existsSync(tsPath)) {
    console.log(`${tsPath} 不存在，尝试查找js文件`);
    // 尝试找JS文件
    const jsPath = path.join(__dirname, 'miniprogram', pagePath + '.js');
    if (!fs.existsSync(jsPath)) {
      console.log(`${jsPath} 也不存在，跳过`);
      return;
    }
    // 如果有JS文件，则处理JS文件
    return updatePageJs(pagePath);
  }
  
  try {
    // 读取TS文件
    const content = fs.readFileSync(tsPath, 'utf8');
    
    // 检查是否已经有ios变量定义
    if (content.includes('ios:') || content.includes('ios =')) {
      console.log(`${pagePath} 已经有ios变量定义，跳过`);
      return;
    }

    // 找到data对象定义的位置
    const dataMatch = content.match(/data\s*:\s*\{/);
    if (!dataMatch) {
      console.log(`${pagePath} 中未找到data对象定义，跳过`);
      return;
    }

    // 在data对象中添加ios变量
    let newContent = content.replace(/data\s*:\s*\{/, 'data: {\n    ios: true, // 默认为iOS');
    
    // 找到onLoad函数或添加onLoad函数
    const onLoadMatch = newContent.match(/onLoad\s*\([^)]*\)\s*\{/);
    if (onLoadMatch) {
      // 在onLoad函数中添加平台判断逻辑
      newContent = newContent.replace(/onLoad\s*\([^)]*\)\s*\{/, match => `${match}
    // 判断平台
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });`);
    } else {
      // 如果没有onLoad函数，添加一个
      // 找到data对象后的第一个逗号或括号
      newContent = newContent.replace(/data\s*:\s*\{[^}]*\}(,|\s*\})/, match => `${match}

  onLoad() {
    // 判断平台
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });
  },`);
    }
    
    // 写回文件
    fs.writeFileSync(tsPath, newContent, 'utf8');
    console.log(`已更新 ${pagePath} 的TS文件`);
  } catch (error) {
    console.error(`处理 ${tsPath} 时出错:`, error);
  }
}

// 更新页面JS文件（与TS文件逻辑类似）
function updatePageJs(pagePath) {
  const jsPath = path.join(__dirname, 'miniprogram', pagePath + '.js');
  
  try {
    // 读取JS文件
    const content = fs.readFileSync(jsPath, 'utf8');
    
    // 检查是否已经有ios变量定义
    if (content.includes('ios:') || content.includes('ios =')) {
      console.log(`${pagePath} 已经有ios变量定义，跳过`);
      return;
    }

    // 找到data对象定义的位置
    const dataMatch = content.match(/data\s*:\s*\{/);
    if (!dataMatch) {
      console.log(`${pagePath} 中未找到data对象定义，跳过`);
      return;
    }

    // 在data对象中添加ios变量
    let newContent = content.replace(/data\s*:\s*\{/, 'data: {\n    ios: true, // 默认为iOS');
    
    // 找到onLoad函数或添加onLoad函数
    const onLoadMatch = newContent.match(/onLoad\s*\([^)]*\)\s*\{/);
    if (onLoadMatch) {
      // 在onLoad函数中添加平台判断逻辑
      newContent = newContent.replace(/onLoad\s*\([^)]*\)\s*\{/, match => `${match}
    // 判断平台
    wx.getSystemInfo({
      success: function(res) {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });`);
    } else {
      // 如果没有onLoad函数，添加一个
      // 找到data对象后的第一个逗号或括号
      newContent = newContent.replace(/data\s*:\s*\{[^}]*\}(,|\s*\})/, match => `${match}

  onLoad: function() {
    // 判断平台
    wx.getSystemInfo({
      success: function(res) {
        this.setData({
          ios: res.platform !== 'android'
        });
      }
    });
  },`);
    }
    
    // 写回文件
    fs.writeFileSync(jsPath, newContent, 'utf8');
    console.log(`已更新 ${pagePath} 的JS文件`);
  } catch (error) {
    console.error(`处理 ${jsPath} 时出错:`, error);
  }
}

// 遍历所有页面
pages.forEach(updatePageTs);
console.log('所有页面TS/JS文件已更新'); 