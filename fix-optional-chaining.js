/**
 * 这个脚本用于修复community.ts文件中的可选链操作符问题
 * 
 * 1. 定位到第264行左右的 `updatedPosts.find(p => p.id === id)?.isFollowed`
 * 2. 替换为 `(updatedPost = updatedPosts.find(p => p.id === id)) && updatedPost.isFollowed`
 * 
 * 或者更安全的写法如下：
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const filePath = path.join('miniprogram', 'pages', 'community', 'community.ts');

try {
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 替换可选链操作符
  const updatedContent = content.replace(
    /updatedPosts\.find\(p => p\.id === id\)\?\.isFollowed/g, 
    '(updatedPost = updatedPosts.find(p => p.id === id)) && updatedPost.isFollowed'
  );
  
  // 如果内容变化了，意味着找到并替换了可选链操作符
  if (content !== updatedContent) {
    // 在toggleFollow函数开头添加updatedPost变量声明
    const finalContent = updatedContent.replace(
      /(toggleFollow\([^)]*\) \{)/,
      '$1\n    let updatedPost;'
    );
    
    // 写回文件
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log('已成功修复community.ts文件中的可选链操作符问题！');
  } else {
    console.log('未找到可选链操作符或替换失败，请手动检查文件。');
    
    // 尝试替换整个showToast部分
    const alternativeReplacement = content.replace(
      /wx\.showToast\(\{\s*title: updatedPosts\.find\(p => p\.id === id\)\?\.isFollowed \? '已关注' : '已取消关注',\s*icon: 'none'\s*\}\);/g,
      `// 查找更新后的帖子，使用传统的条件检查方式
    const updatedPost = updatedPosts.find(p => p.id === id);
    const followStatus = updatedPost ? (updatedPost.isFollowed ? '已关注' : '已取消关注') : '已取消关注';
    
    wx.showToast({
      title: followStatus,
      icon: 'none'
    });`
    );
    
    if (content !== alternativeReplacement) {
      fs.writeFileSync(filePath, alternativeReplacement, 'utf8');
      console.log('使用替代方案成功修复！');
    } else {
      console.log('替代方案也失败了，请复制以下代码手动修改：');
      console.log(`
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

    // 查找更新后的帖子，使用传统的条件检查方式
    const updatedPost = updatedPosts.find(p => p.id === id);
    const followStatus = updatedPost ? (updatedPost.isFollowed ? '已关注' : '已取消关注') : '已取消关注';
    
    wx.showToast({
      title: followStatus,
      icon: 'none'
    });
  },`);
    }
  }
} catch (error) {
  console.error('发生错误：', error);
} 