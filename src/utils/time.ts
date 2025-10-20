/**
 * 时间格式化工具函数
 */

/**
 * 将时间字符串或时间戳转换为 Date 对象
 */
export function parseTime(time: string | number): Date {
  if (typeof time === 'number') {
    // 时间戳（秒或毫秒）
    return new Date(time > 10000000000 ? time : time * 1000);
  }

  // ISO 8601 字符串
  const date = new Date(time);
  return isNaN(date.getTime()) ? new Date() : date;
}

/**
 * 格式化为相对时间（例如：2分钟前）
 */
export function formatRelativeTime(time: string | number): string {
  const date = parseTime(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return '刚刚';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}个月前`;
  }

  const years = Math.floor(months / 12);
  return `${years}年前`;
}

/**
 * 格式化为绝对时间（例如：10-20 14:30:00）
 */
export function formatAbsoluteTime(time: string | number): string {
  const date = parseTime(time);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化为完整时间（例如：2025-10-20 14:30:00）
 */
export function formatFullTime(time: string | number): string {
  const date = parseTime(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

