# 微信小程序数据库需求文档

## 数据库需求来源文件参考

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
- title: string (视频标题，参考 video-detail.ts 第49行)
- description: text (视频描述，参考 video-detail.ts 第50行)
- video_url: string (视频文件URL)
- thumbnail_url: string (缩略图URL，参考 discovery.ts 第15行)
- category_id: string (外键，关联分类表)
- visibility: enum ('public', 'friends', 'private') (可见性，参考 upload.ts 第3行)
- views_count: integer (观看次数)
- likes_count: integer (点赞数)
- comments_count: integer (评论数)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 视频基本信息：`miniprogram/pages/video-detail/video-detail.ts` 第49-58行
- 视频列表数据：`miniprogram/pages/discovery/discovery.ts` 第15-93行 (videoRows数组)
- 视频分类：`miniprogram/pages/discovery/discovery.ts` 第6-14行 (tabs数组)

### 3. 分类表 (categories)
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
- parent_id: string (父评论ID，用于回复功能)
- created_at: timestamp (创建时间)
- updated_at: timestamp (更新时间)

数据插入位置：
- 评论数据：`miniprogram/pages/video-detail/video-detail.ts` 第17-39行 (commentList数组)
- 评论计数：`miniprogram/pages/video-detail/video-detail.ts` 第11行 (comments)

### 5. 点赞表 (likes)
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

### 6. 关注关系表 (follows)
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

### 7. 用户学习记录表 (learning_records)
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

### 8. 搜索历史表 (search_history)
需求来源：
- 搜索功能：`miniprogram/pages/discovery/discovery.ts` (第39-60行)
- 搜索框：`miniprogram/pages/discovery/discovery.wxml` (第10-14行)

字段设计：
- id: string (主键)
- user_id: string (外键，关联用户表)
- keyword: string (搜索关键词)
- created_at: timestamp (创建时间)

数据插入位置：
- 搜索记录：`miniprogram/pages/discovery/discovery.ts` 第39-60行 (onSearch函数)

## 数据库索引建议
1. users表：
   - openid (唯一索引)
   - nickname (普通索引)

2. videos表：
   - user_id (普通索引)
   - category_id (普通索引)
   - created_at (普通索引)
   - views_count (普通索引)

3. comments表：
   - video_id (普通索引)
   - user_id (普通索引)
   - parent_id (普通索引)

4. likes表：
   - user_id, target_id, target_type (联合唯一索引)

5. follows表：
   - follower_id, following_id (联合唯一索引)

6. learning_records表：
   - user_id, video_id (联合唯一索引)
   - last_watched_at (普通索引)

## 注意事项
1. 所有表都应该使用软删除机制，添加 deleted_at 字段
2. 需要添加适当的数据库约束来保证数据完整性
3. 对于大型文本内容，考虑使用文本搜索引擎（如Elasticsearch）来提升搜索性能
4. 考虑使用缓存机制（如Redis）来缓存热门视频、用户信息等数据
5. 重要的统计数据（如点赞数、评论数）考虑使用计数器服务来处理
6. 文件存储（视频、图片等）建议使用对象存储服务

## API 接口路径建议
1. 用户相关：
   - GET /api/users/:id - 获取用户信息
   - PUT /api/users/:id - 更新用户信息
   - GET /api/users/:id/followers - 获取用户粉丝列表
   - GET /api/users/:id/following - 获取用户关注列表

2. 视频相关：
   - GET /api/videos - 获取视频列表
   - POST /api/videos - 上传视频
   - GET /api/videos/:id - 获取视频详情
   - PUT /api/videos/:id - 更新视频信息
   - DELETE /api/videos/:id - 删除视频
   - POST /api/videos/:id/like - 点赞视频
   - POST /api/videos/:id/unlike - 取消点赞

3. 评论相关：
   - GET /api/videos/:id/comments - 获取视频评论列表
   - POST /api/videos/:id/comments - 发表评论
   - DELETE /api/comments/:id - 删除评论
   - POST /api/comments/:id/like - 点赞评论
   - POST /api/comments/:id/unlike - 取消点赞评论

4. 学习记录相关：
   - GET /api/learning-records - 获取学习记录
   - POST /api/learning-records - 创建/更新学习记录
   - GET /api/learning-records/:video_id/progress - 获取特定视频的学习进度 