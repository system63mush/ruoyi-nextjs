'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';
import { Search, Plus, Download, Eye, Edit, Trash2, Database, FileCode, Settings, Play } from 'lucide-react';

interface TableInfo {
  id: string;
  tableName: string;
  tableComment: string;
  className: string;
  packageName: string;
  moduleName: string;
  businessName: string;
  functionName: string;
  functionAuthor: string;
  createTime: string;
  updateTime: string;
}

interface ColumnInfo {
  id: string;
  columnName: string;
  columnComment: string;
  columnType: string;
  isRequired: boolean;
  isPk: boolean;
  isInsert: boolean;
  isEdit: boolean;
  isList: boolean;
  isQuery: boolean;
  queryType: string;
  htmlType: string;
  dictType: string;
}

export default function Page() {
  const [tables, setTables] = useState<TableInfo[]>([
    {
      id: '1',
      tableName: 'sys_user',
      tableComment: '用户信息表',
      className: 'User',
      packageName: 'com.ruoyi.system',
      moduleName: 'system',
      businessName: 'user',
      functionName: '用户管理',
      functionAuthor: 'ruoyi',
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      tableName: 'sys_role',
      tableComment: '角色信息表',
      className: 'Role',
      packageName: 'com.ruoyi.system',
      moduleName: 'system',
      businessName: 'role',
      functionName: '角色管理',
      functionAuthor: 'ruoyi',
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);

  const handleConfig = (table: TableInfo) => {
    setSelectedTable(table);
    // 模拟获取列信息
    setColumns([
      {
        id: '1',
        columnName: 'id',
        columnComment: '主键ID',
        columnType: 'bigint',
        isRequired: true,
        isPk: true,
        isInsert: false,
        isEdit: false,
        isList: true,
        isQuery: false,
        queryType: 'EQ',
        htmlType: 'input',
        dictType: ''
      },
      {
        id: '2',
        columnName: 'username',
        columnComment: '用户名',
        columnType: 'varchar(50)',
        isRequired: true,
        isPk: false,
        isInsert: true,
        isEdit: true,
        isList: true,
        isQuery: true,
        queryType: 'LIKE',
        htmlType: 'input',
        dictType: ''
      }
    ]);
    setShowConfigModal(true);
  };

  const handlePreview = (table: TableInfo) => {
    setSelectedTable(table);
    setShowPreviewModal(true);
  };

  const handleGenerate = (table: TableInfo) => {
    // 模拟代码生成
    alert(`正在为表 ${table.tableName} 生成代码...`);
  };

  const filteredTables = tables.filter(table =>
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.tableComment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <PageContent 
        title="代码生成"
        description="快速生成代码模板，包括实体类、服务类、控制器等代码文件。"
      >
        <div className="space-y-6">
          {/* 搜索和操作区域 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索表名或注释..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              导入表结构
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">总表数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tables.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileCode className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">已生成</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Settings className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">待配置</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Play className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">今日生成</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* 表列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      表名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      表注释
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      类名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      包名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      功能名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTables.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                          {table.tableName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {table.tableComment}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {table.className}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {table.packageName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {table.functionName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {table.createTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfig(table)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="配置生成参数"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePreview(table)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="预览代码"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleGenerate(table)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="生成代码"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            title="下载代码"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 配置生成参数模态框 */}
          {showConfigModal && selectedTable && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    配置生成参数 - {selectedTable.tableName}
                  </h3>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">基本信息</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          表名
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedTable.tableName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          表注释
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedTable.tableComment}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          类名
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedTable.className}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          包名
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedTable.packageName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 字段配置 */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">字段配置</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">字段名</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">注释</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">类型</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">必填</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">主键</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">插入</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">编辑</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">列表</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">查询</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">查询类型</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">HTML类型</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {columns.map((column) => (
                            <tr key={column.id}>
                              <td className="px-3 py-2 text-sm text-gray-900 dark:text-white font-mono">
                                {column.columnName}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {column.columnComment}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {column.columnType}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isRequired}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isPk}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isInsert}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isEdit}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isList}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  defaultChecked={column.isQuery}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <select className="text-xs border border-gray-300 rounded px-2 py-1">
                                  <option value="EQ">等于</option>
                                  <option value="NE">不等于</option>
                                  <option value="GT">大于</option>
                                  <option value="GTE">大于等于</option>
                                  <option value="LT">小于</option>
                                  <option value="LTE">小于等于</option>
                                  <option value="LIKE">模糊查询</option>
                                  <option value="BETWEEN">范围查询</option>
                                </select>
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                <select className="text-xs border border-gray-300 rounded px-2 py-1">
                                  <option value="input">输入框</option>
                                  <option value="textarea">文本域</option>
                                  <option value="select">下拉框</option>
                                  <option value="radio">单选框</option>
                                  <option value="checkbox">复选框</option>
                                  <option value="datetime">日期时间</option>
                                  <option value="imageUpload">图片上传</option>
                                  <option value="fileUpload">文件上传</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfigModal(false);
                        handleGenerate(selectedTable);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      生成代码
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 代码预览模态框 */}
          {showPreviewModal && selectedTable && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    代码预览 - {selectedTable.tableName}
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entity.java</span>
                    </div>
                    <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
                      <pre>{`package ${selectedTable.packageName}.domain;

import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * ${selectedTable.tableComment}对象 ${selectedTable.tableName}
 * 
 * @author ${selectedTable.functionAuthor}
 * @date ${new Date().toLocaleDateString()}
 */
public class ${selectedTable.className} extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 用户名 */
    @Excel(name = "用户名")
    private String username;

    public void setId(Long id) 
    {
        this.id = id;
    }

    public Long getId() 
    {
        return id;
    }

    public void setUsername(String username) 
    {
        this.username = username;
    }

    public String getUsername() 
    {
        return username;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("username", getUsername())
            .toString();
    }
}`}</pre>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Controller.java</span>
                    </div>
                    <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
                      <pre>{`package ${selectedTable.packageName}.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;
import ${selectedTable.packageName}.domain.${selectedTable.className};
import ${selectedTable.packageName}.service.I${selectedTable.className}Service;

/**
 * ${selectedTable.tableComment}Controller
 * 
 * @author ${selectedTable.functionAuthor}
 * @date ${new Date().toLocaleDateString()}
 */
@RestController
@RequestMapping("/${selectedTable.moduleName}/${selectedTable.businessName}")
public class ${selectedTable.className}Controller extends BaseController
{
    @Autowired
    private I${selectedTable.className}Service ${selectedTable.businessName}Service;

    /**
     * 查询${selectedTable.tableComment}列表
     */
    @PreAuthorize("@ss.hasPermi("${selectedTable.moduleName}:${selectedTable.businessName}:list")")
    @GetMapping("/list")
    public TableDataInfo list(${selectedTable.className} ${selectedTable.businessName})
    {
        startPage();
        List<${selectedTable.className}> list = ${selectedTable.businessName}Service.select${selectedTable.className}List(${selectedTable.businessName});
        return getDataTable(list);
    }

    /**
     * 导出${selectedTable.tableComment}列表
     */
    @PreAuthorize("@ss.hasPermi("${selectedTable.moduleName}:${selectedTable.businessName}:export")")
    @Log(title = "${selectedTable.tableComment}", businessType = BusinessType.EXPORT)
    @GetMapping("/export")
    public AjaxResult export(${selectedTable.className} ${selectedTable.businessName})
    {
        List<${selectedTable.className}> list = ${selectedTable.businessName}Service.select${selectedTable.className}List(${selectedTable.businessName});
        ExcelUtil<${selectedTable.className}> util = new ExcelUtil<${selectedTable.className}>(${selectedTable.className}.class);
        return util.exportExcel(list, "${selectedTable.businessName}");
    }
}`}</pre>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载代码
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
