/**
 * 验证码数据类型
 */
export interface VerificationCode {
  /** 唯一标识符 */
  id: string;
  /** 验证码内容 */
  code: string;
  /** 邮箱地址 */
  email: string;
  /** 接收时间（ISO 8601 格式或时间戳） */
  time: string | number;
  /** 来源信息（可选） */
  source?: string;
}

/**
 * 邮件数据类型（Worker 返回格式）
 */
export interface EmailData {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  verificationCode?: string;
  receivedAt: number;
  hasVerificationCode: boolean;
}

/**
 * API 响应格式 1：带状态包装
 */
export interface APIResponse {
  success: boolean;
  data?: VerificationCode[];
  emails?: EmailData[];
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

