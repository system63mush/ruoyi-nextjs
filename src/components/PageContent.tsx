'use client';

import { usePathname } from 'next/navigation';

interface PageContentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageContent({ children, title, description }: PageContentProps) {
  const pathname = usePathname();
  
  // 根据路径获取页面标题
  const getPageTitle = (path: string): string => {
    const pathMap: { [key: string]: string } = {
      '/system/user': '用户管理',
      '/system/role': '角色管理',
      '/system/menu': '菜单管理',
      '/system/dept': '部门管理',
      '/system/post': '岗位管理',
      '/monitor/online': '在线用户',
      '/monitor/job': '定时任务',
      '/tool/build': '表单构建',
      '/tool/gen': '代码生成',
      '/system/dict/type': '字典类型',
      '/system/dict/data': '字典数据',
      '/monitor/log/oper': '操作日志',
      '/monitor/log/login': '登录日志'
    };
    
    return title || pathMap[path] || '页面开发中';
  };

  const pageTitle = getPageTitle(pathname);
  const pageDescription = description || '该页面正在开发中，敬请期待...';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>
        
        {children ? (
          children
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {pageDescription}
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 提示：这是一个基于Next.js的现代化管理系统，支持响应式设计和深色模式。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 