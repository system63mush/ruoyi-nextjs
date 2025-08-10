import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        posts: {
          include: {
            post: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { code: 404, message: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ code: 200, data: user, message: 'success' });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      { code: 500, message: '获取用户详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        nickname: body.nickname,
        email: body.email,
        phone: body.phone,
        status: body.status,
        updateBy: body.updateBy || 'system'
      }
    });

    return NextResponse.json({ code: 200, data: user, message: '更新成功' });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json(
      { code: 500, message: '更新用户失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 软删除，更新状态
    const user = await prisma.user.update({
      where: { id },
      data: { status: '1' }
    });

    return NextResponse.json({ code: 200, data: user, message: '删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { code: 500, message: '删除用户失败' },
      { status: 500 }
    );
  }
}
