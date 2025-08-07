# LibreTV 完整功能说明文档

## 📖 目录

- [项目简介](#-项目简介)
- [核心功能](#-核心功能)
- [技术架构](#-技术架构)
- [配置管理](#-配置管理)
- [部署方式](#-部署方式)
- [用户界面](#-用户界面)
- [视频播放](#-视频播放)
- [搜索功能](#-搜索功能)
- [代理系统](#-代理系统)
- [认证安全](#-认证安全)
- [API接口](#-api接口)
- [开发指南](#-开发指南)
- [故障排除](#-故障排除)
- [更新日志](#-更新日志)

---

## 🎬 项目简介

LibreTV 是一个现代化的在线视频聚合平台，支持多种视频源的搜索、播放和管理。项目采用前后端分离架构，支持多平台部署，提供流畅的视频观看体验。

### 主要特色
- 🔍 **智能搜索** - 支持多源聚合搜索
- 🎥 **高清播放** - 支持多种视频格式和清晰度
- 🔐 **安全认证** - 完整的密码保护机制
- 🌐 **多平台部署** - 支持静态部署和服务器部署
- 📱 **响应式设计** - 适配桌面和移动设备
- ⚡ **高性能** - 代理缓存和优化加载

---

## 🚀 核心功能

### 1. 视频搜索功能
- **多源搜索**: 同时搜索多个视频API源
- **关键词搜索**: 支持中文、英文关键词
- **分类筛选**: 按类型、年份、地区筛选
- **搜索历史**: 自动记录搜索历史
- **热门推荐**: 显示热门影片推荐

### 2. 视频播放功能
- **多格式支持**: MP4, HLS, DASH等格式
- **清晰度切换**: 自动和手动清晰度选择
- **播放控制**: 播放、暂停、快进、快退
- **全屏播放**: 支持全屏和画中画模式
- **播放记录**: 自动记录播放进度
- **键盘快捷键**: 丰富的键盘控制

### 3. 内容管理
- **收藏功能**: 收藏喜欢的影片
- **播放历史**: 查看观看历史记录
- **观看进度**: 自动保存播放进度
- **分享功能**: 生成分享链接

### 4. 用户界面
- **现代化设计**: Material Design风格
- **深色模式**: 护眼的深色主题
- **响应式布局**: 适配各种屏幕尺寸
- **流畅动画**: 平滑的过渡效果
- **直观导航**: 简洁的导航结构

---

## 🏗️ 技术架构

### 前端技术栈
```
HTML5 + CSS3 + JavaScript (ES6+)
├── UI框架: Tailwind CSS
├── 视频播放: ArtPlayer + HLS.js
├── 图标: 自定义SVG图标
├── 动画: CSS3 Transitions
└── PWA: Service Worker支持
```

### 后端代理系统
```
Node.js + 边缘函数
├── 平台支持:
│   ├── Netlify Functions
│   ├── Vercel Serverless Functions
│   ├── Cloudflare Pages Functions
│   └── Node.js Express Server
├── 功能模块:
│   ├── 视频API代理
│   ├── CORS处理
│   ├── 缓存机制
│   └── 认证验证
```

### 文件结构
```
LibreTV-main/
├── 📁 config/                   # 配置文件
│   ├── master-config.js         # 主配置文件
│   └── config-loader.mjs        # Node.js配置加载器
├── 📁 js/                       # 前端JavaScript
│   ├── app.js                   # 主应用逻辑
│   ├── player.js                # 视频播放器
│   ├── search.js                # 搜索功能
│   ├── api.js                   # API调用
│   ├── auth-config.js           # 认证配置
│   ├── password.js              # 密码验证
│   ├── proxy-auth.js            # 代理认证
│   ├── ui.js                    # 界面交互
│   └── config.js                # 基础配置
├── 📁 css/                      # 样式文件
│   ├── styles.css               # 主样式
│   ├── index.css                # 首页样式
│   ├── player.css               # 播放器样式
│   ├── watch.css                # 观看页样式
│   └── modals.css               # 弹窗样式
├── 📁 libs/                     # 第三方库
│   ├── artplayer.min.js         # 视频播放器
│   ├── hls.min.js               # HLS支持
│   └── tailwindcss.min.js       # CSS框架
├── 📁 api/                      # Vercel API
│   └── proxy/[...path].mjs      # Vercel代理函数
├── 📁 netlify/                  # Netlify配置
│   ├── functions/proxy.mjs      # Netlify函数
│   └── edge-functions/          # 边缘函数
├── 📁 functions/                # Cloudflare Functions
│   ├── _middleware.js           # 中间件
│   └── proxy/[[path]].js        # 代理函数
├── 📄 index.html                # 主页面
├── 📄 player.html               # 播放器页面
├── 📄 watch.html                # 观看页面
├── 📄 about.html                # 关于页面
├── 📄 server.mjs                # Node.js服务器
├── 📄 simple-proxy.js           # 通用代理
└── 📄 service-worker.js         # PWA支持
```

---

## ⚙️ 配置管理

### 主配置文件 (config/master-config.js)

这是系统的核心配置文件，所有其他配置都从这里同步。

```javascript
const MASTER_CONFIG = {
    // 🔐 认证配置
    auth: {
        username: 'admin',                    // 登录用户名
        password: '123qwe!@#QWE',            // 登录密码
        enabled: true,                        // 是否启用认证
        sessionDuration: 90 * 24 * 60 * 60 * 1000,  // 会话时长
        maxLoginAttempts: 5,                  // 最大尝试次数
        lockoutDuration: 30 * 60 * 1000       // 锁定时间
    },
    
    // 🌐 代理配置
    proxy: {
        debug: false,                         // 调试模式
        cacheEnabled: true,                   // 启用缓存
        cacheTTL: 86400,                      // 缓存时间(秒)
        maxRecursion: 5,                      // 最大递归层数
        timeout: 10000,                       // 请求超时(毫秒)
        userAgents: [...]                     // User-Agent列表
    },
    
    // 🎨 UI配置
    ui: {
        title: 'LibreTV',                     // 应用标题
        loginTitle: 'LibreTV 访问验证',        // 登录标题
        loginPrompt: '请输入访问密码',         // 登录提示
        theme: 'dark'                         // 主题色调
    },
    
    // ⚙️ 应用配置
    app: {
        version: '2.0.0',                     // 版本号
        environment: 'production'             // 环境类型
    }
};
```

### 配置项详解

#### 认证配置 (auth)
| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `username` | string | 登录用户名 | `'admin'` |
| `password` | string | 登录密码(明文) | `'123qwe!@#QWE'` |
| `enabled` | boolean | 是否启用密码保护 | `true` |
| `sessionDuration` | number | 登录会话有效期(毫秒) | `90天` |
| `maxLoginAttempts` | number | 最大登录尝试次数 | `5` |
| `lockoutDuration` | number | 账户锁定时间(毫秒) | `30分钟` |

#### 代理配置 (proxy)
| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `debug` | boolean | 是否启用调试日志 | `false` |
| `cacheEnabled` | boolean | 是否启用API缓存 | `true` |
| `cacheTTL` | number | 缓存生存时间(秒) | `86400` |
| `maxRecursion` | number | M3U8解析最大递归层数 | `5` |
| `timeout` | number | 请求超时时间(毫秒) | `10000` |
| `userAgents` | array | 随机User-Agent列表 | `[...]` |

---

## 🌐 部署方式

### 1. 静态部署 (推荐)

#### GitHub Pages
```bash
1. Fork 项目到您的 GitHub 账户
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为发布源
4. 访问 https://yourusername.github.io/LibreTV-main
```

#### Netlify
```bash
1. 连接 GitHub 仓库到 Netlify
2. 构建设置: 
   - 构建命令: 留空
   - 发布目录: 留空(根目录)
3. 部署完成后访问分配的域名
```

#### Vercel
```bash
1. 导入 GitHub 仓库到 Vercel
2. 框架预设: Other
3. 构建和输出设置: 使用默认值
4. 部署完成后访问分配的域名
```

### 2. 服务器部署

#### Node.js 部署
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产模式
npm start

# 使用 PM2 管理进程
pm2 start server.mjs --name libretv
```

#### Docker 部署
```bash
# 使用预构建镜像
docker run -d \
  --name libretv \
  -p 8080:8080 \
  -e PASSWORD=your_password \
  bestzwei/libretv:latest

# 使用 Docker Compose
docker-compose up -d
```

### 3. 云函数部署

支持各大云平台的函数计算服务：
- **Netlify Functions** - 自动部署
- **Vercel Serverless** - 自动部署  
- **Cloudflare Workers** - 需要额外配置
- **AWS Lambda** - 需要适配层

---

## 🎨 用户界面

### 主页面功能

#### 导航栏
- **Logo**: 点击返回首页
- **搜索框**: 输入关键词搜索
- **设置按钮**: 打开设置面板
- **关于按钮**: 查看项目信息

#### 搜索界面
- **搜索输入**: 支持中英文搜索
- **搜索建议**: 显示搜索建议
- **搜索历史**: 最近搜索记录
- **热门推荐**: 推荐热门内容

#### 结果展示
- **网格布局**: 响应式网格展示
- **封面图片**: 高质量封面展示
- **基本信息**: 标题、年份、类型等
- **操作按钮**: 播放、收藏、分享

#### 设置面板
- **API源管理**: 添加/删除/启用API源
- **播放设置**: 默认清晰度、自动播放
- **界面设置**: 主题、语言、布局
- **缓存管理**: 清理缓存、查看使用情况

### 播放器页面

#### 视频播放器
- **主播放区**: 自适应视频播放
- **控制栏**: 播放控制、进度条、音量
- **设置菜单**: 清晰度、播放速度、字幕
- **全屏模式**: 支持全屏和网页全屏

#### 信息展示
- **影片信息**: 标题、导演、演员、简介
- **剧集列表**: 电视剧分集选择
- **相关推荐**: 相似影片推荐
- **评论区域**: 用户评论和评分

#### 快捷操作
- **收藏按钮**: 添加到收藏夹
- **分享按钮**: 生成分享链接
- **历史记录**: 自动记录观看进度
- **播放列表**: 连续播放管理

---

## 🎥 视频播放

### 播放器特性

#### 支持格式
- **MP4**: 标准MP4格式
- **HLS (m3u8)**: HTTP Live Streaming
- **DASH**: Dynamic Adaptive Streaming
- **FLV**: Flash Video格式

#### 播放控制
- **基础控制**: 播放、暂停、停止
- **进度控制**: 拖拽进度条、快进快退
- **音量控制**: 音量调节、静音切换
- **速度控制**: 0.5x - 2.0x播放速度

#### 高级功能
- **清晰度切换**: 自动/手动清晰度选择
- **字幕支持**: SRT、VTT字幕文件
- **画中画**: 支持浏览器画中画模式
- **投屏功能**: 支持DLNA和Chromecast

### 键盘快捷键

| 按键 | 功能 |
|------|------|
| `空格` | 播放/暂停 |
| `←` / `→` | 快退/快进 5秒 |
| `↑` / `↓` | 音量增加/减小 |
| `M` | 静音/取消静音 |
| `F` | 全屏/退出全屏 |
| `Esc` | 退出全屏 |
| `0-9` | 跳转到视频的 0%-90% |

### 播放优化

#### 自适应加载
- **网络检测**: 自动检测网络速度
- **清晰度适配**: 根据网络选择合适清晰度
- **预加载策略**: 智能预加载下一段内容
- **缓冲优化**: 最小化缓冲等待时间

#### 错误处理
- **源切换**: 自动尝试备用播放源
- **错误重试**: 网络错误自动重试
- **降级策略**: 高清播放失败时降级
- **用户提示**: 友好的错误提示信息

---

## 🔍 搜索功能

### 搜索机制

#### 多源聚合
```javascript
// 支持的API源类型
const API_SOURCES = {
    cms: '苹果CMS API',
    iptv: 'IPTV源',
    custom: '自定义API'
};

// 搜索流程
搜索请求 → 多源并发查询 → 结果去重合并 → 排序展示
```

#### 搜索参数
- **关键词搜索**: 支持中英文关键词
- **类型筛选**: 电影、电视剧、动漫、综艺
- **年份筛选**: 按发布年份筛选
- **地区筛选**: 内地、香港、台湾、日韩、欧美
- **排序方式**: 相关度、更新时间、评分

### 搜索优化

#### 智能匹配
- **模糊匹配**: 支持关键词模糊搜索
- **同义词识别**: 识别常见同义词
- **拼音搜索**: 支持拼音输入搜索
- **英文搜索**: 支持英文名称搜索

#### 搜索增强
- **搜索建议**: 实时搜索建议
- **热门搜索**: 显示热门搜索词
- **搜索历史**: 记录用户搜索历史
- **一键清空**: 快速清空搜索历史

### API源管理

#### 内置源
```javascript
// 预配置的API源
const DEFAULT_SOURCES = [
    {
        name: "源1",
        url: "https://api.example1.com/api.php/provide/vod",
        type: "cms",
        enabled: true
    },
    {
        name: "源2", 
        url: "https://api.example2.com/api.php/provide/vod",
        type: "cms",
        enabled: true
    }
];
```

#### 自定义源
- **添加源**: 支持添加自定义API源
- **源管理**: 启用/禁用/删除API源
- **源测试**: 测试API源连通性
- **源排序**: 调整搜索优先级

---

## 🌐 代理系统

### 代理架构

#### 多平台支持
```
客户端请求 → 平台代理 → 目标API → 返回数据
```

支持的平台：
- **Netlify Functions** (`netlify/functions/proxy.mjs`)
- **Vercel Serverless** (`api/proxy/[...path].mjs`) 
- **Cloudflare Pages** (`functions/proxy/[[path]].js`)
- **Node.js Server** (`server.mjs`)
- **通用代理** (`simple-proxy.js`)

#### 代理功能
- **CORS处理**: 解决跨域请求问题
- **请求转发**: 透明代理API请求
- **响应缓存**: 缓存API响应提高性能
- **错误处理**: 统一错误处理和重试
- **认证验证**: 验证客户端访问权限

### 缓存机制

#### 缓存策略
```javascript
const CACHE_STRATEGY = {
    // 搜索结果缓存 1小时
    search: { ttl: 3600, key: 'search:{query}' },
    // 详情信息缓存 6小时  
    detail: { ttl: 21600, key: 'detail:{id}' },
    // 播放源缓存 30分钟
    play: { ttl: 1800, key: 'play:{id}' }
};
```

#### 缓存优化
- **分层缓存**: 内存缓存 + 本地存储
- **智能失效**: 基于TTL和版本的缓存失效
- **预加载**: 预测性内容预加载
- **压缩存储**: gzip压缩减少存储空间

### 负载均衡

#### 源轮询
- **健康检查**: 定期检查源的可用性
- **故障切换**: 自动切换到可用源
- **权重分配**: 根据响应速度分配权重
- **并发限制**: 限制单个源的并发请求

---

## 🔐 认证安全

### 认证机制

#### 密码认证
```javascript
// 认证流程
用户输入密码 → SHA-256哈希 → 与配置对比 → 生成会话 → 存储本地
```

#### 会话管理
- **会话生成**: 登录成功生成会话token
- **会话验证**: 每次请求验证会话有效性
- **会话续期**: 活跃用户自动续期会话
- **会话销毁**: 超时或手动退出销毁会话

### 安全特性

#### 防护机制
- **暴力破解防护**: 限制登录尝试次数
- **账户锁定**: 多次失败后临时锁定
- **时间窗口**: 基于时间窗口的频率限制
- **IP限制**: 可选的IP访问限制

#### 数据安全
- **密码哈希**: SHA-256哈希存储密码
- **传输加密**: HTTPS加密数据传输
- **本地存储**: 敏感数据加密存储
- **定期清理**: 定期清理过期数据

### 认证配置

#### 安全级别配置
```javascript
// 高安全级别
const HIGH_SECURITY = {
    sessionDuration: 2 * 60 * 60 * 1000,    // 2小时
    maxLoginAttempts: 3,                      // 3次尝试
    lockoutDuration: 60 * 60 * 1000,         // 锁定1小时
    requireStrongPassword: true               // 要求强密码
};

// 中等安全级别  
const MEDIUM_SECURITY = {
    sessionDuration: 24 * 60 * 60 * 1000,    // 24小时
    maxLoginAttempts: 5,                      // 5次尝试
    lockoutDuration: 30 * 60 * 1000,         // 锁定30分钟
    requireStrongPassword: false              // 不要求强密码
};
```

---

## 📡 API接口

### RESTful API

#### 搜索接口
```
GET /api/search?q={keyword}&type={type}&page={page}
```

参数：
- `q`: 搜索关键词
- `type`: 内容类型 (1=电影, 2=电视剧, 3=动漫, 4=综艺)
- `page`: 页码，默认1

响应：
```json
{
    "code": 1,
    "msg": "success", 
    "data": {
        "list": [...],
        "total": 100,
        "page": 1,
        "limit": 20
    }
}
```

#### 详情接口
```
GET /api/detail?id={video_id}
```

响应：
```json
{
    "code": 1,
    "msg": "success",
    "data": {
        "vod_id": 123,
        "vod_name": "电影名称",
        "vod_pic": "封面URL",
        "vod_year": "2024",
        "vod_area": "内地",
        "vod_director": "导演",
        "vod_actor": "演员",
        "vod_content": "剧情简介",
        "vod_play_url": "播放地址"
    }
}
```

### 代理接口

#### 通用代理
```
POST /api/proxy
Content-Type: application/json

{
    "url": "目标URL",
    "method": "GET|POST",
    "headers": {...},
    "data": {...}
}
```

#### 认证代理
```
POST /api/proxy?auth={hash}&t={timestamp}
```

参数：
- `auth`: 密码的SHA-256哈希值
- `t`: 当前时间戳

---

## 🛠️ 开发指南

### 本地开发

#### 环境要求
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器 (Chrome, Firefox, Safari)

#### 快速开始
```bash
# 克隆项目
git clone https://github.com/your-repo/LibreTV.git
cd LibreTV

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080
```

### 开发配置

#### 开发环境配置
```javascript
// config/master-config.js - 开发配置
const MASTER_CONFIG = {
    auth: {
        enabled: false,        // 开发时可禁用认证
        // ...
    },
    proxy: {
        debug: true,          // 启用调试日志
        cacheEnabled: false,  // 禁用缓存便于调试
        timeout: 30000,       // 增加超时时间
        // ...
    },
    app: {
        environment: 'development'
    }
};
```

#### 调试工具
- **浏览器控制台**: 查看JavaScript错误和日志
- **网络面板**: 监控API请求和响应
- **应用面板**: 查看本地存储和会话
- **调试页面**: 访问 `debug-auth.html` 进行认证调试

### 代码结构

#### 前端架构
```
js/
├── app.js           # 主应用逻辑，页面初始化
├── player.js        # 视频播放器控制
├── search.js        # 搜索功能实现
├── api.js           # API调用封装
├── ui.js           # UI交互和动画
├── config.js       # 基础配置和常量
├── auth-config.js  # 认证配置管理
├── password.js     # 密码验证逻辑
└── proxy-auth.js   # 代理认证处理
```

#### 关键函数说明

##### app.js
```javascript
// 主应用初始化
function initializeApp() { ... }

// 页面路由处理
function handleRouting() { ... }

// 全局事件监听
function setupEventListeners() { ... }
```

##### search.js
```javascript
// 执行搜索
async function performSearch(query, options) { ... }

// 渲染搜索结果
function renderSearchResults(results) { ... }

// 搜索历史管理
function manageSearchHistory() { ... }
```

##### player.js
```javascript
// 初始化播放器
function initializePlayer(container, options) { ... }

// 播放视频
function playVideo(url, options) { ... }

// 播放器控制
function setupPlayerControls() { ... }
```

### 自定义扩展

#### 添加新的API源
```javascript
// 1. 在设置中添加API源配置
const newSource = {
    name: "新API源",
    url: "https://api.example.com/api.php/provide/vod",
    type: "cms",
    enabled: true,
    headers: {
        "User-Agent": "LibreTV/1.0"
    }
};

// 2. 实现API适配器
class CustomAPIAdapter {
    async search(query) { ... }
    async getDetail(id) { ... }
    async getPlayUrl(id) { ... }
}
```

#### 自定义主题
```css
/* css/custom-theme.css */
:root {
    --primary-color: #your-color;
    --background-color: #your-bg;
    --text-color: #your-text;
}

/* 应用自定义样式 */
.custom-theme {
    /* 您的样式规则 */
}
```

---

## 🔧 故障排除

### 常见问题

#### 1. 视频无法播放
**症状**: 点击播放按钮无反应或显示错误

**可能原因**:
- 视频源失效
- 网络连接问题
- 播放器加载失败
- CORS跨域问题

**解决方案**:
```bash
# 1. 检查网络连接
ping video-source.com

# 2. 清除浏览器缓存
Ctrl+Shift+Del (清除缓存和Cookie)

# 3. 尝试其他视频源
在播放器中切换到其他清晰度或源

# 4. 查看控制台错误
F12 → Console 查看错误信息
```

#### 2. 搜索无结果
**症状**: 搜索后显示无结果或加载失败

**可能原因**:
- API源不可用
- 代理服务异常
- 搜索关键词问题
- 认证失败

**解决方案**:
```javascript
// 1. 检查API源状态
console.log('API Sources:', window.config.apiSources);

// 2. 测试代理连接
fetch('/api/proxy/test').then(r => r.json()).then(console.log);

// 3. 检查认证状态
console.log('Auth Status:', window.isPasswordVerified());
```

#### 3. 密码验证失败
**症状**: 输入正确密码仍然提示错误

**解决方案**:
```bash
# 1. 访问调试页面
浏览器打开: debug-auth.html

# 2. 检查配置文件
确认 config/master-config.js 中密码设置正确

# 3. 清除本地存储
localStorage.clear();
sessionStorage.clear();

# 4. 重新计算哈希
访问 final-test.html 进行完整测试
```

#### 4. 页面样式错误
**症状**: 页面布局混乱或样式不正确

**解决方案**:
```bash
# 1. 强制刷新
Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)

# 2. 检查CSS文件加载
F12 → Network → 查看CSS文件是否正常加载

# 3. 禁用浏览器扩展
暂时禁用广告拦截器等扩展

# 4. 使用隐身模式测试
使用浏览器隐身模式访问
```

### 性能优化

#### 播放性能
```javascript
// 优化播放器配置
const playerConfig = {
    // 启用硬件加速
    videoAcceleration: true,
    // 预加载策略
    preload: 'metadata',
    // 缓冲配置
    bufferConfig: {
        maxBufferLength: 30,
        maxMaxBufferLength: 600
    }
};
```

#### 网络优化
```javascript
// 启用服务端缓存
const cacheConfig = {
    enabled: true,
    ttl: 3600,
    compression: true
};

// 使用CDN加速
const cdnConfig = {
    enableCDN: true,
    cdnUrls: [
        'https://cdn1.example.com',
        'https://cdn2.example.com'
    ]
};
```

### 日志调试

#### 启用调试模式
```javascript
// 在 config/master-config.js 中启用调试
const MASTER_CONFIG = {
    proxy: {
        debug: true,  // 启用代理调试
        // ...
    },
    app: {
        environment: 'development'  // 设置为开发环境
    }
};
```

#### 查看日志
```bash
# 浏览器控制台日志
F12 → Console

# 服务器日志 (Node.js部署)
tail -f logs/app.log

# Docker日志
docker logs libretv -f
```

---

## 📊 监控统计

### 使用统计

#### 基础统计
- **访问量**: 页面访问次数
- **用户数**: 独立访问用户
- **播放量**: 视频播放次数
- **搜索量**: 搜索请求次数

#### 性能指标
- **加载时间**: 页面加载完成时间
- **播放启动**: 视频开始播放时间
- **缓冲时间**: 视频缓冲总时间
- **错误率**: 请求失败率

### 数据收集

#### 前端埋点
```javascript
// 页面访问统计
function trackPageView(page) {
    analytics.track('page_view', {
        page: page,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    });
}

// 播放统计
function trackVideoPlay(videoId) {
    analytics.track('video_play', {
        video_id: videoId,
        timestamp: Date.now()
    });
}
```

#### 后端监控
```javascript
// API调用统计
function trackAPICall(endpoint, duration, success) {
    metrics.record('api_call', {
        endpoint: endpoint,
        duration: duration,
        success: success,
        timestamp: Date.now()
    });
}
```

---

## 🚀 更新日志

### v2.0.0 (2024-01-15)
- 🆕 **统一配置系统**: 实现单点配置管理
- 🔐 **增强认证安全**: 改进密码验证机制
- ⚡ **性能优化**: 优化资源加载和缓存策略
- 🎨 **UI改进**: 更新界面设计和交互体验
- 🐛 **问题修复**: 修复多个已知问题

### v1.9.0 (2023-12-20)
- 🆕 **PWA支持**: 添加渐进式Web应用功能
- 📱 **移动优化**: 改进移动端适配
- 🔍 **搜索增强**: 优化搜索算法和结果排序
- 🎥 **播放器升级**: 更新到ArtPlayer最新版本

### v1.8.0 (2023-11-15)
- 🆕 **多源支持**: 支持更多视频API源
- 🌐 **国际化**: 添加多语言支持
- 🔧 **开发工具**: 新增调试和测试工具
- 📊 **统计功能**: 添加使用统计和分析

### v1.7.0 (2023-10-10)
- 🆕 **字幕支持**: 支持外挂字幕文件
- 🎨 **主题系统**: 可自定义主题和样式
- 🔄 **自动更新**: 添加版本检查和更新提醒
- 🐛 **稳定性改进**: 提高系统稳定性和容错性

---

## 📞 技术支持

### 获取帮助

#### 在线资源
- **项目文档**: [README.md](./README.md)
- **配置指南**: [密码配置指南.md](./密码配置指南.md)
- **快速开始**: [快速密码修改.md](./快速密码修改.md)

#### 调试工具
- **认证调试**: [debug-auth.html](./debug-auth.html)
- **功能测试**: [final-test.html](./final-test.html)
- **简单测试**: [test-password-simple.html](./test-password-simple.html)

#### 问题反馈
如果遇到问题，请提供以下信息：
1. 操作系统和浏览器版本
2. 详细的错误描述和重现步骤
3. 浏览器控制台的错误信息
4. 网络环境和部署方式

### 开发社区

#### 贡献指南
欢迎提交Pull Request和Issue，请遵循以下规范：
- 代码风格: 使用ESLint和Prettier
- 提交信息: 使用语义化提交信息
- 测试要求: 确保新功能有相应测试
- 文档更新: 重要更改需要更新文档

---

**最后更新**: 2024年1月15日  
**文档版本**: v2.0.0  
**项目地址**: [GitHub Repository](https://github.com/your-repo/LibreTV)