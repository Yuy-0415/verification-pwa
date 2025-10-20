import type { VerificationCode, APIResponse, EmailData } from '../types';

/**
 * API 错误类
 */
export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * 从 Cloudflare Worker 获取验证码列表
 */
export async function fetchVerificationCodes(url: string): Promise<VerificationCode[]> {
  // 检查 URL 是否为空
  if (!url || url.trim() === '') {
    throw new APIError('请先在设置中配置 Worker URL', 'EMPTY_URL');
  }

  try {
    // 发送请求
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 设置超时（30秒）
      signal: AbortSignal.timeout(30000),
    });

    // 检查响应状态
    if (!response.ok) {
      throw new APIError(
        `服务器返回错误: HTTP ${response.status}`,
        'HTTP_ERROR'
      );
    }

    // 解析 JSON
    const data = await response.json();

    // 尝试解析不同的响应格式
    return parseVerificationCodes(data);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('网络连接失败，请检查网络设置', 'NETWORK_ERROR');
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('请求超时，请稍后重试', 'TIMEOUT');
    }

    throw new APIError(
      error instanceof Error ? error.message : '未知错误',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * 解析验证码数据，支持多种格式
 */
function parseVerificationCodes(data: unknown): VerificationCode[] {
  // 格式 1: { success: true, emails: [...] } - Worker 邮件格式
  if (isAPIResponse(data) && data.emails) {
    return convertEmailsToVerificationCodes(data.emails);
  }

  // 格式 2: { success: true, data: [...] }
  if (isAPIResponse(data) && data.data) {
    if (!data.success) {
      throw new APIError(data.message || '服务器返回失败', 'SERVER_ERROR');
    }
    return normalizeVerificationCodes(data.data);
  }

  // 格式 3: { data: [...] }
  if (isObject(data) && 'data' in data && Array.isArray(data.data)) {
    return normalizeVerificationCodes(data.data);
  }

  // 格式 4: { emails: [...] } - 直接邮件数组
  if (isObject(data) && 'emails' in data && Array.isArray(data.emails)) {
    return convertEmailsToVerificationCodes(data.emails);
  }

  // 格式 5: 直接是数组 [...]
  if (Array.isArray(data)) {
    return normalizeVerificationCodes(data);
  }

  throw new APIError('无法解析服务器返回的数据格式', 'PARSE_ERROR');
}

/**
 * 将邮件数据转换为验证码数据
 */
function convertEmailsToVerificationCodes(emails: unknown[]): VerificationCode[] {
  return emails
    .filter((email): email is EmailData => {
      return isObject(email) &&
             'hasVerificationCode' in email &&
             email.hasVerificationCode === true &&
             'verificationCode' in email &&
             typeof email.verificationCode === 'string';
    })
    .map((email) => ({
      id: email.id,
      code: email.verificationCode!,
      phone: email.to,
      time: email.receivedAt,
      source: email.from,
    }));
}

/**
 * 标准化验证码数据
 */
function normalizeVerificationCodes(codes: unknown[]): VerificationCode[] {
  return codes.map((item, index) => {
    if (!isObject(item)) {
      throw new APIError('数据格式错误', 'INVALID_DATA');
    }

    // 提取字段
    const id = 'id' in item && typeof item.id === 'string' 
      ? item.id 
      : `code-${Date.now()}-${index}`;

    const code = 'code' in item && typeof item.code === 'string'
      ? item.code
      : '';

    const phone = 'phone' in item && typeof item.phone === 'string'
      ? item.phone
      : '';

    const time = 'time' in item 
      ? item.time as string | number
      : Date.now();

    const source = 'source' in item && typeof item.source === 'string'
      ? item.source
      : undefined;

    // 验证必填字段
    if (!code || !phone) {
      throw new APIError('验证码数据缺少必填字段', 'MISSING_FIELDS');
    }

    return { id, code, phone, time, source };
  });
}

/**
 * 类型守卫：检查是否为 APIResponse
 */
function isAPIResponse(data: unknown): data is APIResponse {
  return (
    isObject(data) &&
    'success' in data &&
    typeof data.success === 'boolean' &&
    (('data' in data && Array.isArray(data.data)) ||
     ('emails' in data && Array.isArray(data.emails)))
  );
}

/**
 * 类型守卫：检查是否为对象
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * 测试 Worker URL 连接
 */
export async function testConnection(url: string): Promise<boolean> {
  try {
    await fetchVerificationCodes(url);
    return true;
  } catch {
    return false;
  }
}

