import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

// 从 localStorage 获取保存的语言，如果没有则使用浏览器语言
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language;

// 语言映射
const languageMap: Record<string, string> = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-TW',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'ja': 'ja',
  'ja-JP': 'ja',
  'ko': 'ko',
  'ko-KR': 'ko',
};

// 确定默认语言
const getDefaultLanguage = (): string => {
  if (savedLanguage && languageMap[savedLanguage]) {
    return languageMap[savedLanguage];
  }
  
  if (languageMap[browserLanguage]) {
    return languageMap[browserLanguage];
  }
  
  // 尝试匹配语言前缀（如 zh-CN -> zh）
  const languagePrefix = browserLanguage.split('-')[0];
  if (languageMap[languagePrefix]) {
    return languageMap[languagePrefix];
  }
  
  // 默认使用简体中文
  return 'zh-CN';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      'en': { translation: en },
      'ja': { translation: ja },
      'ko': { translation: ko },
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

