import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import type { VerificationCode } from '../types';
import { fetchVerificationCodes, APIError } from '../services/api';
import { getWorkerURL } from '../utils/storage';
import { formatRelativeTime, formatAbsoluteTime } from '../utils/time';

export function CodesList() {
  const [codes, setCodes] = useState<VerificationCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // 刷新验证码列表
  const refreshCodes = useCallback(async () => {
    const workerURL = getWorkerURL();
    
    if (!workerURL) {
      setError('请先在设置中配置 Worker URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedCodes = await fetchVerificationCodes(workerURL);
      // 按时间倒序排列
      const sortedCodes = fetchedCodes.sort((a, b) => {
        const timeA = typeof a.time === 'number' ? a.time : new Date(a.time).getTime();
        const timeB = typeof b.time === 'number' ? b.time : new Date(b.time).getTime();
        return timeB - timeA;
      });
      setCodes(sortedCodes);
      setLastRefreshTime(new Date());
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('未知错误');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    refreshCodes();
  }, [refreshCodes]);

  // 复制验证码
  const copyCode = async (code: VerificationCode) => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopiedId(code.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('复制失败');
    }
  };

  // 删除验证码
  const deleteCode = (id: string) => {
    setCodes(codes.filter(c => c.id !== id));
  };

  // 清空所有验证码
  const clearAll = () => {
    if (confirm('确定要清空所有验证码吗？')) {
      setCodes([]);
    }
  };

  const workerURL = getWorkerURL();

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">验证码</h1>
          <div className="flex gap-2">
            <button
              onClick={refreshCodes}
              disabled={isLoading}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="刷新"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {codes.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="清空所有"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {lastRefreshTime && (
          <div className="px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
            最后刷新: {formatAbsoluteTime(lastRefreshTime.getTime())}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 错误提示 */}
        {error && (
          <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* 未配置 URL */}
        {!workerURL && !error && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              未配置 Worker URL
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              请先在设置中配置 Cloudflare Worker 的 URL 地址
            </p>
          </div>
        )}

        {/* 空数据 */}
        {workerURL && codes.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              暂无验证码
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              点击右上角刷新按钮获取最新验证码
            </p>
          </div>
        )}

        {/* 验证码列表 */}
        {codes.length > 0 && (
          <div className="p-4 space-y-3">
            {codes.map((code) => (
              <div
                key={code.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
              >
                {/* 验证码和复制按钮 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {code.code}
                  </span>
                  <button
                    onClick={() => copyCode(code)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {copiedId === code.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* 手机号 */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>📱</span>
                  <span>{code.phone}</span>
                </div>

                {/* 时间和来源 */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>🕐 {formatRelativeTime(code.time)}</span>
                    {code.source && <span>🏷️ {code.source}</span>}
                  </div>
                  <button
                    onClick={() => deleteCode(code.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

