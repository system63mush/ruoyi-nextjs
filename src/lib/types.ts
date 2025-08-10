// 用户类型
export interface User {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: string;
  loginIp?: string;
  loginDate?: Date;
  createBy?: string;
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  remark?: string;
}

// 角色类型
export interface Role {
  id: string;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: string;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  status: string;
  delFlag: string;
  createBy?: string;
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  remark?: string;
}

// 菜单类型
export interface Menu {
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
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  remark?: string;
  children?: Menu[];
}

// 部门类型
export interface Dept {
  id: string;
  parentId: string;
  ancestors: string;
  deptName: string;
  orderNum: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: string;
  delFlag: string;
  createBy?: string;
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  children?: Dept[];
}

// 岗位类型
export interface Post {
  id: string;
  postCode: string;
  postName: string;
  postSort: number;
  status: string;
  createBy?: string;
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  remark?: string;
}

// 字典类型
export interface DictType {
  id: string;
  dictName: string;
  dictType: string;
  status: string;
  createBy?: string;
  createTime: Date;
  updateBy?: string;
  updateTime: Date;
  remark?: string;
}

// 字典数据
export interface DictData {
  id: string;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  cssClass?: string;
  listClass?: string;
  isDefault: string;
  status: string;
  remark?: string;
  createTime: string;
  updateTime: string;
}

// 操作日志
export interface OperLog {
  id: string;
  title: string;
  businessType: string;
  method?: string;
  requestMethod?: string;
  operatorType: string;
  operName?: string;
  operUrl?: string;
  operIp?: string;
  operLocation?: string;
  operParam?: string;
  jsonResult?: string;
  status: string;
  errorMsg?: string;
  operTime: Date;
}

// 登录日志
export interface LoginLog {
  id: string;
  userName?: string;
  ipaddr?: string;
  loginLocation?: string;
  browser?: string;
  os?: string;
  status: string;
  msg?: string;
  loginTime: Date;
}

// 分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
  orderByColumn?: string;
  isAsc?: string;
}

// 分页结果
export interface PageResult<T> {
  rows: T[];
  total: number;
}

// 响应结果
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
  permissions: string[];
  roles: string[];
}

// 菜单树节点
export interface MenuTreeNode {
  id: string;
  label: string;
  children?: MenuTreeNode[];
  [key: string]: any;
}

export interface MenuItem {
  id: string;
  menuName: string;
  parentId: string;
  orderNum: number;
  path?: string;
  component?: string;
  isFrame?: number;
  isCache?: number;
  menuType: string;
  visible: string;
  status: string;
  perms?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface JobLog {
  id: string;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  jobMessage?: string;
  status: string;
  exceptionInfo?: string;
  createTime: string;
}

export interface FormField {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: Record<string, unknown>;
} 