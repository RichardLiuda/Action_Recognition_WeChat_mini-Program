# 微信小程序 API 和数据库文档

## 一、前后端对接规范

### 1. 通用响应格式
```json
{
  "code": 200,          // 状态码：200成功，400请求错误，401未授权，500服务器错误
  "message": "success", // 状态描述
  "data": {            // 具体数据
    // 具体字段
  }
}
```

### 2. 分页参数规范
```json
{
  "page": 1,        // 当前页码，从1开始
  "pageSize": 10,   // 每页条数
  "total": 100,     // 总条数
  "items": []       // 具体数据列表
}
```

### 3. 时间格式
所有时间字段统一使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss.sssZ`

### 4. 文件上传
- 使用 multipart/form-data 格式
- 视频文件支持格式：mp4, mov
- 图片文件支持格式：jpg, png, gif
- 单个文件大小限制：视频50MB，图片5MB

## 二、数据库表设计

### 1. 用户表 (users)
需求来源：
- 用户信息展示：`miniprogram/pages/profile/profile.wxml`
- 用户关注/粉丝统计：`miniprogram/pages/discovery/discovery.ts` (第2-193行)

字段设计：
- id: string (主键)
- openid: string (微信用户唯一标识)
- nickname: string (用户昵称)
- avatar_url: string (头像URL)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)
- following_count: integer (关注数)
- followers_count: integer (粉丝数)
- likes_count: integer (获赞数)

数据插入位置：
- 用户基本信息：`miniprogram/pages/video-detail/video-detail.ts` 第17-19行 (用户名、头像等)
- 关注状态：`miniprogram/pages/video-detail/video-detail.ts` 第14行 (isFollowing)
- 点赞状态：`miniprogram/pages/video-detail/video-detail.ts` 第15行 (hasLiked)

### 2. 视频表 (videos)
需求来源：
- 视频列表展示：`miniprogram/pages/discovery/discovery.wxml` (第2-37行)
- 视频详情页：`miniprogram/pages/video-detail/video-detail.ts` (第2-77行)
- 视频上传：`miniprogram/pages/upload/upload.ts` (第2-55行)

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- title: string (视频标题)
- description: text (视频描述)
- video_url: string (视频文件URL)
- thumbnail_url: string (缩略图URL)
- category_id: string (外键，关联分类表)
- visibility: enum ('public', 'friends', 'private')
- views_count: integer (观看次数)
- likes_count: integer (点赞数)
- comments_count: integer (评论数)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 视频基本信息：`miniprogram/pages/video-detail/video-detail.ts` 第49-58行
- 视频列表数据：`miniprogram/pages/discovery/discovery.ts` 第15-93行 (videoRows数组)
- 视频分类：`miniprogram/pages/discovery/discovery.ts` 第6-14行 (tabs数组)

### 3. 评测记录表 (pose_evaluations)
需求来源：
- 相机页面：`miniprogram/pages/camera/camera.ts`
- 评测结果页面：`miniprogram/pages/pose-result/pose-result.ts`

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- video_id: string (外键，关联视频表)
- session_id: string (练习会话ID)
- final_score: integer (最终得分)
- accuracy: integer (准确度)
- completion: integer (完成度)
- fluency: integer (流畅度)
- created_at: timestamp (创建时间)
- evaluations: jsonb (评价详情)

数据插入位置：
- 实时评测数据：`miniprogram/pages/camera/camera.ts` startReceivingPoseData 方法
- 评测结果：`miniprogram/pages/pose-result/pose-result.ts` getPoseResult 方法

### 4. 评论表 (comments)
需求来源：
- 评论列表：`miniprogram/pages/video-detail/video-detail.ts` (第17-39行)

字段设计：
- id: string (主键)
- video_id: string (外键，关联视频表)
- user_id: string (外键，关联用户表)
- content: text (评论内容)
- likes_count: integer (点赞数)
- reply_count: integer (回复数)
- parent_id: string (父评论ID)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 评论数据：`miniprogram/pages/video-detail/video-detail.ts` 第17-39行 (commentList数组)
- 评论计数：`miniprogram/pages/video-detail/video-detail.ts` 第11行 (comments)

### 5. 分类表 (categories)
需求来源：
- 分类标签：`miniprogram/pages/discovery/discovery.ts` (第6-14行)

字段设计：
- id: string (主键)
- name: string (分类名称，如：体操区、舞蹈区、运动区等)
- description: string (分类描述)
- sort_order: integer (排序顺序)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 分类列表：`miniprogram/pages/discovery/discovery.wxml` 第19-21行 (tabs遍历)

### 6. 点赞表 (likes)
需求来源：
- 视频点赞：`miniprogram/pages/video-detail/video-detail.ts` (第13行)
- 评论点赞：`miniprogram/pages/video-detail/video-detail.ts` (第27行)

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- target_id: string (被点赞对象ID)
- target_type: enum ('video', 'comment') (点赞类型)
- created_at: timestamp (创建时间)

数据插入位置：
- 视频点赞状态：`miniprogram/pages/video-detail/video-detail.ts` 第15行 (hasLiked)
- 评论点赞数：`miniprogram/pages/video-detail/video-detail.ts` 第23行 (likes)

### 7. 关注关系表 (follows)
需求来源：
- 关注功能：`miniprogram/pages/discovery/discovery.ts` (第7行)

字段设计：
- id: string (主键)
- follower_id: string (关注者ID，外键关联用户表)
- following_id: string (被关注者ID，外键关联用户表)
- created_at: timestamp (创建时间)

数据插入位置：
- 关注状态：`miniprogram/pages/video-detail/video-detail.ts` 第14行 (isFollowing)
- 关注列表：`miniprogram/pages/discovery/discovery.ts` 第15-25行 (关注分类下的视频)

### 8. 用户学习记录表 (learning_records)
需求来源：
- 学习页面：`miniprogram/pages/learning/learning.ts` (第2-38行)
- 学习进度：`miniprogram/pages/learning/learning.wxml` (第2-25行)

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- video_id: string (外键，关联视频表)
- progress: integer (学习进度，单位：秒)
- is_completed: boolean (是否完成)
- last_watched_at: timestamp (最后观看时间)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 学习列表：`miniprogram/pages/learning/learning.ts` 第19-38行 (wantToLearnList)
- 学习进度：需要在视频播放组件中添加进度记录功能

### 9. 社区帖子表 (posts)
需求来源：
- 帖子详情页：`miniprogram/pages/post-detail/post-detail.ts`
- 社区页面：`miniprogram/pages/community/community.ts`

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- content: text (帖子内容)
- images: string[] (图片URL数组)
- likes_count: integer (点赞数)
- comments_count: integer (评论数)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 帖子详情：`miniprogram/pages/post-detail/post-detail.ts` 第49-58行
- 帖子列表：`miniprogram/pages/community/community.ts`

## 三、API 接口定义

### 1. 实时姿势评测
#### WebSocket 连接
```typescript
WebSocket: /api/pose/realtime

// 请求参数
{
  userId: string;    // 用户ID
  poseId: string;    // 动作ID
  videoData: Blob;   // 视频流数据
}

// 响应数据
{
  accuracy: number;   // 准确度 0-100
  progress: number;   // 完成度 0-100
  suggestions: string[]; // 实时建议
}
```

### 2. 评测结果
#### 获取评测结果
```typescript
GET /api/pose/result

// 请求参数
{
  userId: string;    // 用户ID
  poseId: string;    // 动作ID
  sessionId: string; // 练习会话ID
}

// 响应数据
{
  finalScore: number;   // 最终得分 0-100
  accuracy: number;     // 准确度 0-100
  completion: number;   // 完成度 0-100
  fluency: number;      // 流畅度 0-100
  evaluations: [        // 各部位评价
    {
      part: string;     // 身体部位
      suggestions: string[]; // 改进建议
    }
  ]
}
```

### 3. 视频相关接口
```typescript
// 获取视频列表
GET /api/videos

// 获取视频详情
GET /api/videos/:id

// 上传视频
POST /api/videos

// 更新视频信息
PUT /api/videos/:id

// 删除视频
DELETE /api/videos/:id
```

### 4. 评论相关接口
```typescript
// 获取视频评论
GET /api/videos/:id/comments

// 发表评论
POST /api/videos/:id/comments

// 点赞评论
POST /api/comments/:id/like

// 取消点赞
POST /api/comments/:id/unlike
```

### 5. 社区帖子相关接口
```typescript
// 获取帖子列表
GET /api/posts
请求参数：
{
  page: number;      // 页码
  pageSize: number;  // 每页条数
  userId?: string;   // 可选，用户ID，获取指定用户的帖子
}
响应数据：
{
  code: 200,
  message: "success",
  data: {
    total: number,
    items: [{
      id: string;
      content: string;
      images: string[];
      createTime: string;
      likeCount: number;
      commentCount: number;
      isLiked: boolean;
      userInfo: {
        id: string;
        avatarUrl: string;
        nickName: string;
      }
    }]
  }
}

// 获取帖子详情
GET /api/posts/:id
响应数据：
{
  code: 200,
  message: "success",
  data: {
    id: string;
    content: string;
    images: string[];
    createTime: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    userInfo: {
      id: string;
      avatarUrl: string;
      nickName: string;
      isFollowed: boolean;
    }
  }
}

// 发布帖子
POST /api/posts
请求参数：
{
  content: string;   // 帖子内容
  images: string[];  // 图片URL数组
}

// 删除帖子
DELETE /api/posts/:id

// 获取帖子评论列表
GET /api/posts/:id/comments
请求参数：
{
  page: number;      // 页码
  pageSize: number;  // 每页条数
}
响应数据：
{
  code: 200,
  message: "success",
  data: {
    total: number,
    items: [{
      id: string;
      content: string;
      createTime: string;
      userInfo: {
        id: string;
        avatarUrl: string;
        nickName: string;
      }
    }]
  }
}

// 发表评论
POST /api/posts/:id/comments
请求参数：
{
  content: string;   // 评论内容
}
响应数据：
{
  code: 200,
  message: "success",
  data: {
    id: string;
    content: string;
    createTime: string;
    userInfo: {
      id: string;
      avatarUrl: string;
      nickName: string;
    }
  }
}

// 点赞帖子
POST /api/posts/:id/like
响应数据：
{
  code: 200,
  message: "success",
  data: {
    isLiked: boolean;
    likeCount: number;
  }
}

// 取消点赞
POST /api/posts/:id/unlike
响应数据：
{
  code: 200,
  message: "success",
  data: {
    isLiked: boolean;
    likeCount: number;
  }
}

// 关注用户
POST /api/users/:id/follow
响应数据：
{
  code: 200,
  message: "success",
  data: {
    isFollowed: boolean;
  }
}

// 取消关注
POST /api/users/:id/unfollow
响应数据：
{
  code: 200,
  message: "success",
  data: {
    isFollowed: boolean;
  }
}
```

## 四、注意事项

### 1. 数据库索引
- users表：openid (唯一索引)
- videos表：user_id, category_id (普通索引)
- pose_evaluations表：user_id, video_id, session_id (联合索引)
- comments表：video_id, user_id (普通索引)

### 2. 安全性考虑
- 所有接口需要进行用户身份验证
- 视频流数据传输建议使用 WSS (WebSocket Secure)
- 评测数据需要进行加密处理

### 3. 性能优化
- 使用 Redis 缓存热门视频和评测结果
- 评测数据建议采用分布式存储
- WebSocket 连接需要心跳检测和断线重连
- 视频流数据建议采用 H.264 编码

### 4. 错误处理
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 404: 资源不存在
- 500: 服务器错误

### 5. 数据存储
- 视频文件存储在对象存储服务
- 评测数据定期归档
- 用户数据需要定期备份
- 评测结果保存24小时后自动清理 