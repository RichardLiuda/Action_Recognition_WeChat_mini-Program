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

// 更新页面JSON配置
function updatePageJson(pagePath) {
  const jsonPath = path.join(__dirname, 'miniprogram', pagePath + '.json');
  
  // 检查文件是否存在
  if (!fs.existsSync(jsonPath)) {
    console.log(`${jsonPath} 不存在，跳过`);
    return;
  }
  
  try {
    // 读取JSON文件
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const config = JSON.parse(jsonContent);
    
    // 确保usingComponents存在
    if (!config.usingComponents) {
      config.usingComponents = {};
    }
    
    // 添加page-container组件引用
    if (!config.usingComponents['page-container']) {
      config.usingComponents['page-container'] = '/components/page-container/page-container';
      console.log(`为 ${pagePath} 添加 page-container 组件引用`);
    }
    
    // 写回文件
    fs.writeFileSync(jsonPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error(`处理 ${jsonPath} 时出错:`, error);
  }
}

// 遍历所有页面
pages.forEach(updatePageJson);
console.log('所有页面配置已更新'); 