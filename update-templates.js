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

// 更新页面WXML模板
function updatePageWxml(pagePath) {
  const wxmlPath = path.join(__dirname, 'miniprogram', pagePath + '.wxml');
  
  // 检查文件是否存在
  if (!fs.existsSync(wxmlPath)) {
    console.log(`${wxmlPath} 不存在，跳过`);
    return;
  }
  
  try {
    // 读取WXML文件
    const content = fs.readFileSync(wxmlPath, 'utf8');
    
    // 检查是否已经有page-container
    if (content.includes('<page-container>')) {
      console.log(`${pagePath} 已经使用了page-container组件，跳过`);
      return;
    }

    // 检查是否有page-meta和navigation-bar
    let newContent;
    if (content.includes('<page-meta>') && content.includes('<navigation-bar')) {
      // 如果已经有page-meta和navigation-bar，在它们之后添加page-container
      newContent = content.replace(/<\/page-meta>\s*(<view[^>]*>)/i, 
        '</page-meta>\n<page-container>\n$1');
      // 在文件末尾添加page-container的关闭标签
      newContent = newContent.replace(/<\/view>\s*$/i, '</view>\n</page-container>');
    } else {
      // 如果没有，添加默认的page-meta和navigation-bar，并用page-container包装内容
      // 从路径中提取页面名称
      const pageName = pagePath.split('/').pop();
      // 将首字母大写
      const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      
      newContent = `<page-meta>
    <navigation-bar title="${title}" back="{{true}}" color="black" background="#FFF"></navigation-bar>
</page-meta>
<page-container>
${content}
</page-container>`;
    }
    
    // 写回文件
    fs.writeFileSync(wxmlPath, newContent, 'utf8');
    console.log(`已更新 ${pagePath} 的WXML模板`);
  } catch (error) {
    console.error(`处理 ${wxmlPath} 时出错:`, error);
  }
}

// 遍历所有页面
pages.forEach(updatePageWxml);
console.log('所有页面模板已更新'); 