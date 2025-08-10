'use client';

import { Menu, Home, LogOut, User, Bell, Settings, Search, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Breadcrumb {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }> | null;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
  onLogout: () => void;
}

export default function Header({ sidebarOpen, setSidebarOpen, currentPath, onLogout }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 根据当前路径生成面包屑
  const generateBreadcrumbs = (path: string): Breadcrumb[] => {
    const pathSegments = path.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ name: '首页', path: '/', icon: Home }];
    
    if (pathSegments.length > 0) {
      const pathMap: { [key: string]: string } = {
        'system': '系统管理',
        'user': '用户管理',
        'role': '角色管理',
        'menu': '菜单管理',
        'dept': '部门管理',
        'post': '岗位管理',
        'monitor': '系统监控',
        'operlog': '操作日志',
        'loginlog': '登录日志',
        'online': '在线用户',
        'server': '服务监控',
        'tool': '系统工具',
        'gen': '代码生成',
        'swagger': '系统接口',
        'dict': '数据字典'
      };
      
      pathSegments.forEach((segment, index) => {
        const name = pathMap[segment] || segment;
        const fullPath = '/' + pathSegments.slice(0, index + 1).join('/');
        breadcrumbs.push({ name, path: fullPath, icon: null });
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(currentPath);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // 这里可以添加切换深色模式的逻辑
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 左侧区域 */}
        <div className="flex items-center space-x-4">
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* 面包屑导航 */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <div className="flex items-center space-x-1">
                  {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
                  <span className={cn(
                    "hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer",
                    index === breadcrumbs.length - 1 ? "text-gray-900 dark:text-white font-medium" : "text-gray-600 dark:text-gray-400"
                  )}>
                    {breadcrumb.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="flex items-center space-x-2">
          {/* 搜索框 */}
          <div className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 w-32 lg:w-48"
            />
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* 通知按钮 */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
              3
            </span>
          </button>

          {/* 设置按钮 */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">管理员</span>
            </button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">管理员</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@ruoyi.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    个人资料
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    账户设置
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    帮助中心
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端面包屑 */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} className="flex items-center flex-shrink-0">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <div className="flex items-center space-x-1">
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
                <span className={cn(
                  "hover:text-gray-900 dark:hover:text-white transition-colors",
                  index === breadcrumbs.length - 1 ? "text-gray-900 dark:text-white font-medium" : "text-gray-600 dark:text-gray-400"
                )}>
                  {breadcrumb.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
} 