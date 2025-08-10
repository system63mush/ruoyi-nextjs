import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建超级管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      nickname: '超级管理员',
      email: 'admin@ruoyi.com',
      status: '0',
      createBy: 'system',
      remark: '系统超级管理员'
    },
  });

  console.log('创建超级管理员用户:', adminUser.username);

  // 创建管理员角色
  const adminRole = await prisma.role.upsert({
    where: { roleKey: 'admin' },
    update: {},
    create: {
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      dataScope: '1',
      menuCheckStrictly: false,
      deptCheckStrictly: false,
      status: '0',
      delFlag: '0',
      createBy: 'system',
      remark: '超级管理员角色'
    },
  });

  console.log('创建管理员角色:', adminRole.roleName);

  // 关联用户和角色
  await prisma.userRole.upsert({
    where: { 
      userId_roleId: { 
        userId: adminUser.id, 
        roleId: adminRole.id 
      } 
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('关联用户和角色成功');

  // 创建基础菜单
  const menus = [
    {
      id: 'dashboard',
      menuName: '仪表板',
      parentId: '0',
      orderNum: 1,
      path: '/',
      component: 'Dashboard',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'dashboard:view',
      icon: 'Settings',
      createBy: 'system'
    },
    {
      id: 'system',
      menuName: '系统管理',
      parentId: '0',
      orderNum: 2,
      path: '/system',
      component: 'Layout',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: 'system:view',
      icon: 'Settings',
      createBy: 'system'
    },
    {
      id: 'system-user',
      menuName: '用户管理',
      parentId: 'system',
      orderNum: 1,
      path: '/system/user',
      component: 'system/user/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:user:list',
      icon: 'Users',
      createBy: 'system'
    },
    {
      id: 'system-role',
      menuName: '角色管理',
      parentId: 'system',
      orderNum: 2,
      path: '/system/role',
      component: 'system/role/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:role:list',
      icon: 'Shield',
      createBy: 'system'
    },
    {
      id: 'system-menu',
      menuName: '菜单管理',
      parentId: 'system',
      orderNum: 3,
      path: '/system/menu',
      component: 'system/menu/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:menu:list',
      icon: 'FileText',
      createBy: 'system'
    },
    {
      id: 'system-dept',
      menuName: '部门管理',
      parentId: 'system',
      orderNum: 4,
      path: '/system/dept',
      component: 'system/dept/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:dept:list',
      icon: 'Building',
      createBy: 'system'
    },
    {
      id: 'system-post',
      menuName: '岗位管理',
      parentId: 'system',
      orderNum: 5,
      path: '/system/post',
      component: 'system/post/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:post:list',
      icon: 'Database',
      createBy: 'system'
    },
    {
      id: 'monitor',
      menuName: '系统监控',
      parentId: '0',
      orderNum: 3,
      path: '/monitor',
      component: 'Layout',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: 'monitor:view',
      icon: 'Database',
      createBy: 'system'
    },
    {
      id: 'tool',
      menuName: '系统工具',
      parentId: '0',
      orderNum: 4,
      path: '/tool',
      component: 'Layout',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: 'tool:view',
      icon: 'Building',
      createBy: 'system'
    }
  ];

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { id: menu.id },
      update: {},
      create: menu,
    });
  }

  console.log('创建基础菜单成功');

  // 关联角色和菜单
  for (const menu of menus) {
    await prisma.roleMenu.upsert({
      where: { 
        roleId_menuId: { 
          roleId: adminRole.id, 
          menuId: menu.id 
        } 
      },
      update: {},
      create: {
        roleId: adminRole.id,
        menuId: menu.id,
      },
    });
  }

  console.log('关联角色和菜单成功');

  // 创建基础部门
  const dept = await prisma.dept.upsert({
    where: { id: 'dept-001' },
    update: {},
    create: {
      id: 'dept-001',
      parentId: '0',
      ancestors: '0',
      deptName: '若依科技',
      orderNum: 1,
      leader: '若依',
      phone: '15888888888',
      email: 'ry@qq.com',
      status: '0',
      delFlag: '0',
      createBy: 'system'
    },
  });

  console.log('创建基础部门:', dept.deptName);

  // 创建基础岗位
  const post = await prisma.post.upsert({
    where: { postCode: 'ceo' },
    update: {},
    create: {
      postCode: 'ceo',
      postName: '董事长',
      postSort: 1,
      status: '0',
      createBy: 'system',
      remark: '董事长岗位'
    },
  });

  console.log('创建基础岗位:', post.postName);

  // 关联用户和岗位
  await prisma.userPost.upsert({
    where: { 
      userId_postId: { 
        userId: adminUser.id, 
        postId: post.id 
      } 
    },
    update: {},
    create: {
      userId: adminUser.id,
      postId: post.id,
    },
  });

  console.log('关联用户和岗位成功');

  // 创建字典类型
  const dictType = await prisma.dictType.upsert({
    where: { dictType: 'sys_normal_disable' },
    update: {},
    create: {
      dictName: '系统开关',
      dictType: 'sys_normal_disable',
      status: '0',
      createBy: 'system',
      remark: '系统开关列表'
    },
  });

  console.log('创建字典类型:', dictType.dictName);

  // 创建字典数据
  const dictData = [
    {
      dictSort: 1,
      dictLabel: '正常',
      dictValue: '0',
      dictType: 'sys_normal_disable',
      cssClass: 'primary',
      listClass: 'success',
      isDefault: 'Y',
      status: '0',
      createBy: 'system'
    },
    {
      dictSort: 2,
      dictLabel: '停用',
      dictValue: '1',
      dictType: 'sys_normal_disable',
      cssClass: 'info',
      listClass: 'danger',
      isDefault: 'N',
      status: '0',
      createBy: 'system'
    }
  ];

  for (const data of dictData) {
    await prisma.dictData.upsert({
      where: { 
        dictType_dictValue: { 
          dictType: data.dictType, 
          dictValue: data.dictValue 
        } 
      },
      update: {},
      create: data,
    });
  }

  console.log('创建字典数据成功');

  console.log('数据库初始化完成！');
  console.log('默认登录信息:');
  console.log('用户名: admin');
  console.log('密码: admin123');
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 