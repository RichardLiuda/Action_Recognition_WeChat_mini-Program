# 姿势评测接口文档

## 实时姿势数据
### 请求
- URL: `/api/pose/realtime`
- Method: `WebSocket`
- 参数：
  ```typescript
  {
    userId: string;    // 用户ID
    poseId: string;    // 动作ID
    videoData: Blob;   // 视频流数据
  }
  ```

### 响应
- 实时返回数据：
  ```typescript
  {
    accuracy: number;   // 准确度 0-100
    progress: number;   // 完成度 0-100
    suggestions: string[]; // 实时建议
  }
  ```

## 评测结果
### 请求
- URL: `/api/pose/result`
- Method: `GET`
- 参数：
  ```typescript
  {
    userId: string;    // 用户ID
    poseId: string;    // 动作ID
    sessionId: string; // 练习会话ID
  }
  ```

### 响应
```typescript
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

## 错误码说明
- 200: 成功
- 400: 参数错误
- 401: 未授权
- 404: 资源不存在
- 500: 服务器错误

## 注意事项
1. WebSocket 连接需要保持稳定，建议添加重连机制
2. 视频流数据建议采用 H.264 编码
3. 评测结果会在练习结束后保存 24 小时
4. 建议在网络状态良好的情况下使用 