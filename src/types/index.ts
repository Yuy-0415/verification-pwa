/**
 * 验证码数据类型
 */
export interface VerificationCode {
  /** 唯一标识符 */
  id: string;
  /** 验证码内容 */
  code: string;
  /** 手机号（可能是脱敏的） */
  phone: string;
  /** 接收时间（ISO 8601 格式或时间戳） */
  time: string | number;
  /** 来源信息（可选） */
  source?: string;
}

/**
 * API 响应格式 1：带状态包装
 */
export interface APIResponse {
  success: boolean;
  data: VerificationCode[];
  message?: string;
}

/**
 * 应用配置
 */
export interface AppConfig {
  /** Cloudflare Worker URL */
  workerURL: string;
  /** 是否启用深色模式 */
  darkMode: boolean;
  /** 自动刷新间隔（秒，0 表示禁用） */
  autoRefreshInterval: number;
}

/**
 * 页面类型
 */
export type PageType = 'codes' | 'settings';

/**
 * 错误类型
 */
export interface AppError {
  message: string;
  code?: string;
}

