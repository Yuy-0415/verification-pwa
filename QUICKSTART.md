# ⚡ 快速开始指南

5 分钟内让你的验证码接收 PWA 应用运行起来！

## 📋 前置要求

- ✅ Windows 电脑（你已经有了）
- ✅ 安装 Node.js（如果没有，请先安装）

## 🔧 安装 Node.js（如果还没有）

### 下载安装

1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或 20.x）
3. 运行安装程序，一路点击"下一步"
4. 安装完成后，打开命令提示符（CMD）或 PowerShell
5. 验证安装：
   ```bash
   node --version
   npm --version
   ```

## 🚀 启动项目（3 步）

### 步骤 1：打开项目目录

在命令提示符或 PowerShell 中：

```bash
# 进入项目目录（替换为你的实际路径）
cd D:\A-接单\手机端接验证码\pwa-verification-app
```

### 步骤 2：安装依赖

```bash
npm install
```

这一步会下载所有需要的包，可能需要 1-3 分钟。

### 步骤 3：启动开发服务器

```bash
npm run dev
```

看到类似这样的输出：

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
```

## 🎉 访问应用

1. 打开浏览器（推荐 Chrome）
2. 访问 `http://localhost:3000`
3. 你应该能看到应用界面了！

## 📱 在手机上测试

### 方法 1：使用局域网地址

1. 确保手机和电脑在同一个 WiFi 网络
2. 在手机浏览器中访问 `http://192.168.1.100:3000`（使用上面显示的 Network 地址）
3. 就可以在手机上看到应用了！

### 方法 2：部署后测试

参考 `DEPLOYMENT.md` 将应用部署到 Cloudflare Pages，然后在手机上访问部署后的 URL。

## ⚙️ 配置 Worker URL

1. 在应用中切换到"设置"标签页
2. 输入你的 Cloudflare Worker URL
3. 点击"测试连接"
4. 如果成功，切换到"验证码"标签页
5. 点击刷新按钮获取验证码

## 🔨 构建生产版本

当你准备部署时：

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

构建产物在 `dist/` 目录，可以直接部署到任何静态网站托管服务。

## 🌐 部署到 Cloudflare Pages（推荐）

### 最简单的方法：

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建一个新仓库

2. **推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **部署到 Cloudflare Pages**
   - 访问 https://dash.cloudflare.com/
   - 点击 Pages → 创建项目
   - 连接 GitHub 仓库
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 点击"保存并部署"

4. **完成！**
   - 几分钟后，你会得到一个 URL：`https://你的项目名.pages.dev`
   - 在手机浏览器中打开这个 URL
   - 点击"添加到主屏幕"
   - 现在你有一个像原生 APP 一样的应用了！

## 📝 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 🐛 遇到问题？

### 问题 1: `npm install` 失败

**解决方案**：
```bash
# 清除缓存
npm cache clean --force

# 重新安装
npm install
```

### 问题 2: 端口 3000 被占用

**解决方案**：
修改 `vite.config.ts` 中的端口号：
```ts
server: {
  port: 3001,  // 改为其他端口
}
```

### 问题 3: 手机无法访问

**解决方案**：
- 确保手机和电脑在同一个 WiFi
- 检查防火墙设置
- 尝试关闭 Windows 防火墙

### 问题 4: Worker URL 连接失败

**解决方案**：
- 检查 URL 是否正确
- 确保 Worker 已部署并运行
- 检查 Worker 是否返回正确的 JSON 格式
- 确保 Worker 设置了 CORS 头

## 💡 下一步

- 📖 阅读 `README.md` 了解更多功能
- 🚀 阅读 `DEPLOYMENT.md` 了解部署选项
- 🎨 自定义样式和主题色
- 🔧 配置你的 Cloudflare Worker

## 🎊 恭喜！

你已经成功运行了验证码接收 PWA 应用！

如果有任何问题，请查看项目文档或提出 Issue。

---

**享受你的应用吧！** 🚀

