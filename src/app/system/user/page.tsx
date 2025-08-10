'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import DataTable, { Column } from '@/components/DataTable';
import Modal from '@/components/Modal';
import Form, { FormField } from '@/components/Form';
import { Plus, Search, Filter, Download, Upload, Trash2 } from 'lucide-react';

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 'active',
    dept: '技术部',
    createTime: '2024-01-01 10:00:00',
    lastLoginTime: '2024-01-15 14:30:00'
  },
  {
    id: '2',
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    dept: '销售部',
    createTime: '2024-01-02 09:00:00',
    lastLoginTime: '2024-01-14 16:20:00'
  },
  {
    id: '3',
    username: 'lisi',
    nickname: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'inactive',
    dept: '市场部',
    createTime: '2024-01-03 11:00:00',
    lastLoginTime: '2024-01-10 09:15:00'
  }
];

export default function UserPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 搜索和筛选
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    if (deptFilter !== 'all') {
      filtered = filtered.filter(user => user.dept === deptFilter);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, statusFilter, deptFilter]);

  // 分页数据
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 表格列定义
  const columns: Column[] = [
    {
      key: 'username',
      title: '用户名',
      sortable: true
    },
    {
      key: 'nickname',
      title: '昵称',
      sortable: true
    },
    {
      key: 'email',
      title: '邮箱',
      sortable: true
    },
    {
      key: 'phone',
      title: '手机号'
    },
    {
      key: 'status',
      title: '状态',
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
      key: 'dept',
      title: '部门',
      sortable: true
    },
    {
      key: 'createTime',
      title: '创建时间',
      sortable: true
    },
    {
      key: 'lastLoginTime',
      title: '最后登录',
      sortable: true
    }
  ];

  // 表单字段定义
  const formFields: FormField[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'text',
      placeholder: '请输入用户名',
      required: true,
      validation: (value) => {
        if (value.length < 3) return '用户名至少3个字符';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return '用户名只能包含字母、数字和下划线';
        return null;
      }
    },
    {
      name: 'nickname',
      label: '昵称',
      type: 'text',
      placeholder: '请输入昵称',
      required: true
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱',
      required: true,
      validation: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入有效的邮箱地址';
        return null;
      }
    },
    {
      name: 'phone',
      label: '手机号',
      type: 'text',
      placeholder: '请输入手机号',
      validation: (value) => {
        if (value && !/^1[3-9]\d{9}$/.test(value)) return '请输入有效的手机号';
        return null;
      }
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
      name: 'dept',
      label: '部门',
      type: 'select',
      required: true,
      options: [
        { value: '技术部', label: '技术部' },
        { value: '销售部', label: '销售部' },
        { value: '市场部', label: '市场部' },
        { value: '人事部', label: '人事部' },
        { value: '财务部', label: '财务部' }
      ]
    }
  ];

  // 处理新增/编辑用户
  const handleSubmit = (data: any) => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      if (editingUser) {
        // 编辑用户
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? { ...user, ...data } : user
        ));
      } else {
        // 新增用户
        const newUser = {
          ...data,
          id: Date.now().toString(),
          createTime: new Date().toLocaleString(),
          lastLoginTime: '-'
        };
        setUsers(prev => [newUser, ...prev]);
      }
      
      setLoading(false);
      setIsModalOpen(false);
      setEditingUser(null);
    }, 1000);
  };

  // 处理编辑用户
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // 处理删除用户
  const handleDelete = (user: any) => {
    if (confirm(`确定要删除用户 "${user.nickname}" 吗？`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  // 处理批量删除
  const handleBatchDelete = (selectedKeys: string[]) => {
    if (selectedKeys.length === 0) {
      alert('请选择要删除的用户');
      return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedKeys.length} 个用户吗？`)) {
      setUsers(prev => prev.filter(user => !selectedKeys.includes(user.id)));
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDeptFilter('all');
  };

  return (
    <Layout>
      <PageContent 
        title="用户管理"
        description="管理系统用户信息，包括用户创建、编辑、删除和权限分配等功能。"
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
                    placeholder="搜索用户名、昵称、邮箱..."
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
                  
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">全部部门</option>
                    <option value="技术部">技术部</option>
                    <option value="销售部">销售部</option>
                    <option value="市场部">市场部</option>
                    <option value="人事部">人事部</option>
                    <option value="财务部">财务部</option>
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
                    setEditingUser(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>新增用户</span>
                </button>
                
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>导出</span>
                </button>
                
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>导入</span>
                </button>
              </div>
            </div>
          </div>

          {/* 用户列表 */}
          <DataTable
            columns={columns}
            data={paginatedUsers}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total: filteredUsers.length,
              onChange: (page) => setCurrentPage(page)
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectable={true}
            onSelectionChange={handleBatchDelete}
          />
        </div>

        {/* 新增/编辑用户模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          title={editingUser ? '编辑用户' : '新增用户'}
          size="lg"
        >
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            submitText={editingUser ? '保存' : '新增'}
            loading={loading}
            initialData={editingUser}
          />
        </Modal>
      </PageContent>
    </Layout>
  );
}
