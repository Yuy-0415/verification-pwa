/**
 * Cloudflare Worker 邮箱接码示例
 * 
 * 功能：
 * 1. 接收邮件并提取验证码
 * 2. 提供 API 获取验证码列表
 * 3. 提供 API 删除所有邮件
 * 
 * 部署方式：
 * 1. 在 Cloudflare Dashboard 创建 Worker
 * 2. 复制此代码到 Worker 编辑器
 * 3. 配置邮件路由（Email Routing）
 * 4. 部署并获取 Worker URL
 */

// 存储邮件数据（使用 KV 或 D1 数据库会更好）
let emails = [];

/**
 * 从邮件内容中提取验证码
 * 支持常见的验证码格式
 */
function extractVerificationCode(content) {
  // 常见验证码格式
  const patterns = [
    /验证码[：:]\s*(\d{4,8})/,
    /verification code[：:]\s*(\d{4,8})/i,
    /code[：:]\s*(\d{4,8})/i,
    /(\d{4,8})\s*是您的验证码/,
    /您的验证码是\s*(\d{4,8})/,
    /(\d{4,8})/  // 最后尝试匹配任意4-8位数字
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * 处理邮件接收
 */
async function handleEmail(message) {
  const email = {
    id: crypto.randomUUID(),
    from: message.from,
    to: message.to,
    subject: message.headers.get('subject') || '',
    content: await message.text(),
    receivedAt: Date.now(),
    hasVerificationCode: false,
    verificationCode: null
  };

  // 提取验证码
  const code = extractVerificationCode(email.content);
  if (code) {
    email.hasVerificationCode = true;
    email.verificationCode = code;
  }

  // 存储邮件（实际应用中应使用 KV 或 D1）
  emails.push(email);

  // 只保留最近 100 封邮件
  if (emails.length > 100) {
    emails = emails.slice(-100);
  }
}

/**
 * 处理 HTTP 请求
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API: 获取验证码列表
    if (url.pathname === '/api/codes' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        emails: emails.filter(e => e.hasVerificationCode)
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // API: 删除所有邮件
    if (url.pathname === '/api/delete' && request.method === 'POST') {
      emails = [];
      return new Response(JSON.stringify({
        success: true,
        message: '已清空所有邮件'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 默认响应
    return new Response(JSON.stringify({
      success: false,
      message: 'API 路径不存在'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  },

  /**
   * 邮件处理器
   */
  async email(message, env, ctx) {
    await handleEmail(message);
  }
};

