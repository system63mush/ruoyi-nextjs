'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import DataTable, { Column } from '@/components/DataTable';
import Modal from '@/components/Modal';
import Form, { FormField } from '@/components/Form';
import { Plus, Search, Building, Users, ChevronRight, ChevronDown, Edit, Trash2, Eye } from 'lucide-react';

// 模拟部门数据
const mockDepts = [
  {
    id: '1',
    deptName: '总公司',
    deptCode: 'HQ',
    parentId: '0',
    orderNum: 1,
    leader: '张三',
    phone: '010-12345678',
    email: 'hq@company.com',
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    userCount: 50,
    level: 1,
    children: []
  },
  {
    id: '2',
    deptName: '技术部',
    deptCode: 'TECH',
    parentId: '1',
    orderNum: 1,
    leader: '李四',
    phone: '010-12345679',
    email: 'tech@company.com',
    status: 'active',
    createTime: '2024-01-02 09:00:00',
    userCount: 20,
    level: 2,
    children: []
  },
  {
    id: '3',
    deptName: '销售部',
    deptCode: 'SALES',
    parentId: '1',
    orderNum: 2,
    leader: '王五',
    phone: '010-12345680',
    email: 'sales@company.com',
    status: 'active',
    createTime: '2024-01-03 11:00:00',
    userCount: 15,
    level: 2,
    children: []
  },
  {
    id: '4',
    deptName: '市场部',
    deptCode: 'MARKET',
    parentId: '1',
    orderNum: 3,
    leader: '赵六',
    phone: '010-12345681',
    email: 'market@company.com',
    status: 'active',
    createTime: '2024-01-04 14:00:00',
    userCount: 10,
    level: 2,
    children: []
  },
  {
    id: '5',
    deptName: '前端组',
    deptCode: 'FRONTEND',
    parentId: '2',
    orderNum: 1,
    leader: '钱七',
    phone: '010-12345682',
    email: 'frontend@company.com',
    status: 'active',
    createTime: '2024-01-05 15:00:00',
    userCount: 8,
    level: 3,
    children: []
  },
  {
    id: '6',
    deptName: '后端组',
    deptCode: 'BACKEND',
    parentId: '2',
    orderNum: 2,
    leader: '孙八',
    phone: '010-12345683',
    email: 'backend@company.com',
    status: 'active',
    createTime: '2024-01-06 16:00:00',
    userCount: 12,
    level: 3,
    children: []
  }
];

export default function DeptPage() {
  const [depts, setDepts] = useState(mockDepts);
  const [filteredDepts, setFilteredDepts] = useState(mockDepts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['1', '2']));

  // 构建部门树
  const buildDeptTree = (deptList: any[]) => {
    const deptMap = new Map();
    const rootDepts: any[] = [];

    // 创建映射
    deptList.forEach(dept => {
      deptMap.set(dept.id, { ...dept, children: [] });
    });

    // 构建树结构
    deptList.forEach(dept => {
      if (dept.parentId === '0') {
        rootDepts.push(deptMap.get(dept.id));
      } else {
        const parent = deptMap.get(dept.parentId);
        if (parent) {
          parent.children.push(deptMap.get(dept.id));
        }
      }
    });

    return rootDepts;
  };

  // 搜索和筛选
  useEffect(() => {
    let filtered = depts;
    
    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.deptCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.leader.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dept => dept.status === statusFilter);
    }
    
    setFilteredDepts(filtered);
    setCurrentPage(1);
  }, [depts, searchTerm, statusFilter]);

  // 分页数据
  const paginatedDepts = filteredDepts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 表格列定义
  const columns: Column[] = [
    {
      key: 'deptName',
      label: '部门名称',
      sortable: true
    },
    {
      key: 'deptCode',
      label: '部门编码',
      sortable: true
    },
    {
      key: 'orderNum',
      label: '排序',
      sortable: true
    },
    {
      key: 'leader',
      label: '负责人'
    },
    {
      key: 'phone',
      label: '联系电话'
    },
    {
      key: 'email',
      label: '邮箱'
    },
    {
      key: 'status',
      label: '状态'
    },
    {
      key: 'userCount',
      label: '用户数量',
      sortable: true
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
      name: 'deptName',
      label: '部门名称',
      type: 'text',
      placeholder: '请输入部门名称',
      required: true,
      validation: (value) => {
        if (value.length < 2) return '部门名称至少2个字符';
        return null;
      }
    },
    {
      name: 'deptCode',
      label: '部门编码',
      type: 'text',
      placeholder: '请输入部门编码',
      required: true,
      validation: (value) => {
        if (!/^[A-Z_]+$/.test(value)) return '部门编码只能包含大写字母和下划线';
        return null;
      }
    },
    {
      name: 'parentId',
      label: '上级部门',
      type: 'select',
      required: true,
      options: [
        { value: '0', label: '顶级部门' },
        ...depts.map(dept => ({ value: dept.id, label: dept.deptName }))
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
      name: 'leader',
      label: '负责人',
      type: 'text',
      placeholder: '请输入负责人姓名'
    },
    {
      name: 'phone',
      label: '联系电话',
      type: 'text',
      placeholder: '请输入联系电话',
      validation: (value) => {
        if (value && !/^[\d-]+$/.test(value)) return '请输入有效的联系电话';
        return null;
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱',
      validation: (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入有效的邮箱地址';
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
    }
  ];

  // 处理新增/编辑部门
  const handleSubmit = (data: any) => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      if (editingDept) {
        // 编辑部门
        setDepts(prev => prev.map(dept => 
          dept.id === editingDept.id ? { ...dept, ...data } : dept
        ));
      } else {
        // 新增部门
        const newDept = {
          ...data,
          id: Date.now().toString(),
          createTime: new Date().toLocaleString(),
          userCount: 0,
          level: data.parentId === '0' ? 1 : 
            (depts.find(d => d.id === data.parentId)?.level || 1) + 1,
          children: []
        };
        setDepts(prev => [newDept, ...prev]);
      }
      
      setLoading(false);
      setIsModalOpen(false);
      setEditingDept(null);
    }, 1000);
  };

  // 处理编辑部门
  const handleEdit = (dept: any) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  // 处理删除部门
  const handleDelete = (dept: any) => {
    if (dept.userCount > 0) {
      alert(`部门 "${dept.deptName}" 下还有 ${dept.userCount} 个用户，无法删除`);
      return;
    }
    
    // 检查是否有子部门
    const hasChildren = depts.some(d => d.parentId === dept.id);
    if (hasChildren) {
      alert(`部门 "${dept.deptName}" 下还有子部门，无法删除`);
      return;
    }
    
    if (confirm(`确定要删除部门 "${dept.deptName}" 吗？`)) {
      setDepts(prev => prev.filter(d => d.id !== dept.id));
    }
  };

  // 处理查看部门详情
  const handleViewDept = (dept: any) => {
    alert(`部门详情：\n名称：${dept.deptName}\n编码：${dept.deptCode}\n负责人：${dept.leader}\n用户数量：${dept.userCount}`);
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <Layout>
      <PageContent 
        title="部门管理"
        description="管理系统组织架构，包括部门创建、编辑、删除和层级关系维护等功能。"
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
                    placeholder="搜索部门名称、编码、负责人..."
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
                    setEditingDept(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>新增部门</span>
                </button>
                
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>组织架构</span>
                </button>
              </div>
            </div>
          </div>

          {/* 部门列表 */}
          <DataTable
            columns={columns}
            data={filteredDepts}
            loading={loading}
            pageSize={pageSize}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleViewDept}
          />
        </div>

        {/* 新增/编辑部门模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDept(null);
          }}
          title={editingDept ? '编辑部门' : '新增部门'}
          size="lg"
        >
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            submitText={editingDept ? '保存' : '新增'}
            loading={loading}
            initialData={editingDept}
          />
        </Modal>
      </PageContent>
    </Layout>
  );
}
