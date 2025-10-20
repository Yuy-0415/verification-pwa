# 🚀 部署指南

本文档详细说明如何将 PWA 应用部署到各种平台。

## 📋 部署前准备

### 1. 生成图标

在部署前，请先生成 PWA 所需的图标文件。参考 `public/ICONS_README.md`。

### 2. 构建项目

```bash
npm run build
```

构建完成后，`dist/` 目录包含所有需要部署的文件。

### 3. 本地预览

```bash
npm run preview
```

在浏览器中访问 `http://localhost:4173` 预览生产版本。

---

## 🌐 部署到 Cloudflare Pages（推荐）

### 为什么选择 Cloudflare Pages？

- ✅ **完全免费**（无限流量和请求）
- ✅ **全球 CDN**（速度快）
- ✅ **自动 HTTPS**
- ✅ **与 Cloudflare Worker 完美集成**
- ✅ **自动部署**（Git 推送后自动构建）

### 部署步骤

#### 方法 1：通过 Dashboard（推荐）

1. **准备 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库.git
   git push -u origin main
   ```

2. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账号（没有账号则注册一个，免费）

3. **创建 Pages 项目**
   - 点击左侧菜单 **Pages**
   - 点击 **创建项目** → **连接到 Git**
   - 授权 GitHub/GitLab
   - 选择你的仓库

4. **配置构建设置**
   - 项目名称：`verification-app`（或其他名称）
   - 生产分支：`main`
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 环境变量：无需配置

5. **部署**
   - 点击 **保存并部署**
   - 等待构建完成（约 1-2 分钟）
   - 部署成功后会得到一个 URL：`https://你的项目名.pages.dev`

#### 方法 2：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npm run build
wrangler pages deploy dist --project-name=verification-app
```

### 自定义域名

1. 在 Cloudflare Pages 项目中，点击 **自定义域**
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 🔷 部署到 Vercel

### 部署步骤

#### 方法 1：通过 Dashboard

1. 访问 https://vercel.com/
2. 点击 **New Project**
3. 导入你的 Git 仓库
4. 配置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击 **Deploy**

#### 方法 2：通过 CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 部署到生产环境
vercel --prod
```

---

## 🟢 部署到 Netlify

### 部署步骤

#### 方法 1：通过 Dashboard

1. 访问 https://www.netlify.com/
2. 点击 **New site from Git**
3. 选择你的 Git 仓库
4. 配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 **Deploy site**

#### 方法 2：通过 CLI

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

---

## 🐙 部署到 GitHub Pages

### 部署步骤

1. **修改 `vite.config.ts`**
   ```ts
   export default defineConfig({
     base: '/你的仓库名/',  // 添加这一行
     // ... 其他配置
   })
   ```

2. **创建部署脚本**
   
   创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `gh-pages` 分支
   - 保存

4. **推送代码**
   ```bash
   git add .
   git commit -m "Add GitHub Actions"
   git push
   ```

---

## 🖥️ 部署到自己的服务器

### 使用 Nginx

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传文件**
   
   将 `dist/` 目录的所有文件上传到服务器的 Web 目录（如 `/var/www/html`）

3. **配置 Nginx**
   
   创建 `/etc/nginx/sites-available/verification-app`：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 启用 gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # 缓存静态资源
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **启用站点**
   ```bash
   sudo ln -s /etc/nginx/sites-available/verification-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **配置 HTTPS**（推荐使用 Let's Encrypt）
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📱 测试 PWA 功能

部署后，使用以下方法测试 PWA 功能：

### 1. Chrome DevTools

1. 打开部署的网站
2. 按 F12 打开开发者工具
3. 切换到 **Application** 标签
4. 检查：
   - Manifest：确认配置正确
   - Service Workers：确认已注册
   - Storage：确认可以存储数据

### 2. Lighthouse 审计

1. 在 Chrome DevTools 中切换到 **Lighthouse** 标签
2. 选择 **Progressive Web App**
3. 点击 **Generate report**
4. 查看 PWA 评分和建议

### 3. 移动设备测试

1. 在手机浏览器中打开网站
2. 尝试添加到主屏幕
3. 从主屏幕启动应用
4. 测试离线功能（开启飞行模式）

---

## 🔧 环境变量配置

如果需要配置环境变量（如默认 Worker URL），可以：

### Cloudflare Pages

在项目设置中添加环境变量：
- `VITE_DEFAULT_WORKER_URL`

### Vercel/Netlify

在项目设置中添加环境变量，或创建 `.env.production`：
```
VITE_DEFAULT_WORKER_URL=https://your-worker.workers.dev/api/codes
```

在代码中使用：
```ts
const defaultURL = import.meta.env.VITE_DEFAULT_WORKER_URL || '';
```

---

## 🐛 常见部署问题

### 问题 1: 404 错误

**原因**：SPA 路由配置问题

**解决方案**：
- Cloudflare Pages：自动处理
- Vercel：自动处理
- Netlify：添加 `public/_redirects` 文件：
  ```
  /*    /index.html   200
  ```
- Nginx：使用 `try_files $uri $uri/ /index.html;`

### 问题 2: Service Worker 不更新

**解决方案**：
1. 清除浏览器缓存
2. 在 DevTools → Application → Service Workers 中点击 **Unregister**
3. 刷新页面

### 问题 3: CORS 错误

**原因**：Worker API 没有设置 CORS 头

**解决方案**：在 Cloudflare Worker 中添加 CORS 头：
```js
headers.set('Access-Control-Allow-Origin', '*');
```

---

## 📊 性能优化建议

1. **启用 CDN**：使用 Cloudflare Pages 自动获得全球 CDN
2. **启用压缩**：Gzip/Brotli 压缩
3. **缓存策略**：合理设置静态资源缓存时间
4. **图片优化**：使用 WebP 格式，压缩图片
5. **代码分割**：Vite 自动进行代码分割

---

## 🎉 部署完成

部署成功后，你可以：

1. 在手机浏览器中打开网站
2. 添加到主屏幕
3. 像使用原生 APP 一样使用

**享受你的 PWA 应用吧！** 🚀

