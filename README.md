# 📱 验证码接收 PWA 应用

一个现代化的渐进式 Web 应用（PWA），用于接收和管理来自 Cloudflare Worker 的验证码。

## ✨ 功能特性

- 🔧 **灵活配置**：支持自定义 Cloudflare Worker URL
- 🔄 **实时刷新**：一键刷新获取最新验证码
- 📋 **一键复制**：快速复制验证码到剪贴板
- 🎨 **现代设计**：响应式设计，支持深色模式
- 📱 **PWA 支持**：可添加到主屏幕，像原生 APP 一样使用
- 🌐 **离线支持**：Service Worker 缓存，离线也能查看
- ⚡ **快速加载**：使用 Vite 构建，加载速度极快

## 🚀 快速开始

### 前置要求

- Node.js 16+ 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
# 进入项目目录
cd pwa-verification-app

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📖 使用说明

### 1. 配置 Worker URL

1. 打开应用，切换到 **设置** 标签页
2. 在 **Worker URL** 输入框中填入你的 Cloudflare Worker API 地址
   - 例如：`https://your-worker.workers.dev/api/codes`
3. 点击 **测试连接** 验证 URL 是否可用
4. 配置会自动保存到浏览器本地存储

### 2. 查看验证码

1. 切换到 **验证码** 标签页
2. 点击右上角的刷新按钮获取最新验证码
3. 点击验证码右侧的复制按钮可快速复制
4. 点击验证码下方的删除按钮可删除单条记录
5. 点击右上角的垃圾桶图标可清空所有验证码

### 3. 添加到主屏幕（iOS）

1. 在 Safari 浏览器中打开应用
2. 点击底部的 **分享** 按钮
3. 选择 **添加到主屏幕**
4. 点击 **添加**

之后就可以像原生 APP 一样从主屏幕启动应用了！

### 4. 添加到主屏幕（Android）

1. 在 Chrome 浏览器中打开应用
2. 点击右上角的菜单按钮（三个点）
3. 选择 **添加到主屏幕** 或 **安装应用**
4. 点击 **安装**

## 🔌 API 接口规范

你的 Cloudflare Worker 应该返回以下格式之一的 JSON 数据：

### 格式 1：带状态包装（推荐）

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "code": "123456",
      "phone": "+86 138****1234",
      "time": "2025-10-20T10:30:00Z",
      "source": "某服务"
    }
  ],
  "message": "获取成功"
}
```

### 格式 2：直接数组

```json
[
  {
    "code": "123456",
    "phone": "+86 138****1234",
    "time": "2025-10-20T10:30:00Z"
  }
]
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | String | 否 | 唯一标识符（如不提供会自动生成） |
| `code` | String | 是 | 验证码内容 |
| `phone` | String | 是 | 手机号（建议脱敏处理） |
| `time` | String/Number | 是 | 接收时间（ISO8601 格式或时间戳） |
| `source` | String | 否 | 来源信息 |

## 🌐 部署指南

### 部署到 Cloudflare Pages（推荐）

1. 将代码推送到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Pages** → **创建项目**
4. 连接你的 GitHub 仓库
5. 配置构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
6. 点击 **保存并部署**

### 部署到 Vercel

1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按照提示完成部署

### 部署到 Netlify

1. 将代码推送到 GitHub
2. 登录 [Netlify](https://www.netlify.com/)
3. 点击 **New site from Git**
4. 选择你的仓库
5. 配置构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`dist`
6. 点击 **Deploy site**

## 🏗️ 项目结构

```
pwa-verification-app/
├── public/                    # 静态资源
│   ├── manifest.json         # PWA 配置
│   └── ICONS_README.md       # 图标说明
├── src/
│   ├── components/           # React 组件
│   │   ├── CodesList.tsx    # 验证码列表
│   │   ├── Settings.tsx     # 设置页面
│   │   └── BottomNav.tsx    # 底部导航
│   ├── services/            # 服务层
│   │   └── api.ts          # API 请求
│   ├── types/              # TypeScript 类型
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── time.ts        # 时间格式化
│   │   └── storage.ts     # 本地存储
│   ├── App.tsx            # 主应用
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── index.html
├── package.json
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
└── tsconfig.json          # TypeScript 配置
```

## 🎨 技术栈

- **框架**：React 18
- **构建工具**：Vite 5
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **PWA**：vite-plugin-pwa
- **图标**：Lucide React

## 🔧 自定义配置

### 修改主题色

在 `tailwind.config.js` 中修改：

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6', // 改为你喜欢的颜色
      }
    }
  }
}
```

### 修改应用名称

在 `vite.config.ts` 中修改 PWA 配置：

```ts
manifest: {
  name: '你的应用名称',
  short_name: '短名称',
}
```

## 🐛 常见问题

### Q: 提示"未配置 Worker URL"
**A:** 请先在设置页面配置 Cloudflare Worker 的 URL 地址。

### Q: 连接测试失败
**A:** 请检查：
- URL 格式是否正确
- Worker 服务是否正常运行
- 网络连接是否正常
- API 返回格式是否符合规范
- 是否存在 CORS 跨域问题

### Q: 无法添加到主屏幕
**A:** 请确保：
- 使用 HTTPS 协议（或 localhost）
- 已正确配置 manifest.json
- 图标文件存在
- 使用支持 PWA 的浏览器（Safari、Chrome）

### Q: 图标不显示
**A:** 请参考 `public/ICONS_README.md` 生成并添加图标文件。

## 📝 开发计划

- [ ] 支持推送通知
- [ ] 添加验证码搜索功能
- [ ] 支持多个 Worker URL 配置
- [ ] 添加验证码历史记录
- [ ] 支持自动刷新
- [ ] 添加数据导出功能

## 📄 许可证

本项目仅供学习和参考使用。

## 👨‍💻 技术支持

如有问题或建议，欢迎提出 Issue。

---

**开发环境**：Node.js 16+ / Windows/Mac/Linux  
**浏览器支持**：Chrome 90+, Safari 14+, Firefox 88+, Edge 90+  
**移动端支持**：iOS 14+, Android 8+

