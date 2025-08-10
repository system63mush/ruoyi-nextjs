import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || '0';
    
    const where: Record<string, unknown> = { parentId };
    
    const depts = await prisma.dept.findMany({
      where,
      orderBy: { orderNum: 'asc' }
    });

    return NextResponse.json({ code: 200, data: depts, message: 'success' });
  } catch (error) {
    console.error('获取部门列表失败:', error);
    return NextResponse.json(
      { code: 500, message: '获取部门列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const dept = await prisma.dept.create({
      data: {
        deptName: body.deptName,
        parentId: body.parentId || '0',
        orderNum: body.orderNum || 0,
        leader: body.leader,
        phone: body.phone,
        email: body.email,
        status: body.status || '0'
      }
    });

    return NextResponse.json({ code: 200, data: dept, message: '创建成功' });
  } catch (error) {
    console.error('创建部门失败:', error);
    return NextResponse.json(
      { code: 500, message: '创建部门失败' },
      { status: 500 }
    );
  }
}

// 更新部门
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const dept = await prisma.dept.update({
      where: { id },
      data: {
        ...updateData,
        updateTime: new Date()
      }
    });

    return NextResponse.json({
      code: 200,
      msg: '更新成功',
      data: dept
    });
  } catch (error) {
    console.error('更新部门失败:', error);
    return NextResponse.json(
      { code: 200, msg: '更新部门失败' },
      { status: 500 }
    );
  }
}

// 删除部门
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { code: 400, msg: '部门ID不能为空' },
        { status: 400 }
      );
    }

    // 检查是否有子部门
    const children = await prisma.dept.findMany({
      where: { parentId: id, delFlag: '0' }
    });

    if (children.length > 0) {
      return NextResponse.json(
        { code: 400, msg: '存在子部门,不允许删除' },
        { status: 400 }
      );
    }

    // 软删除
    await prisma.dept.update({
      where: { id },
      data: { delFlag: '1' }
    });

    return NextResponse.json({
      code: 200,
      msg: '删除成功'
    });
  } catch (error) {
    console.error('删除部门失败:', error);
    return NextResponse.json(
      { code: 500, msg: '删除部门失败' },
      { status: 500 }
    );
  }
}
