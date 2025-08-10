'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import DataTable, { Column } from '@/components/DataTable';
import Modal from '@/components/Modal';
import Form, { FormField } from '@/components/Form';
import { Plus, Search, RefreshCw } from 'lucide-react';

interface MenuItem {
  id: string;
  menuName: string;
  parentId: string;
  orderNum: number;
  path?: string;
  component?: string;
  query?: string;
  isFrame: string;
  isCache: string;
  menuType: string;
  visible: string;
  status: string;
  perms?: string;
  icon?: string;
  createBy?: string;
  createTime: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
  children?: MenuItem[];
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [menuTypeFilter, setMenuTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // 获取菜单列表
  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('menuName', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/system/menu?${params.toString()}`);
      const result = await response.json();
      
      if (result.code === 200) {
        setMenus(result.data || []);
        setFilteredMenus(result.data || []);
      } else {
        console.error('获取菜单失败:', result.msg);
      }
    } catch (error) {
      console.error('获取菜单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // 初始加载
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // 搜索和筛选
  useEffect(() => {
    let filtered = menus;
    
    if (searchTerm) {
      filtered = filtered.filter(menu => 
        menu.menuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (menu.path && menu.path.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (menu.perms && menu.perms.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(menu => menu.status === statusFilter);
    }
    
    if (menuTypeFilter !== 'all') {
      filtered = filtered.filter(menu => menu.menuType === menuTypeFilter);
    }
    
    setFilteredMenus(filtered);
    setCurrentPage(1);
  }, [menus, searchTerm, statusFilter, menuTypeFilter]);

  // 分页数据
  const paginatedMenus = filteredMenus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取菜单类型标签
  const getMenuTypeLabel = (type: string) => {
    switch (type) {
      case 'M': return { label: '目录', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'C': return { label: '菜单', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case 'F': return { label: '按钮', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' };
      default: return { label: '未知', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case '0': return { label: '正常', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case '1': return { label: '停用', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
      default: return { label: '未知', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
  };

  // 获取显示状态标签
  const getVisibleLabel = (visible: string) => {
    switch (visible) {
      case '0': return { label: '显示', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
      case '1': return { label: '隐藏', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
      default: return { label: '未知', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }
  };

  // 计算菜单层级
  const calculateLevel = (menu: MenuItem, allMenus: MenuItem[]): number => {
    if (menu.parentId === '0') return 1;
    const parent = allMenus.find(m => m.id === menu.parentId);
    return parent ? calculateLevel(parent, allMenus) + 1 : 1;
  };

  // 表格列定义
  const columns: Column[] = [
    {
      key: 'menuName',
      label: '菜单名称',
      sortable: true
    },
    {
      key: 'orderNum',
      label: '排序',
      sortable: true
    },
    {
      key: 'path',
      label: '路由地址'
    },
    {
      key: 'component',
      label: '组件路径'
    },
    {
      key: 'menuType',
      label: '菜单类型'
    },
    {
      key: 'visible',
      label: '显示状态'
    },
    {
      key: 'status',
      label: '状态'
    },
    {
      key: 'perms',
      label: '权限标识'
    },
    {
      key: 'createTime',
      label: '创建时间',
      sortable: true
    }
  ];

  // 表单字段定义
  const formFields: FormField[] = [
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'text',
      placeholder: '请输入菜单名称',
      required: true,
      validation: (value) => {
        if (!value || value.length < 2) return '菜单名称至少2个字符';
        return null;
      }
    },
    {
      name: 'parentId',
      label: '上级菜单',
      type: 'select',
      required: true,
      options: [
        { value: '0', label: '顶级菜单' },
        ...menus.filter(m => m.menuType === 'M').map(menu => ({ 
          value: menu.id, 
          label: menu.menuName 
        }))
      ]
    },
    {
      name: 'orderNum',
      label: '排序',
      type: 'number',
      placeholder: '请输入排序号',
      required: true,
      defaultValue: 1
    },
    {
      name: 'path',
      label: '路由地址',
      type: 'text',
      placeholder: '请输入路由地址'
    },
    {
      name: 'component',
      label: '组件路径',
      type: 'text',
      placeholder: '请输入组件路径'
    },
    {
      name: 'menuType',
      label: '菜单类型',
      type: 'select',
      required: true,
      options: [
        { value: 'M', label: '目录' },
        { value: 'C', label: '菜单' },
        { value: 'F', label: '按钮' }
      ]
    },
    {
      name: 'visible',
      label: '显示状态',
      type: 'select',
      required: true,
      options: [
        { value: '0', label: '显示' },
        { value: '1', label: '隐藏' }
      ]
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { value: '0', label: '正常' },
        { value: '1', label: '停用' }
      ]
    },
    {
      name: 'perms',
      label: '权限标识',
      type: 'text',
      placeholder: '请输入权限标识'
    },
    {
      name: 'icon',
      label: '图标',
      type: 'text',
      placeholder: '请输入图标名称'
    },
    {
      name: 'isFrame',
      label: '是否外链',
      type: 'select',
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ]
    },
    {
      name: 'isCache',
      label: '是否缓存',
      type: 'select',
      options: [
        { value: '0', label: '缓存' },
        { value: '1', label: '不缓存' }
      ]
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注信息'
    }
  ];

  // 处理新增/编辑菜单
  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      
      const url = editingMenu ? `/api/system/menu/${editingMenu.id}` : '/api/system/menu';
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        // 刷新菜单列表
        await fetchMenus();
        setIsModalOpen(false);
        setEditingMenu(null);
      } else {
        alert(`操作失败: ${result.msg}`);
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑菜单
  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  // 处理删除菜单
  const handleDelete = async (menu: MenuItem) => {
    // 检查是否有子菜单
    const hasChildren = menus.some(m => m.parentId === menu.id);
    if (hasChildren) {
      alert(`菜单 "${menu.menuName}" 下还有子菜单，无法删除`);
      return;
    }
    
    if (confirm(`确定要删除菜单 "${menu.menuName}" 吗？`)) {
      try {
        setLoading(true);
        const response = await fetch(`/api/system/menu/${menu.id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
          await fetchMenus();
        } else {
          alert(`删除失败: ${result.msg}`);
        }
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  // 处理查看菜单详情
  const handleViewMenu = (menu: MenuItem) => {
    const typeInfo = getMenuTypeLabel(menu.menuType);
    const statusInfo = getStatusLabel(menu.status);
    const visibleInfo = getVisibleLabel(menu.visible);
    
    alert(`菜单详情：
名称：${menu.menuName}
类型：${typeInfo.label}
状态：${statusInfo.label}
显示：${visibleInfo.label}
权限：${menu.perms || '无'}
路由：${menu.path || '无'}
组件：${menu.component || '无'}
排序：${menu.orderNum}
创建时间：${new Date(menu.createTime).toLocaleString()}`);
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMenuTypeFilter('all');
  };

  return (
    <Layout>
      <PageContent 
        title="菜单管理"
        description="管理系统菜单结构，包括菜单创建、编辑、删除和权限配置等功能。"
      >
        <div className="space-y-6">
          {/* 搜索和操作区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* 搜索区域 */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索菜单名称、路径、权限..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                
                {/* 筛选器 */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部状态</option>
                    <option value="0">正常</option>
                    <option value="1">停用</option>
                  </select>
                  
                  <select
                    value={menuTypeFilter}
                    onChange={(e) => setMenuTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部类型</option>
                    <option value="M">目录</option>
                    <option value="C">菜单</option>
                    <option value="F">按钮</option>
                  </select>
                  
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    重置
                  </button>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setEditingMenu(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>新增菜单</span>
                </button>
                
                <button
                  onClick={fetchMenus}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>刷新</span>
                </button>
              </div>
            </div>
          </div>

          {/* 菜单列表 */}
          <DataTable
            columns={columns}
            data={paginatedMenus as unknown as Record<string, unknown>[]}
            loading={loading}
            pageSize={pageSize}
            onEdit={(row) => handleEdit(row as unknown as MenuItem)}
            onDelete={(row) => handleDelete(row as unknown as MenuItem)}
            onView={(row) => handleViewMenu(row as unknown as MenuItem)}
          />
        </div>

        {/* 新增/编辑菜单模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMenu(null);
          }}
          title={editingMenu ? '编辑菜单' : '新增菜单'}
          size="lg"
        >
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            submitText={editingMenu ? '保存' : '新增'}
            loading={loading}
            initialData={editingMenu as unknown as Record<string, unknown>}
          />
        </Modal>
      </PageContent>
    </Layout>
  );
}
