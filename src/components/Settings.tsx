import { useState, useEffect } from 'react';
import { Check, X, Loader2, Moon, Sun } from 'lucide-react';
import { getWorkerURL, setWorkerURL, getDeleteURL, setDeleteURL, getDarkMode, setDarkMode } from '../utils/storage';
import { testConnection } from '../services/api';

interface SettingsProps {
  onDarkModeChange: (enabled: boolean) => void;
}

export function Settings({ onDarkModeChange }: SettingsProps) {
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
      alert('请先输入 Worker URL');
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
      alert('请先输入删除 API URL');
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

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">设置</h1>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Worker URL 配置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            API 配置
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Worker URL
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
                请输入 Cloudflare Worker 的完整 URL 地址
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
                  <span>测试中...</span>
                </>
              ) : (
                <span>测试连接</span>
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
                    <span className="text-sm">连接成功！URL 配置正确</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="text-sm">连接失败，请检查 URL 是否正确</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 删除 API 配置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            删除 API 配置
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                删除邮件 API URL
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
                用于清空所有邮件的 API 地址（可选）
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
                  <span>测试中...</span>
                </>
              ) : (
                <span>测试连接</span>
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
                    <span className="text-sm">连接成功！URL 配置正确</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="text-sm">连接失败，请检查 URL 是否正确</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 外观设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            外观
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-gray-900 dark:text-white">深色模式</span>
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
        </div>

        {/* 使用说明 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            使用说明
          </h2>
          
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <p>在上方输入框中填入你的 Cloudflare Worker API 地址</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <p>点击「测试连接」按钮验证 URL 是否可用</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <p>切换到「验证码」标签页，点击刷新按钮获取最新数据</p>
            </div>
          </div>
        </div>

        {/* API 格式说明 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            API 格式要求
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Worker API 应返回以下格式之一：
          </p>
          
          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200 font-mono">
{`{
  "success": true,
  "data": [
    {
      "code": "123456",
      "phone": "+86138****1234",
      "time": "2025-10-20T10:30:00Z"
    }
  ]
}`}
          </pre>
        </div>

        {/* 关于 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            关于
          </h2>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>版本</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>类型</span>
              <span className="text-gray-900 dark:text-white">PWA 应用</span>
            </div>
            <div className="flex justify-between">
              <span>作者</span>
              <span className="text-gray-900 dark:text-white">执</span>
            </div>
            <div className="flex justify-between items-center">
              <span>博客</span>
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

