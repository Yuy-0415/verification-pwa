import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import type { VerificationCode } from '../types';
import { fetchVerificationCodes, APIError } from '../services/api';
import { getWorkerURL, getDeleteURL } from '../utils/storage';
import { formatRelativeTime, formatAbsoluteTime } from '../utils/time';

export function CodesList() {
  const [codes, setCodes] = useState<VerificationCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30); // 默认30秒
  const [showCopyToast, setShowCopyToast] = useState(false);

  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // 自动刷新
  useEffect(() => {
    if (!autoRefreshEnabled || autoRefreshInterval <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      refreshCodes();
    }, autoRefreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, autoRefreshInterval, refreshCodes]);

  // 下拉刷新 - 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollTop > 0) return;

    touchStartY.current = e.touches[0].clientY;
  };

  // 下拉刷新 - 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollTop > 0 || isLoading) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStartY.current;

    if (distance > 0) {
      setPullDistance(Math.min(distance, 100));
      setIsPulling(distance > 60);
    }
  };

  // 下拉刷新 - 触摸结束
  const handleTouchEnd = () => {
    if (isPulling && !isLoading) {
      refreshCodes();
    }
    setPullDistance(0);
    setIsPulling(false);
  };

  // 复制验证码
  const copyCode = async (code: VerificationCode) => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopiedId(code.id);
      setShowCopyToast(true);
      setTimeout(() => {
        setCopiedId(null);
        setShowCopyToast(false);
      }, 2000);
    } catch {
      alert('复制失败');
    }
  };

  // 清空所有验证码
  const clearAll = async () => {
    const deleteUrl = getDeleteURL();

    if (!deleteUrl) {
      alert('请先在设置中配置删除 API URL');
      return;
    }

    if (!confirm('确定要清空所有邮件吗？此操作将调用删除 API。')) {
      return;
    }

    try {
      const response = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setCodes([]);
      alert('清空成功！');
    } catch (error) {
      console.error('清空失败:', error);
      alert('清空失败，请检查删除 API 配置');
    }
  };

  const workerURL = getWorkerURL();

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative">
      {/* 复制成功提示 */}
      {showCopyToast && (
        <div className="fixed top-20 left-0 right-0 flex justify-center z-50 px-4">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5" />
            <span className="font-medium">已复制到剪贴板</span>
          </div>
        </div>
      )}
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Cloudflare Worker 邮箱接码</h1>
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

        {/* 自动刷新控制 */}
        <div className="px-4 pb-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 py-2 mx-4 rounded-lg">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefreshEnabled}
              onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="auto-refresh" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              自动刷新
            </label>
          </div>
          {autoRefreshEnabled && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">间隔:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5秒</option>
                <option value={10}>10秒</option>
                <option value={30}>30秒</option>
                <option value={60}>1分钟</option>
                <option value={120}>2分钟</option>
                <option value={300}>5分钟</option>
              </select>
            </div>
          )}
        </div>

        {lastRefreshTime && (
          <div className="px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
            最后刷新: {formatAbsoluteTime(lastRefreshTime.getTime())}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 下拉刷新指示器 */}
        {pullDistance > 0 && (
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
            style={{
              height: `${pullDistance}px`,
              opacity: pullDistance / 100
            }}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isPulling ? 'animate-spin' : ''}`} />
              {isPulling ? '松开刷新' : '下拉刷新'}
            </div>
          </div>
        )}

        <div style={{ paddingTop: pullDistance > 0 ? `${pullDistance}px` : '0' }}>
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
                  <span
                    onClick={() => copyCode(code)}
                    className="text-2xl font-mono font-bold text-gray-900 dark:text-white cursor-pointer select-text active:scale-95 transition-transform"
                  >
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

                {/* 邮箱号 */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="inline-block w-5">�</span>
                  <span>{code.phone}</span>
                </div>

                {/* 时间 */}
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <span className="inline-block w-5">🕐</span>
                  <span>{formatRelativeTime(code.time)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

