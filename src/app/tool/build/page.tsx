'use client';

import Layout from '@/components/Layout';
import PageContent from '@/components/PageContent';

export default function Page() {
  return (
    <Layout>
      <PageContent 
        title="构建管理"
        description="管理系统构建流程，包括构建配置、构建历史、构建状态等。"
      >
        <div className="space-y-6">
          {/* 搜索和操作区域 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="搜索..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                搜索
              </button>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              新增
            </button>
          </div>

          {/* 内容区域 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                📊 构建管理功能开发中
              </div>
              <p className="text-sm text-gray-400">
                这里将显示相关数据表格，支持分页、排序、筛选等功能
              </p>
            </div>
          </div>
        </div>
      </PageContent>
    </Layout>
  );
}
