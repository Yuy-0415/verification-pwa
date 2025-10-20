import { useState, useEffect } from 'react';
import { Check, X, Loader2, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getWorkerURL, setWorkerURL, getDeleteURL, setDeleteURL, getDarkMode, setDarkMode } from '../utils/storage';
import { testConnection } from '../services/api';

interface SettingsProps {
  onDarkModeChange: (enabled: boolean) => void;
}

export function Settings({ onDarkModeChange }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [url, setUrl] = useState('');
  const [deleteUrl, setDeleteUrlState] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingDelete, setIsTestingDelete] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [deleteTestResult, setDeleteTestResult] = useState<'success' | 'error' | null>(null);
  const [darkMode, setDarkModeState] = useState(false);

  // 加载配置
  useEffect(() => {
    setUrl(getWorkerURL());
    setDeleteUrlState(getDeleteURL());
    setDarkModeState(getDarkMode());
  }, []);

  // 保存 URL
  const handleSaveURL = () => {
    setWorkerURL(url);
    setTestResult(null);
  };

  // 保存删除 URL
  const handleSaveDeleteURL = () => {
    setDeleteURL(deleteUrl);
    setDeleteTestResult(null);
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!url.trim()) {
      alert(t('errors.pleaseConfigureFirst'));
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const success = await testConnection(url);
    setTestResult(success ? 'success' : 'error');
    setIsTesting(false);

    if (success) {
      setWorkerURL(url);
    }
  };

  // 测试删除 API 连接
  const handleTestDeleteConnection = async () => {
    if (!deleteUrl.trim()) {
      alert(t('errors.pleaseConfigureFirst'));
      return;
    }

    setIsTestingDelete(true);
    setDeleteTestResult(null);

    const success = await testConnection(deleteUrl);
    setDeleteTestResult(success ? 'success' : 'error');
    setIsTestingDelete(false);

    if (success) {
      setDeleteURL(deleteUrl);
    }
  };

  // 切换深色模式
  const handleToggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkModeState(newValue);
    setDarkMode(newValue);
    onDarkModeChange(newValue);
  };

  // 语言列表（固定排序）
  const languages = [
    { code: 'zh-CN', name: '中文简体', nativeName: '中文简体' },
    { code: 'zh-TW', name: '中文繁體', nativeName: '中文繁體' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: '日本語', nativeName: '日本語' },
    { code: 'ko', name: '한국어', nativeName: '한국어' },
  ];

  // 切换语言
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('nav.settings')}</h1>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 接码 API 配置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.apiConfig.title')}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.apiConfig.label')}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleSaveURL}
                placeholder="https://your-worker.workers.dev/api/codes"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('settings.apiConfig.description')}
              </p>
            </div>

            {/* 测试连接按钮 */}
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !url.trim()}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('settings.apiConfig.testing')}</span>
                </>
              ) : (
                <span>{t('settings.apiConfig.testConnection')}</span>
              )}
            </button>

            {/* 测试结果 */}
            {testResult && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  testResult === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                {testResult === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{t('settings.apiConfig.testSuccess')}</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="text-sm">{t('settings.apiConfig.testFailed')}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 删除 API 配置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.deleteApi.title')}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.deleteApi.label')}
              </label>
              <input
                type="url"
                value={deleteUrl}
                onChange={(e) => setDeleteUrlState(e.target.value)}
                onBlur={handleSaveDeleteURL}
                placeholder="https://your-worker.workers.dev/api/delete"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('settings.deleteApi.description')}
              </p>
            </div>

            {/* 测试连接按钮 */}
            <button
              onClick={handleTestDeleteConnection}
              disabled={isTestingDelete || !deleteUrl.trim()}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isTestingDelete ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('settings.apiConfig.testing')}</span>
                </>
              ) : (
                <span>{t('settings.apiConfig.testConnection')}</span>
              )}
            </button>

            {/* 测试结果 */}
            {deleteTestResult && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  deleteTestResult === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                {deleteTestResult === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{t('settings.apiConfig.testSuccess')}</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="text-sm">{t('settings.apiConfig.testFailed')}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 外观设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.appearance.title')}
          </h2>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-gray-900 dark:text-white">{t('settings.appearance.darkMode')}</span>
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 语言选择 */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white">{t('settings.appearance.language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.usage.title')}
          </h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <p>{t('settings.usage.step1')}</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <p>{t('settings.usage.step2')}</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <p>{t('settings.usage.step3')}</p>
            </div>
          </div>
        </div>

        {/* API 格式说明 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('settings.apiFormat.title')}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('settings.apiFormat.description')}
          </p>

          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200 font-mono mb-3">
{`{
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
}`}
          </pre>

          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              📄 <strong>{t('settings.apiFormat.exampleCode')}</strong>
            </p>
            <a
              href="https://github.com/Yuy-0415/verification-pwa/blob/main/cloudflare-worker-example.js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline break-all"
            >
              {t('settings.apiFormat.viewExample')} →
            </a>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('about.title')}
          </h2>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>{t('about.version')}</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>{t('about.type')}</span>
              <span className="text-gray-900 dark:text-white">{t('about.pwaApp')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('about.author')}</span>
              <span className="text-gray-900 dark:text-white">执</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('about.blog')}</span>
              <a
                href="https://aigcview.top/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                aigcview.top
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

