# 📱 Cloudflare Worker Email Verification Code Receiver

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | **English** | [日本語](README.ja.md) | [한국어](README.ko.md)

A Progressive Web App (PWA) for receiving and managing verification codes from Cloudflare Worker email service.

## ✨ Features

- 📬 **Real-time Code Retrieval**: Fetch verification codes from Cloudflare Worker API
- 🔄 **Auto-refresh**: Configurable auto-refresh intervals (5s, 10s, 30s, 1m, 2m, 5m)
- 📋 **One-click Copy**: Click verification code to copy to clipboard
- 🗑️ **Batch Delete**: Clear all emails via delete API
- 🌙 **Dark Mode**: Automatic dark mode support
- 📱 **PWA Support**: Install as native app, works offline
- 🌐 **Multi-language**: Supports Simplified Chinese, Traditional Chinese, English, Japanese, Korean
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Configure API

1. Open the app and navigate to **Settings**
2. Enter your Cloudflare Worker API URL in the **API Configuration** section
3. Click **Test Connection** to verify the URL
4. (Optional) Configure Delete API URL for batch delete functionality

### Receive Verification Codes

1. Switch to **Codes** tab
2. Click the refresh button or enable auto-refresh
3. Click on any verification code to copy it to clipboard
4. Pull down to refresh the list

### Language Settings

1. Go to **Settings** → **Appearance**
2. Select your preferred language
3. The selected language will be moved to the top of the list

## 🔧 API Specification

Your Cloudflare Worker API should return one of the following formats:

### Format 1: Emails Array (Recommended)

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

### Format 2: Data Object

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

### Format 3: Direct Array

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

## 📄 Cloudflare Worker Example

See the complete example code: [cloudflare-worker-example.js](https://github.com/Yuy-0415/verification-pwa/blob/main/cloudflare-worker-example.js)

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **PWA**: vite-plugin-pwa with Workbox
- **Icons**: Lucide React
- **i18n**: i18next + react-i18next

## 📦 Deployment

### Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Deploy!

### Deploy to Vercel

1. Import your GitHub repository
2. Vercel will auto-detect Vite configuration
3. Deploy!

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 🌐 Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

## 📝 FAQ

**Q: How to install as a native app?**
A: Open the app in your browser, click the "Install" button in the address bar, or use "Add to Home Screen" on mobile devices.

**Q: Does it work offline?**
A: Yes! After the first visit, the app can work offline thanks to PWA technology. However, fetching new codes requires an internet connection.

**Q: How to configure auto-refresh?**
A: Go to the Codes page, enable the "Auto-refresh" toggle, and select your preferred interval.

**Q: Can I use my own Cloudflare Worker?**
A: Absolutely! Just make sure your Worker API returns data in one of the supported formats.

## 👨‍💻 Author

- **Author**: 执
- **Blog**: [aigcview.top](https://aigcview.top/)
- **GitHub**: [Yuy-0415/verification-pwa](https://github.com/Yuy-0415/verification-pwa)

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ by 执

