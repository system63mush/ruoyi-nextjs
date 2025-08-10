import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 生成JWT Token
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// 验证JWT Token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 用户登录
export async function authenticateUser(username: string, password: string) {
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: '密码错误' };
    }

    // 检查用户状态
    if (user.status !== '0') {
      return { success: false, message: '用户已被停用' };
    }

    // 获取用户角色和权限
    const roles = user.userRoles.map(ur => ur.role.roleKey);
    const permissions = await getUserPermissions(user.id);

    // 生成Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      roles,
      permissions
    });

    // 更新登录信息
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginDate: new Date(),
        loginIp: '127.0.0.1' // 实际应用中应该获取真实IP
      }
    });

    // 记录登录日志
    await prisma.loginLog.create({
      data: {
        userName: user.username,
        ipaddr: '127.0.0.1',
        status: '0',
        msg: '登录成功'
      }
    });

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          status: user.status
        },
        roles,
        permissions
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: '登录失败，请稍后重试' };
  }
}

// 获取用户权限
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            roleMenus: {
              include: {
                menu: true
              }
            }
          }
        }
      }
    });

    const permissions = new Set<string>();
    
    for (const userRole of userRoles) {
      if (userRole.role.status === '0' && userRole.role.delFlag === '0') {
        for (const roleMenu of userRole.role.roleMenus) {
          if (roleMenu.menu.status === '0' && roleMenu.menu.visible === '0') {
            if (roleMenu.menu.perms) {
              permissions.add(roleMenu.menu.perms);
            }
          }
        }
      }
    }

    return Array.from(permissions);
  } catch (error) {
    console.error('Get user permissions error:', error);
    return [];
  }
}

// 获取用户菜单
export async function getUserMenus(userId: string): Promise<any[]> {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            roleMenus: {
              include: {
                menu: true
              }
            }
          }
        }
      }
    });

    const menuIds = new Set<string>();
    
    for (const userRole of userRoles) {
      if (userRole.role.status === '0' && userRole.role.delFlag === '0') {
        for (const roleMenu of userRole.role.roleMenus) {
          if (roleMenu.menu.status === '0' && roleMenu.menu.visible === '0') {
            menuIds.add(roleMenu.menu.id);
          }
        }
      }
    }

    if (menuIds.size === 0) {
      return [];
    }

    const menus = await prisma.menu.findMany({
      where: {
        id: { in: Array.from(menuIds) },
        status: '0',
        visible: '0'
      },
      orderBy: { orderNum: 'asc' }
    });

    return menus as any[];
  } catch (error) {
    console.error('Get user menus error:', error);
    return [];
  }
}

// 验证权限
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

// 验证角色
export function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

// 中间件：验证Token
export async function validateToken(token: string) {
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return { valid: false, message: 'Token无效' };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, status: true }
    });

    if (!user || user.status !== '0') {
      return { valid: false, message: '用户不存在或已被停用' };
    }

    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, message: 'Token验证失败' };
  }
} 