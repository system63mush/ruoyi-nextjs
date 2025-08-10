import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取岗位列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postCode = searchParams.get('postCode');
    const postName = searchParams.get('postName');
    const status = searchParams.get('status');

    const where: any = { delFlag: '0' };
    
    if (postCode) {
      where.postCode = { contains: postCode };
    }
    
    if (postName) {
      where.postName = { contains: postName };
    }
    
    if (status) {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { postSort: 'asc' },
    });

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      rows: posts,
      total: posts.length
    });
  } catch (error) {
    console.error('获取岗位列表失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取岗位列表失败' },
      { status: 500 }
    );
  }
}

// 创建岗位
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const post = await prisma.post.create({
      data: {
        ...body,
        id: `post-${Date.now()}`,
        delFlag: '0',
        createTime: new Date(),
        updateTime: new Date()
      }
    });

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: post
    });
  } catch (error) {
    console.error('创建岗位失败:', error);
    return NextResponse.json(
      { code: 500, msg: '创建岗位失败' },
      { status: 500 }
    );
  }
}

// 更新岗位
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        updateTime: new Date()
      }
    });

    return NextResponse.json({
      code: 200,
      msg: '更新成功',
      data: post
    });
  } catch (error) {
    console.error('更新岗位失败:', error);
    return NextResponse.json(
      { code: 500, msg: '更新岗位失败' },
      { status: 500 }
    );
  }
}

// 删除岗位
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { code: 400, msg: '岗位ID不能为空' },
        { status: 400 }
      );
    }

    // 软删除
    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({
      code: 200,
      msg: '删除成功'
    });
  } catch (error) {
    console.error('删除岗位失败:', error);
    return NextResponse.json(
      { code: 500, msg: '删除岗位失败' },
      { status: 500 }
    );
  }
}
