import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// 格式化日期
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 状态映射
export const statusMap = {
  '0': { label: '正常', color: 'success' },
  '1': { label: '停用', color: 'error' },
  '2': { label: '删除', color: 'default' }
};

// 菜单类型映射
export const menuTypeMap = {
  'M': { label: '目录', color: 'primary' },
  'C': { label: '菜单', color: 'success' },
  'F': { label: '按钮', color: 'warning' }
};

// 业务类型映射
export const businessTypeMap = {
  '0': '其它',
  '1': '新增',
  '2': '修改',
  '3': '删除',
  '4': '授权',
  '5': '导出',
  '6': '导入',
  '7': '强退',
  '8': '生成代码',
  '9': '清空数据'
};

// 操作员类型映射
export const operatorTypeMap = {
  '0': '其它',
  '1': '后台用户',
  '2': '手机端用户'
};

// 数据权限映射
export const dataScopeMap = {
  '1': '全部数据权限',
  '2': '自定数据权限',
  '3': '本部门数据权限',
  '4': '本部门及以下数据权限',
  '5': '仅本人数据权限'
};

// 构建树形结构
export function buildTree<T extends { id: string; parentId: string; children?: T[] }>(
  items: T[],
  parentId: string = '0'
): T[] {
  const tree: T[] = [];
  
  for (const item of items) {
    if (item.parentId === parentId) {
      const children = buildTree(items, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  }
  
  return tree.sort((a, b) => ((a as any).orderNum || 0) - ((b as any).orderNum || 0));
}

// 扁平化树形结构
export function flattenTree<T extends { children?: T[] }>(tree: T[]): T[] {
  const result: T[] = [];
  
  function traverse(nodes: T[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }
  
  traverse(tree);
  return result;
}

// 获取所有父级ID
export function getParentIds<T extends { id: string; parentId: string }>(
  items: T[],
  targetId: string
): string[] {
  const parentIds: string[] = [];
  
  function findParents(id: string) {
    const item = items.find(i => i.id === id);
    if (item && item.parentId !== '0') {
      parentIds.push(item.parentId);
      findParents(item.parentId);
    }
  }
  
  findParents(targetId);
  return parentIds;
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 深拷贝
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

// 生成UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 验证邮箱
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证手机号
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// 验证密码强度
export function getPasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];
  
  if (password.length >= 8) score += 1;
  else suggestions.push('密码长度至少8位');
  
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('包含小写字母');
  
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('包含大写字母');
  
  if (/\d/.test(password)) score += 1;
  else suggestions.push('包含数字');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push('包含特殊字符');
  
  let level: 'weak' | 'medium' | 'strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else level = 'strong';
  
  return { score, level, suggestions };
} 