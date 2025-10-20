# 📱 Cloudflare Worker メール認証コード受信アプリ

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | **日本語** | [한국어](README.ko.md)

Cloudflare Worker メールサービスから認証コードを受信・管理するためのプログレッシブウェブアプリ（PWA）です。

## ✨ 機能

- 📬 **リアルタイム取得**：Cloudflare Worker API から認証コードを取得
- 🔄 **自動更新**：設定可能な自動更新間隔（5秒、10秒、30秒、1分、2分、5分）
- 📋 **ワンクリックコピー**：認証コードをクリックしてクリップボードにコピー
- 🗑️ **一括削除**：削除 API 経由ですべてのメールをクリア
- 🌙 **ダークモード**：自動ダークモード対応
- 📱 **PWA 対応**：ネイティブアプリとしてインストール可能、オフライン動作
- 🌐 **多言語対応**：簡体字中国語、繁体字中国語、英語、日本語、韓国語に対応
- 🎨 **モダンな UI**：Tailwind CSS による洗練された直感的なインターフェース

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. 本番ビルド

```bash
npm run build
```

### 4. 本番ビルドのプレビュー

```bash
npm run preview
```

## 📖 使用ガイド

### API の設定

1. アプリを開き、**設定**ページに移動
2. **API 設定**セクションに Cloudflare Worker API の URL を入力
3. **接続テスト**をクリックして URL を検証
4. （オプション）一括削除機能のために削除 API URL を設定

### 認証コードの受信

1. **認証コード**タブに切り替え
2. 更新ボタンをクリックするか、自動更新を有効化
3. 任意の認証コードをクリックしてクリップボードにコピー
4. プルダウンでリストを更新

### 言語設定

1. **設定** → **外観設定**に移動
2. お好みの言語を選択
3. 選択した言語がリストの一番上に移動します

## 🔧 API 仕様

Cloudflare Worker API は以下のいずれかの形式を返す必要があります：

### 形式 1：Emails 配列（推奨）

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

### 形式 2：Data オブジェクト

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

### 形式 3：直接配列

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

## 📄 Cloudflare Worker サンプル

完全なサンプルコードを参照：[cloudflare-worker-example.js](https://github.com/Yuy-0415/verification-pwa/blob/main/cloudflare-worker-example.js)

## 🛠️ 技術スタック

- **フレームワーク**：React 18 + TypeScript
- **ビルドツール**：Vite 5
- **スタイリング**：Tailwind CSS
- **PWA**：vite-plugin-pwa with Workbox
- **アイコン**：Lucide React
- **国際化**：i18next + react-i18next

## 📦 デプロイ

### Cloudflare Pages へのデプロイ

1. コードを GitHub にプッシュ
2. リポジトリを Cloudflare Pages に接続
3. ビルドコマンドを設定：`npm run build`
4. ビルド出力ディレクトリを設定：`dist`
5. デプロイ！

### Vercel へのデプロイ

1. GitHub リポジトリをインポート
2. Vercel が Vite 設定を自動検出
3. デプロイ！

### Netlify へのデプロイ

1. GitHub リポジトリを接続
2. ビルドコマンドを設定：`npm run build`
3. 公開ディレクトリを設定：`dist`
4. デプロイ！

## 🌐 ブラウザサポート

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

## 📝 よくある質問

**Q: ネイティブアプリとしてインストールするには？**
A: ブラウザでアプリを開き、アドレスバーの「インストール」ボタンをクリックするか、モバイルデバイスで「ホーム画面に追加」を使用します。

**Q: オフラインで動作しますか？**
A: はい！初回訪問後、PWA 技術によりアプリはオフラインで動作します。ただし、新しいコードの取得にはインターネット接続が必要です。

**Q: 自動更新を設定するには？**
A: 認証コードページに移動し、「自動更新」トグルを有効にして、お好みの間隔を選択します。

**Q: 独自の Cloudflare Worker を使用できますか？**
A: もちろんです！Worker API がサポートされている形式のいずれかを返すことを確認してください。

## 👨‍💻 作者

- **作者**：執
- **ブログ**：[aigcview.top](https://aigcview.top/)
- **GitHub**：[Yuy-0415/verification-pwa](https://github.com/Yuy-0415/verification-pwa)

## 📄 ライセンス

MIT License

## 🤝 貢献

貢献、問題報告、機能リクエストを歓迎します！

---

Made with ❤️ by 執

