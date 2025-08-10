import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { code: 400, msg: '用户名和密码不能为空', data: null },
        { status: 400 }
      );
    }

    // 验证用户
    const result = await authenticateUser(username, password);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { code: 401, msg: result.message, data: null },
        { status: 401 }
      );
    }

    // 设置Cookie
    const response = NextResponse.json({
      code: 200,
      msg: '登录成功',
      data: result.data
    });

    // 设置JWT Token到Cookie
    response.cookies.set('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24小时
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { code: 500, msg: '服务器内部错误', data: null },
      { status: 500 }
    );
  }
} 