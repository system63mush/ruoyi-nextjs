'use client';

import { Users, Shield, Settings, Database, TrendingUp, Activity, Server, Globe, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: '用户总数',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: '较上月增长'
    },
    {
      title: '角色总数',
      value: '56',
      change: '+5%',
      changeType: 'positive',
      icon: Shield,
      color: 'green',
      description: '较上月增长'
    },
    {
      title: '菜单总数',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: Settings,
      color: 'yellow',
      description: '较上月增长'
    },
    {
      title: '在线用户',
      value: '12',
      change: '-2',
      changeType: 'negative',
      icon: Database,
      color: 'purple',
      description: '较昨日减少'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      action: '新增用户',
      description: '张三 加入了系统',
      time: '2分钟前',
      status: 'success'
    },
    {
      id: 2,
      type: 'role',
      action: '角色更新',
      description: '管理员角色权限已更新',
      time: '5分钟前',
      status: 'success'
    },
    {
      id: 3,
      type: 'system',
      action: '系统维护',
      description: '数据库备份完成',
      time: '10分钟前',
      status: 'info'
    },
    {
      id: 4,
      type: 'alert',
      action: '安全警告',
      description: '检测到异常登录尝试',
      time: '15分钟前',
      status: 'warning'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Server className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 lg:p-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">欢迎使用若依管理系统</h1>
            <p className="text-blue-100 text-base lg:text-lg">基于Next.js的现代化权限管理系统</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleTimeString('zh-CN')}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 lg:p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <div className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 技术栈信息 */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span>技术栈</span>
            </h3>
          </div>
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">前端框架：Next.js 14 + React 18</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">UI组件：Tailwind CSS + Headless UI</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">状态管理：React Hooks + Context</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">数据库：PostgreSQL + Prisma</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">认证：JWT + NextAuth.js</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">部署：Vercel + Docker</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span>最近活动</span>
            </h3>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`p-3 rounded-lg border ${getStatusColor(activity.status)}`}>
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <span>快速操作</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors group">
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">用户管理</p>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg border border-green-200 dark:border-green-800 transition-colors group">
            <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 dark:text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-green-700 dark:text-green-300">角色管理</p>
          </button>
          <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg border border-yellow-200 dark:border-yellow-800 transition-colors group">
            <Settings className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">系统设置</p>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors group">
            <Database className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">数据监控</p>
          </button>
        </div>
      </div>
    </div>
  );
} 