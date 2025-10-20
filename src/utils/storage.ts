import type { AppConfig } from '../types';

/**
 * LocalStorage 工具函数
 */

const STORAGE_KEYS = {
  WORKER_URL: 'workerURL',
  DARK_MODE: 'darkMode',
  AUTO_REFRESH: 'autoRefreshInterval',
} as const;

/**
 * 获取 Worker URL
 */
export function getWorkerURL(): string {
  return localStorage.getItem(STORAGE_KEYS.WORKER_URL) || '';
}

/**
 * 保存 Worker URL
 */
export function setWorkerURL(url: string): void {
  localStorage.setItem(STORAGE_KEYS.WORKER_URL, url);
}

/**
 * 获取深色模式设置
 */
export function getDarkMode(): boolean {
  const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (stored === null) {
    // 默认跟随系统
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return stored === 'true';
}

/**
 * 保存深色模式设置
 */
export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(enabled));
}

/**
 * 获取自动刷新间隔
 */
export function getAutoRefreshInterval(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTO_REFRESH);
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * 保存自动刷新间隔
 */
export function setAutoRefreshInterval(seconds: number): void {
  localStorage.setItem(STORAGE_KEYS.AUTO_REFRESH, String(seconds));
}

/**
 * 获取完整配置
 */
export function getAppConfig(): AppConfig {
  return {
    workerURL: getWorkerURL(),
    darkMode: getDarkMode(),
    autoRefreshInterval: getAutoRefreshInterval(),
  };
}

/**
 * 保存完整配置
 */
export function setAppConfig(config: Partial<AppConfig>): void {
  if (config.workerURL !== undefined) {
    setWorkerURL(config.workerURL);
  }
  if (config.darkMode !== undefined) {
    setDarkMode(config.darkMode);
  }
  if (config.autoRefreshInterval !== undefined) {
    setAutoRefreshInterval(config.autoRefreshInterval);
  }
}

