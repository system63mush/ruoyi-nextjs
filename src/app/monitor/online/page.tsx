'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import { Search, User, Monitor, Clock, MapPin, Globe, Smartphone, LogOut, Eye, AlertTriangle } from 'lucide-react';

interface OnlineUser {
  id: string;
  sessionId: string;
  username: string;
  nickname: string;
  deptName: string;
  loginIp: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: string;
  loginTime: string;
  lastAccessTime: string;
  expireTime: string;
}

export default function Page() {
  const [users, setUsers] = useState<OnlineUser[]>([
    {
      id: '1',
      sessionId: 'session_001',
      username: 'admin',
      nickname: '管理员',
      deptName: '研发部门',
      loginIp: '192.168.1.100',
      loginLocation: '广东省深圳市',
      browser: 'Chrome 120.0',
      os: 'Windows 11',
      status: 'online',
      loginTime: '2024-01-01 10:00:00',
      lastAccessTime: '2024-01-01 15:30:00',
      expireTime: '2024-01-01 18:00:00'
    },
    {
      id: '2',
      sessionId: 'session_002',
      username: 'zhangsan',
      nickname: '张三',
      deptName: '测试部门',
      loginIp: '192.168.1.101',
      loginLocation: '北京市朝阳区',
      browser: 'Firefox 121.0',
      os: 'macOS 14.0',
      status: 'online',
      loginTime: '2024-01-01 09:30:00',
      lastAccessTime: '2024-01-01 15:25:00',
      expireTime: '2024-01-01 17:30:00'
    },
    {
      id: '3',
      sessionId: 'session_003',
      username: 'lisi',
      nickname: '李四',
      deptName: '产品部门',
      loginIp: '192.168.1.102',
      loginLocation: '上海市浦东新区',
      browser: 'Safari 17.0',
      os: 'iOS 17.0',
      status: 'idle',
      loginTime: '2024-01-01 08:00:00',
      lastAccessTime: '2024-01-01 12:00:00',
      expireTime: '2024-01-01 16:00:00'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);

  const handleForceLogout = (sessionId: string) => {
    if (confirm('确定要强制该用户下线吗？')) {
      setUsers(users.filter(user => user.sessionId !== sessionId));
      alert('用户已被强制下线');
    }
  };

  const handleViewDetail = (user: OnlineUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.loginIp.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    if (status === 'online') {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">在线</span>;
    } else if (status === 'idle') {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">空闲</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">离线</span>;
    }
  };

  const getBrowserIcon = (browser: string) => {
    if (browser.includes('Chrome')) {
      return <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">C</div>;
    } else if (browser.includes('Firefox')) {
      return <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs">F</div>;
    } else if (browser.includes('Safari')) {
      return <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">S</div>;
    } else {
      return <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-xs">?</div>;
    }
  };

  const getOSIcon = (os: string) => {
    if (os.includes('Windows')) {
      return <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">W</div>;
    } else if (os.includes('macOS')) {
      return <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs">M</div>;
    } else if (os.includes('iOS')) {
      return <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">i</div>;
    } else {
      return <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-xs">?</div>;
    }
  };

  return (
    <Layout>
      <PageContent 
        title="在线用户"
        description="查看当前在线用户，包括用户信息、登录时间、最后活跃时间等。"
      >
        <div className="space-y-6">
          {/* 搜索和操作区域 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索用户名、昵称、部门或IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                批量下线
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                全部下线
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">在线用户</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(user => user.status === 'online').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">空闲用户</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(user => user.status === 'idle').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Monitor className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">总会话数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">今日登录</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      用户信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      部门
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      登录信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      客户端
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      时间信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {user.nickname.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.nickname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.deptName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            {user.loginIp}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {user.loginLocation}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getBrowserIcon(user.browser)}
                          {getOSIcon(user.os)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {user.browser}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            登录: {user.loginTime}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            最后: {user.lastAccessTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetail(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleForceLogout(user.sessionId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="强制下线"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 用户详情模态框 */}
          {showDetailModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    用户详情 - {selectedUser.nickname}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        用户名
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {selectedUser.username}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        昵称
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.nickname}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        部门
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.deptName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        会话ID
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white font-mono">
                        {selectedUser.sessionId}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      登录IP
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                      {selectedUser.loginIp}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      登录地点
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.loginLocation}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        浏览器
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.browser}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        操作系统
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.os}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        登录时间
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.loginTime}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        最后活跃
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.lastAccessTime}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      过期时间
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.expireTime}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleForceLogout(selectedUser.sessionId);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    强制下线
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContent>
    </Layout>
  );
}
