import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateToken } from '@/lib/auth';
import { buildTree } from '@/lib/utils';

// 获取菜单列表
export async function GET(request: NextRequest) {
  try {
    // 验证Token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { code: 401, msg: '未授权访问', data: null },
        { status: 401 }
      );
    }

    const tokenValidation = await validateToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json(
        { code: 401, msg: 'Token无效', data: null },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const menuName = searchParams.get('menuName') || '';
    const status = searchParams.get('status') || '';

    // 构建查询条件
    const where: any = {};
    if (menuName) {
      where.menuName = { contains: menuName };
    }
    if (status) {
      where.status = status;
    }

    // 查询所有菜单
    const menus = await prisma.menu.findMany({
      where,
      orderBy: { orderNum: 'asc' }
    });

    // 构建树形结构
    const menuTree = buildTree(menus);

    return NextResponse.json({
      code: 200,
      msg: '查询成功',
      data: menuTree
    });
  } catch (error) {
    console.error('Get menus error:', error);
    return NextResponse.json(
      { code: 500, msg: '服务器内部错误', data: null },
      { status: 500 }
    );
  }
}

// 创建菜单
export async function POST(request: NextRequest) {
  try {
    // 验证Token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { code: 401, msg: '未授权访问', data: null },
        { status: 401 }
      );
    }

    const tokenValidation = await validateToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json(
        { code: 401, msg: 'Token无效', data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuName, parentId, orderNum, path, component, query, isFrame, isCache, menuType, visible, perms, icon, remark } = body;

    // 验证输入
    if (!menuName) {
      return NextResponse.json(
        { code: 400, msg: '菜单名称不能为空', data: null },
        { status: 400 }
      );
    }

    // 创建菜单
    const menu = await prisma.menu.create({
      data: {
        menuName,
        parentId: parentId || '0',
        orderNum: orderNum || 0,
        path,
        component,
        query,
        isFrame: isFrame || '1',
        isCache: isCache || '0',
        menuType: menuType || 'M',
        visible: visible || '0',
        status: '0',
        perms,
        icon,
        createBy: tokenValidation.user.username,
        remark
      }
    });

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: menu
    });
  } catch (error) {
    console.error('Create menu error:', error);
    return NextResponse.json(
      { code: 500, msg: '服务器内部错误', data: null },
      { status: 500 }
    );
  }
} 