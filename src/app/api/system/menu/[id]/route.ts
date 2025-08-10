import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const menu = await prisma.menu.findUnique({
      where: { id }
    });

    if (!menu) {
      return NextResponse.json(
        { code: 404, message: '菜单不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ code: 200, data: menu, message: 'success' });
  } catch (error) {
    console.error('获取菜单详情失败:', error);
    return NextResponse.json(
      { code: 500, message: '获取菜单详情失败' },
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
    
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        menuName: body.menuName,
        parentId: body.parentId,
        orderNum: body.orderNum,
        path: body.path,
        component: body.component,
        menuType: body.menuType,
        visible: body.visible,
        status: body.status,
        perms: body.perms,
        icon: body.icon,
        updateBy: body.updateBy || 'system'
      }
    });

    return NextResponse.json({ code: 200, data: menu, message: '更新成功' });
  } catch (error) {
    console.error('更新菜单失败:', error);
    return NextResponse.json(
      { code: 500, message: '更新菜单失败' },
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
    
    // 检查是否有子菜单
    const childMenus = await prisma.menu.findMany({
      where: { parentId: id }
    });

    if (childMenus.length > 0) {
      return NextResponse.json(
        { code: 400, message: '存在子菜单，无法删除' },
        { status: 400 }
      );
    }

    // 删除菜单
    await prisma.menu.delete({
      where: { id }
    });

    return NextResponse.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error('删除菜单失败:', error);
    return NextResponse.json(
      { code: 500, message: '删除菜单失败' },
      { status: 500 }
    );
  }
} 