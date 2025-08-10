import { NextRequest, NextResponse } from 'next/server';

// 模拟在线用户数据
const mockOnlineUsers = [
  {
    id: '1',
    username: 'admin',
    nickname: '超级管理员',
    deptName: '若依科技',
    loginIp: '192.168.1.100',
    loginLocation: '内网IP',
    browser: 'Chrome',
    os: 'Windows 10',
    status: 'online',
    loginTime: new Date().toISOString()
  },
  {
    id: '2',
    username: 'test',
    nickname: '测试用户',
    deptName: '测试部门',
    loginIp: '192.168.1.101',
    loginLocation: '内网IP',
    browser: 'Firefox',
    os: 'macOS',
    status: 'online',
    loginTime: new Date(Date.now() - 300000).toISOString()
  }
];

// 获取在线用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const ipaddr = searchParams.get('ipaddr');

    let filteredUsers = mockOnlineUsers;
    
    if (username) {
      filteredUsers = filteredUsers.filter(user => 
        user.username.includes(username) || user.nickname.includes(username)
      );
    }
    
    if (ipaddr) {
      filteredUsers = filteredUsers.filter(user => 
        user.loginIp.includes(ipaddr)
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      rows: filteredUsers,
      total: filteredUsers.length
    });
  } catch (error) {
    console.error('获取在线用户列表失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取在线用户列表失败' },
      { status: 500 }
    );
  }
}

// 强制下线用户
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { code: 400, msg: '用户ID不能为空' },
        { status: 400 }
      );
    }

    // 这里应该实现真正的强制下线逻辑
    // 比如清除session、token等

    return NextResponse.json({
      code: 200,
      msg: '强制下线成功'
    });
  } catch (error) {
    console.error('强制下线失败:', error);
    return NextResponse.json(
      { code: 500, msg: '强制下线失败' },
      { status: 500 }
    );
  }
}
