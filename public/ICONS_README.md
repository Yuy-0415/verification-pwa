# PWA 图标说明

本应用需要以下图标文件才能正常作为 PWA 使用。

## 需要的图标文件

请将以下图标文件放置在 `public/` 目录下：

1. **pwa-192x192.png** - 192x192 像素的 PNG 图标
2. **pwa-512x512.png** - 512x512 像素的 PNG 图标
3. **apple-touch-icon.png** - 180x180 像素的 PNG 图标（用于 iOS）
4. **favicon.ico** - 网站图标

## 快速生成图标

### 方法 1：使用在线工具

访问以下网站，上传一张正方形图片（建议 1024x1024），自动生成所有尺寸：

- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/
- https://favicon.io/

### 方法 2：使用命令行工具

如果你有 Node.js，可以使用 `pwa-asset-generator`：

```bash
npm install -g pwa-asset-generator

# 生成图标（替换 logo.png 为你的图片）
pwa-asset-generator logo.png public/ --icon-only
```

### 方法 3：手动创建

使用图片编辑软件（如 Photoshop、GIMP、Figma）创建以下尺寸的图标：

- 192x192 像素 → 保存为 `pwa-192x192.png`
- 512x512 像素 → 保存为 `pwa-512x512.png`
- 180x180 像素 → 保存为 `apple-touch-icon.png`

## 临时解决方案

如果暂时没有图标，可以使用纯色占位图：

1. 访问 https://via.placeholder.com/192x192/3b82f6/ffffff?text=Code
2. 右键保存为 `pwa-192x192.png`
3. 访问 https://via.placeholder.com/512x512/3b82f6/ffffff?text=Code
4. 右键保存为 `pwa-512x512.png`
5. 访问 https://via.placeholder.com/180x180/3b82f6/ffffff?text=Code
6. 右键保存为 `apple-touch-icon.png`

## 图标设计建议

- 使用简洁的设计
- 确保在小尺寸下清晰可见
- 使用高对比度的颜色
- 避免过多细节
- 建议使用圆角矩形或圆形设计

## 验证图标

部署后，可以使用以下工具验证 PWA 配置：

- Chrome DevTools → Application → Manifest
- https://www.pwabuilder.com/
- Lighthouse 审计工具

