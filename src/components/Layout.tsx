'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const router = useRouter();
  const pathname = usePathname();

  // 监听路由变化，更新当前路径
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    router.push(path);
  };

  const handleLogout = () => {
    // 清除登录状态
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  // 在移动端点击遮罩层时关闭侧边栏
  const handleBackdropClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex">
        {/* 侧边栏 */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPath={currentPath}
          onNavigate={navigateTo}
        />

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 头部 */}
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            currentPath={currentPath}
            onLogout={handleLogout}
          />

          {/* 页面内容 */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}
    </div>
  );
} 