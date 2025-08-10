import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateToken } from '@/lib/auth';

// 获取角色列表
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
    const pageNum = parseInt(searchParams.get('pageNum') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const roleName = searchParams.get('roleName') || '';
    const roleKey = searchParams.get('roleKey') || '';
    const status = searchParams.get('status') || '';

    // 构建查询条件
    const where: any = {};
    if (roleName) {
      where.roleName = { contains: roleName };
    }
    if (roleKey) {
      where.roleKey = { contains: roleKey };
    }
    if (status) {
      where.status = status;
    }
    where.delFlag = '0'; // 只查询未删除的角色

    // 查询角色总数
    const total = await prisma.role.count({ where });

    // 查询角色列表
    const roles = await prisma.role.findMany({
      where,
      select: {
        id: true,
        roleName: true,
        roleKey: true,
        roleSort: true,
        dataScope: true,
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        status: true,
        createTime: true,
        remark: true,
        _count: {
          select: {
            userRoles: true
          }
        }
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: { roleSort: 'asc' }
    });

    return NextResponse.json({
      code: 200,
      msg: '查询成功',
      data: {
        rows: roles,
        total
      }
    });
  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      { code: 500, msg: '服务器内部错误', data: null },
      { status: 500 }
    );
  }
}

// 创建角色
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
    const { roleName, roleKey, roleSort, dataScope, menuCheckStrictly, deptCheckStrictly, remark, menuIds } = body;

    // 验证输入
    if (!roleName || !roleKey) {
      return NextResponse.json(
        { code: 400, msg: '角色名称和角色标识不能为空', data: null },
        { status: 400 }
      );
    }

    // 检查角色标识是否已存在
    const existingRole = await prisma.role.findUnique({
      where: { roleKey }
    });

    if (existingRole) {
      return NextResponse.json(
        { code: 400, msg: '角色标识已存在', data: null },
        { status: 400 }
      );
    }

    // 创建角色
    const role = await prisma.role.create({
      data: {
        roleName,
        roleKey,
        roleSort: roleSort || 0,
        dataScope: dataScope || '1',
        menuCheckStrictly: menuCheckStrictly || false,
        deptCheckStrictly: deptCheckStrictly || false,
        status: '0',
        delFlag: '0',
        createBy: tokenValidation.user.username,
        remark
      }
    });

    // 分配菜单权限
    if (menuIds && menuIds.length > 0) {
      const roleMenus = menuIds.map((menuId: string) => ({
        roleId: role.id,
        menuId
      }));

      await prisma.roleMenu.createMany({
        data: roleMenus
      });
    }

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error);
    return NextResponse.json(
      { code: 500, msg: '服务器内部错误', data: null },
      { status: 500 }
    );
  }
} 