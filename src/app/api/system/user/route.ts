import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateToken } from '@/lib/auth';

// GET /api/system/user - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 验证Token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ code: 401, msg: '未授权访问' }, { status: 401 });
    }

    const tokenValidation = await validateToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json({ code: 401, msg: tokenValidation.message }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const pageNum = parseInt(searchParams.get('pageNum') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const username = searchParams.get('username') || '';
    const status = searchParams.get('status') || '';

    // 构建查询条件
    const where: any = {};
    if (username) {
      where.username = { contains: username };
    }
    if (status !== '') {
      where.status = status;
    }

    // 查询用户总数
    const total = await prisma.user.count({ where });

    // 查询用户列表
    const users = await prisma.user.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: { createTime: 'desc' },
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

    return NextResponse.json({
      code: 200,
      msg: '查询成功',
      data: {
        rows: users,
        total,
        pageNum,
        pageSize
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ code: 500, msg: '服务器内部错误' }, { status: 500 });
  }
}

// POST /api/system/user - 创建用户
export async function POST(request: NextRequest) {
  try {
    // 验证Token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ code: 401, msg: '未授权访问' }, { status: 401 });
    }

    const tokenValidation = await validateToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json({ code: 401, msg: tokenValidation.message }, { status: 401 });
    }

    const body = await request.json();
    const { username, password, nickname, email, phone, roleIds, postIds } = body;

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json({ code: 400, msg: '用户名和密码不能为空' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ code: 400, msg: '用户名已存在' }, { status: 400 });
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: password, // 注意：实际应用中应该加密密码
        nickname,
        email,
        phone,
        status: '0',
        createBy: tokenValidation.user.username
      }
    });

    // 分配角色
    if (roleIds && roleIds.length > 0) {
      const userRoles = roleIds.map((roleId: string) => ({
        userId: user.id,
        roleId
      }));

      await prisma.userRole.createMany({
        data: userRoles
      });
    }

    // 分配岗位
    if (postIds && postIds.length > 0) {
      const userPosts = postIds.map((postId: string) => ({
        userId: user.id,
        postId
      }));

      await prisma.userPost.createMany({
        data: userPosts
      });
    }

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ code: 500, msg: '服务器内部错误' }, { status: 500 });
  }
}
