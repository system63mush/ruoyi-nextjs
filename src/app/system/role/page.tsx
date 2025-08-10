'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import DataTable, { Column } from '@/components/DataTable';
import Modal from '@/components/Modal';
import Form, { FormField } from '@/components/Form';
import { Plus, Search, Shield, Users, Key, Trash2, Edit, Eye } from 'lucide-react';

// 模拟角色数据
const mockRoles = [
  {
    id: '1',
    roleName: '超级管理员',
    roleKey: 'SUPER_ADMIN',
    roleSort: 1,
    status: 'active',
    description: '系统超级管理员，拥有所有权限',
    createTime: '2024-01-01 10:00:00',
    userCount: 1,
    permissions: ['all']
  },
  {
    id: '2',
    roleName: '系统管理员',
    roleKey: 'SYSTEM_ADMIN',
    roleSort: 2,
    status: 'active',
    description: '系统管理员，管理系统配置和用户',
    createTime: '2024-01-02 09:00:00',
    userCount: 3,
    permissions: ['user:manage', 'role:manage', 'dept:manage']
  },
  {
    id: '3',
    roleName: '普通用户',
    roleKey: 'USER',
    roleSort: 3,
    status: 'active',
    description: '普通用户，基础功能权限',
    createTime: '2024-01-03 11:00:00',
    userCount: 15,
    permissions: ['user:view', 'dept:view']
  },
  {
    id: '4',
    roleName: '访客',
    roleKey: 'GUEST',
    roleSort: 4,
    status: 'inactive',
    description: '访客用户，只读权限',
    createTime: '2024-01-04 14:00:00',
    userCount: 0,
    permissions: ['readonly']
  }
];

export default function RolePage() {
  const [roles, setRoles] = useState(mockRoles);
  const [filteredRoles, setFilteredRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 搜索和筛选
  useEffect(() => {
    let filtered = roles;
    
    if (searchTerm) {
      filtered = filtered.filter(role => 
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.roleKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(role => role.status === statusFilter);
    }
    
    setFilteredRoles(filtered);
    setCurrentPage(1);
  }, [roles, searchTerm, statusFilter]);

  // 分页数据
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 表格列定义
  const columns: Column[] = [
    {
      key: 'roleName',
      label: '角色名称',
      sortable: true
    },
    {
      key: 'roleKey',
      label: '角色标识',
      sortable: true
    },
    {
      key: 'roleSort',
      label: '排序',
      sortable: true
    },
    {
      key: 'status',
      label: '状态',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {value === 'active' ? '启用' : '禁用'}
        </span>
      )
    },
    {
      key: 'description',
      label: '描述',
      render: (value) => (
        <span className="max-w-xs truncate" title={String(value)}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'userCount',
      label: '用户数量',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs">
          {String(value)} 人
        </span>
      )
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
      name: 'roleName',
      label: '角色名称',
      type: 'text',
      placeholder: '请输入角色名称',
      required: true,
      validation: (value) => {
        if (value.length < 2) return '角色名称至少2个字符';
        return null;
      }
    },
    {
      name: 'roleKey',
      label: '角色标识',
      type: 'text',
      placeholder: '请输入角色标识',
      required: true,
      validation: (value) => {
        if (!/^[A-Z_]+$/.test(value)) return '角色标识只能包含大写字母和下划线';
        return null;
      }
    },
    {
      name: 'roleSort',
      label: '排序',
      type: 'number',
      placeholder: '请输入排序号',
      required: true,
      defaultValue: 1
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: '启用' },
        { value: 'inactive', label: '禁用' }
      ]
    },
    {
      name: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入角色描述'
    }
  ];

  // 处理新增/编辑角色
  const handleSubmit = (data: any) => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      if (editingRole) {
        // 编辑角色
        setRoles(prev => prev.map(role => 
          role.id === editingRole.id ? { ...role, ...data } : role
        ));
      } else {
        // 新增角色
        const newRole = {
          ...data,
          id: Date.now().toString(),
          createTime: new Date().toLocaleString(),
          userCount: 0,
          permissions: []
        };
        setRoles(prev => [newRole, ...prev]);
      }
      
      setLoading(false);
      setIsModalOpen(false);
      setEditingRole(null);
    }, 1000);
  };

  // 处理编辑角色
  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  // 处理删除角色
  const handleDelete = (role: any) => {
    if (role.userCount > 0) {
      alert(`角色 "${role.roleName}" 下还有 ${role.userCount} 个用户，无法删除`);
      return;
    }
    
    if (confirm(`确定要删除角色 "${role.roleName}" 吗？`)) {
      setRoles(prev => prev.filter(r => r.id !== role.id));
    }
  };

  // 处理查看权限
  const handleViewPermissions = (role: any) => {
    alert(`角色 "${role.roleName}" 的权限：\n${role.permissions.join('\n')}`);
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <Layout>
      <PageContent 
        title="角色管理"
        description="管理系统角色权限，包括角色创建、编辑、删除和权限分配等功能。"
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
                    placeholder="搜索角色名称、标识、描述..."
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
                    <option value="active">启用</option>
                    <option value="inactive">禁用</option>
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
                    setEditingRole(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>新增角色</span>
                </button>
                
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>权限配置</span>
                </button>
              </div>
            </div>
          </div>

          {/* 角色列表 */}
          <DataTable
            columns={columns}
            data={filteredRoles}
            loading={loading}
            pageSize={pageSize}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleViewPermissions}
          />
        </div>

        {/* 新增/编辑角色模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRole(null);
          }}
          title={editingRole ? '编辑角色' : '新增角色'}
          size="lg"
        >
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            submitText={editingRole ? '保存' : '新增'}
            loading={loading}
            initialData={editingRole}
          />
        </Modal>
      </PageContent>
    </Layout>
  );
}
