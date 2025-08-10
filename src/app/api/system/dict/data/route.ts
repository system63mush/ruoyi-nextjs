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
    if (!user.valid || !user.user) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const dictData = await prisma.dictData.findMany({
      orderBy: { dictSort: 'asc' }
    });

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: dictData
    });
  } catch (error) {
    console.error('获取字典数据失败:', error);
    return NextResponse.json(
      { error: '获取字典数据失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const user = await validateToken(token);
    if (!user.valid || !user.user) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const body = await request.json();
    const { dictLabel, dictValue, dictSort, status, dictType, remark } = body;

    if (!dictLabel || !dictValue || !dictType) {
      return NextResponse.json(
        { error: '字典标签、值和类型不能为空' },
        { status: 400 }
      );
    }

    // 检查字典值是否已存在
    const existingDictData = await prisma.dictData.findFirst({
      where: { 
        dictValue,
        dictType
      }
    });

    if (existingDictData) {
      return NextResponse.json(
        { error: '字典值已存在' },
        { status: 400 }
      );
    }

    const newDictData = await prisma.dictData.create({
      data: {
        id: `dict-data-${Date.now()}`,
        dictLabel,
        dictValue,
        dictSort: dictSort || 0,
        status: status || '0',
        dictType,
        remark: remark || '',
        createBy: user.user.username,
        createTime: new Date(),
        updateBy: user.user.username,
        updateTime: new Date()
      }
    });

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: newDictData
    });
  } catch (error) {
    console.error('创建字典数据失败:', error);
    return NextResponse.json(
      { error: '创建字典数据失败' },
      { status: 500 }
    );
  }
}
