import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const user = await validateToken(token);
    if (!user) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const operLogs = await prisma.operLog.findMany({
      orderBy: { operTime: 'desc' }
    });

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: operLogs
    });
  } catch (error) {
    console.error('获取操作日志失败:', error);
    return NextResponse.json(
      { error: '获取操作日志失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const user = await validateToken(token);
    if (!user) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    // 清空所有操作日志
    await prisma.operLog.deleteMany({});

    return NextResponse.json({
      code: 200,
      message: '清空成功'
    });
  } catch (error) {
    console.error('清空操作日志失败:', error);
    return NextResponse.json(
      { error: '清空操作日志失败' },
      { status: 500 }
    );
  }
}
