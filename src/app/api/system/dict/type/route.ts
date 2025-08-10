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

    const dictTypes = await prisma.dictType.findMany({
      orderBy: { createTime: 'desc' }
    });

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: dictTypes
    });
  } catch (error) {
    console.error('获取字典类型失败:', error);
    return NextResponse.json(
      { error: '获取字典类型失败' },
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
    const { dictName, dictType, status, remark } = body;

    if (!dictName || !dictType) {
      return NextResponse.json(
        { error: '字典名称和类型不能为空' },
        { status: 400 }
      );
    }

    // 检查字典类型是否已存在
    const existingDictType = await prisma.dictType.findFirst({
      where: { 
        dictType
      }
    });

    if (existingDictType) {
      return NextResponse.json(
        { error: '字典类型已存在' },
        { status: 400 }
      );
    }

    const newDictType = await prisma.dictType.create({
      data: {
        id: `dict-${Date.now()}`,
        dictName,
        dictType,
        status: status || '0',
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
      data: newDictType
    });
  } catch (error) {
    console.error('创建字典类型失败:', error);
    return NextResponse.json(
      { error: '创建字典类型失败' },
      { status: 500 }
    );
  }
}
