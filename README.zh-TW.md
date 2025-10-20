# 📱 Cloudflare Worker 郵箱接碼

[简体中文](README.md) | **繁體中文** | [English](README.en.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

一個用於接收和管理 Cloudflare Worker 郵件服務驗證碼的漸進式 Web 應用（PWA）。

## ✨ 功能特性

- 📬 **即時獲取驗證碼**：從 Cloudflare Worker API 獲取驗證碼
- 🔄 **自動重新整理**：可配置自動重新整理間隔（5秒、10秒、30秒、1分鐘、2分鐘、5分鐘）
- 📋 **一鍵複製**：點擊驗證碼即可複製到剪貼簿
- 🗑️ **批次刪除**：透過刪除 API 清空所有郵件
- 🌙 **深色模式**：自動支援深色模式
- 📱 **PWA 支援**：可安裝為原生應用，支援離線使用
- 🌐 **多語言支援**：支援簡體中文、繁體中文、英語、日語、韓語
- 🎨 **現代化介面**：使用 Tailwind CSS 打造簡潔直觀的介面

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

### 3. 建置生產版本

```bash
npm run build
```

### 4. 預覽生產版本

```bash
npm run preview
```

## 📖 使用指南

### 配置 API

1. 開啟應用並進入**設定**頁面
2. 在 **API 配置**區域輸入您的 Cloudflare Worker API 網址
3. 點擊**測試連線**驗證網址是否正確
4. （可選）配置刪除 API 網址以使用批次刪除功能

### 接收驗證碼

1. 切換到**驗證碼**分頁
2. 點擊重新整理按鈕或啟用自動重新整理
3. 點擊任意驗證碼即可複製到剪貼簿
4. 下拉可重新整理列表

### 語言設定

1. 進入**設定** → **外觀設定**
2. 選擇您偏好的語言
3. 選中的語言會自動移至列表頂部

## 🔧 API 規格說明

您的 Cloudflare Worker API 應返回以下格式之一：

### 格式 1：Emails 陣列（推薦）

```json
{
  "success": true,
  "emails": [
    {
      "id": "uuid-1",
      "verificationCode": "123456",
      "to": "user@example.com",
      "receivedAt": 1729411200000,
      "hasVerificationCode": true
    }
  ]
}
```

### 格式 2：Data 物件

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "code": "123456",
      "email": "user@example.com",
      "time": 1729411200000
    }
  ]
}
```

### 格式 3：直接陣列

```json
[
  {
    "id": "uuid-1",
    "code": "123456",
    "email": "user@example.com",
    "time": "2024-10-20T10:00:00Z"
  }
]
```

## 📄 Cloudflare Worker 範例

查看完整範例程式碼：[cloudflare-worker-example.js](https://github.com/Yuy-0415/verification-pwa/blob/main/cloudflare-worker-example.js)

## 🛠️ 技術棧

- **框架**：React 18 + TypeScript
- **建置工具**：Vite 5
- **樣式**：Tailwind CSS
- **PWA**：vite-plugin-pwa with Workbox
- **圖示**：Lucide React
- **國際化**：i18next + react-i18next

## 📦 部署

### 部署到 Cloudflare Pages

1. 將程式碼推送到 GitHub
2. 將儲存庫連接到 Cloudflare Pages
3. 設定建置命令：`npm run build`
4. 設定建置輸出目錄：`dist`
5. 部署！

### 部署到 Vercel

1. 匯入您的 GitHub 儲存庫
2. Vercel 會自動偵測 Vite 配置
3. 部署！

### 部署到 Netlify

1. 連接您的 GitHub 儲存庫
2. 設定建置命令：`npm run build`
3. 設定發布目錄：`dist`
4. 部署！

## 🌐 瀏覽器支援

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

## 📝 常見問題

**問：如何安裝為原生應用？**
答：在瀏覽器中開啟應用，點擊網址列中的「安裝」按鈕，或在行動裝置上使用「加入主畫面」功能。

**問：是否支援離線使用？**
答：是的！首次訪問後，應用可以離線使用。但獲取新驗證碼需要網路連線。

**問：如何配置自動重新整理？**
答：進入驗證碼頁面，啟用「自動重新整理」開關，並選擇您偏好的間隔時間。

**問：可以使用自己的 Cloudflare Worker 嗎？**
答：當然可以！只需確保您的 Worker API 返回支援的格式之一即可。

## 👨‍💻 作者

- **作者**：執
- **部落格**：[aigcview.top](https://aigcview.top/)
- **GitHub**：[Yuy-0415/verification-pwa](https://github.com/Yuy-0415/verification-pwa)

## 📄 授權

MIT License

## 🤝 貢獻

歡迎貢獻、問題回報和功能請求！

---

Made with ❤️ by 執

