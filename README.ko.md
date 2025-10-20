# 📱 Cloudflare Worker 이메일 인증 코드 수신 앱

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md) | **한국어**

Cloudflare Worker 이메일 서비스에서 인증 코드를 수신하고 관리하는 프로그레시브 웹 앱(PWA)입니다.

## ✨ 기능

- 📬 **실시간 코드 가져오기**：Cloudflare Worker API에서 인증 코드 가져오기
- 🔄 **자동 새로고침**：설정 가능한 자동 새로고침 간격(5초, 10초, 30초, 1분, 2분, 5분)
- 📋 **원클릭 복사**：인증 코드를 클릭하여 클립보드에 복사
- 🗑️ **일괄 삭제**：삭제 API를 통해 모든 이메일 지우기
- 🌙 **다크 모드**：자동 다크 모드 지원
- 📱 **PWA 지원**：네이티브 앱으로 설치 가능, 오프라인 작동
- 🌐 **다국어 지원**：중국어 간체, 중국어 번체, 영어, 일본어, 한국어 지원
- 🎨 **모던 UI**：Tailwind CSS로 제작된 깔끔하고 직관적인 인터페이스

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 시작

```bash
npm run dev
```

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 프로덕션 빌드 미리보기

```bash
npm run preview
```

## 📖 사용 가이드

### API 구성

1. 앱을 열고 **설정** 페이지로 이동
2. **API 구성** 섹션에 Cloudflare Worker API URL 입력
3. **연결 테스트**를 클릭하여 URL 확인
4. (선택사항) 일괄 삭제 기능을 위한 삭제 API URL 구성

### 인증 코드 수신

1. **인증 코드** 탭으로 전환
2. 새로고침 버튼을 클릭하거나 자동 새로고침 활성화
3. 인증 코드를 클릭하여 클립보드에 복사
4. 아래로 당겨서 목록 새로고침

### 언어 설정

1. **설정** → **외관 설정**으로 이동
2. 원하는 언어 선택
3. 선택한 언어가 목록 맨 위로 이동합니다

## 🔧 API 사양

Cloudflare Worker API는 다음 형식 중 하나를 반환해야 합니다:

### 형식 1: Emails 배열 (권장)

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

### 형식 2: Data 객체

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

### 형식 3: 직접 배열

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

## 📄 Cloudflare Worker 예제

전체 예제 코드 보기: [cloudflare-worker-example.js](https://github.com/Yuy-0415/verification-pwa/blob/main/cloudflare-worker-example.js)

## 🛠️ 기술 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS
- **PWA**: vite-plugin-pwa with Workbox
- **아이콘**: Lucide React
- **국제화**: i18next + react-i18next

## 📦 배포

### Cloudflare Pages에 배포

1. 코드를 GitHub에 푸시
2. 저장소를 Cloudflare Pages에 연결
3. 빌드 명령 설정: `npm run build`
4. 빌드 출력 디렉토리 설정: `dist`
5. 배포!

### Vercel에 배포

1. GitHub 저장소 가져오기
2. Vercel이 Vite 구성을 자동 감지
3. 배포!

### Netlify에 배포

1. GitHub 저장소 연결
2. 빌드 명령 설정: `npm run build`
3. 게시 디렉토리 설정: `dist`
4. 배포!

## 🌐 브라우저 지원

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

## 📝 자주 묻는 질문

**Q: 네이티브 앱으로 설치하는 방법은?**
A: 브라우저에서 앱을 열고 주소 표시줄의 "설치" 버튼을 클릭하거나 모바일 기기에서 "홈 화면에 추가"를 사용하세요.

**Q: 오프라인에서 작동하나요?**
A: 네! 첫 방문 후 PWA 기술 덕분에 앱은 오프라인에서 작동합니다. 그러나 새 코드를 가져오려면 인터넷 연결이 필요합니다.

**Q: 자동 새로고침을 구성하는 방법은?**
A: 인증 코드 페이지로 이동하여 "자동 새로고침" 토글을 활성화하고 원하는 간격을 선택하세요.

**Q: 자체 Cloudflare Worker를 사용할 수 있나요?**
A: 물론입니다! Worker API가 지원되는 형식 중 하나를 반환하는지 확인하세요.

## 👨‍💻 작성자

- **작성자**: 執
- **블로그**: [aigcview.top](https://aigcview.top/)
- **GitHub**: [Yuy-0415/verification-pwa](https://github.com/Yuy-0415/verification-pwa)

## 📄 라이선스

MIT License

## 🤝 기여

기여, 이슈 및 기능 요청을 환영합니다!

---

Made with ❤️ by 執

