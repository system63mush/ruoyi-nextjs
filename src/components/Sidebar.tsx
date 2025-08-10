'use client';
import { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  FileText, 
  Building, 
  Database,
  BookOpen,
  Activity,
  LogIn,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Menu as MenuIcon
} from 'lucide-react';

interface MenuItem {
  id: string;
  menuName: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const defaultMenus: MenuItem[] = [
  {
    id: 'dashboard',
    menuName: '仪表板',
    path: '/',
    icon: 'Home'
  },
  {
    id: 'system',
    menuName: '系统管理',
    icon: 'Settings',
    children: [
      {
        id: 'users',
        menuName: '用户管理',
        path: '/system/user',
        icon: 'Users'
      },
      {
        id: 'roles',
        menuName: '角色管理',
        path: '/system/role',
        icon: 'Shield'
      },
      {
        id: 'menus',
        menuName: '菜单管理',
        path: '/system/menu',
        icon: 'FileText'
      },
      {
        id: 'dept',
        menuName: '部门管理',
        path: '/system/dept',
        icon: 'Building'
      },
      {
        id: 'post',
        menuName: '岗位管理',
        path: '/system/post',
        icon: 'Users'
      }
    ]
  },
  {
    id: 'monitor',
    menuName: '系统监控',
    icon: 'Database',
    children: [
      {
        id: 'online',
        menuName: '在线用户',
        path: '/monitor/online',
        icon: 'Users'
      },
      {
        id: 'job',
        menuName: '定时任务',
        path: '/monitor/job',
        icon: 'Database'
      }
    ]
  },
  {
    id: 'tool',
    menuName: '系统工具',
    icon: 'Building',
    children: [
      {
        id: 'build',
        menuName: '表单构建',
        path: '/tool/build',
        icon: 'FileText'
      },
      {
        id: 'gen',
        menuName: '代码生成',
        path: '/tool/gen',
        icon: 'Database'
      }
    ]
  },
  {
    id: 'dict',
    menuName: '字典管理',
    icon: 'BookOpen',
    children: [
      {
        id: 'dictType',
        menuName: '字典类型',
        path: '/system/dict/type',
        icon: 'FileText'
      },
      {
        id: 'dictData',
        menuName: '字典数据',
        path: '/system/dict/data',
        icon: 'Database'
      }
    ]
  },
  {
    id: 'log',
    menuName: '日志管理',
    icon: 'FileText',
    children: [
      {
        id: 'operLog',
        menuName: '操作日志',
        path: '/monitor/log/oper',
        icon: 'Activity'
      },
      {
        id: 'loginLog',
        menuName: '登录日志',
        path: '/monitor/log/login',
        icon: 'LogIn'
      }
    ]
  }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentPath, onNavigate }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['dashboard']));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 根据当前路径自动展开对应的菜单
  useEffect(() => {
    const newExpandedMenus = new Set(['dashboard']);
    
    // 查找当前路径对应的父级菜单
    for (const menu of defaultMenus) {
      if (menu.children) {
        const hasActiveChild = menu.children.some(child => child.path === currentPath);
        if (hasActiveChild) {
          newExpandedMenus.add(menu.id);
        }
      }
    }
    
    setExpandedMenus(newExpandedMenus);
  }, [currentPath]);

  const toggleMenu = (menuId: string) => {
    const newExpandedMenus = new Set(expandedMenus);
    if (newExpandedMenus.has(menuId)) {
      newExpandedMenus.delete(menuId);
    } else {
      newExpandedMenus.add(menuId);
    }
    setExpandedMenus(newExpandedMenus);
  };

  const getIconComponent = (iconName?: string) => {
    const iconMap: { [key: string]: any } = {
      Home,
      Settings,
      Users,
      Shield,
      FileText,
      Building,
      Database,
      BookOpen,
      Activity,
      LogIn
    };
    return iconMap[iconName || 'Settings'] || Settings;
  };

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = getIconComponent(item.icon);
    const isActive = currentPath === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.id);

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.id)}
            className={cn(
              'flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              'text-gray-700 dark:text-gray-300 group'
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <IconComponent className="h-4 w-4" />
              </div>
              <span className="font-medium">{item.menuName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {item.children?.length}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </div>
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {item.children!.map(renderMenuItem)}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          if (item.path) {
            onNavigate(item.path);
            setSidebarOpen(false);
          }
        }}
        className={cn(
          'flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
            : 'text-gray-700 dark:text-gray-300'
        )}
      >
        <div className={cn(
          'p-1.5 rounded-md mr-3 transition-colors',
          isActive 
            ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        )}>
          <IconComponent className="h-4 w-4" />
        </div>
        <span className="font-medium">{item.menuName}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 ease-in-out',
          'shadow-xl lg:shadow-none lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-80 lg:w-64'
        )}
      >
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-lg font-bold text-white">若依管理系统</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {defaultMenus.map(renderMenuItem)}
        </nav>

        {/* 侧边栏底部 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  管理员
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  超级管理员
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
