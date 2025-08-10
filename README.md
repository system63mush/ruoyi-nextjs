# 若依管理系统 (RuoYi Next.js)

基于 Next.js 15 的现代化权限管理系统，采用最新的技术栈构建。

## 🚀 项目状态

✅ **项目已成功运行！**

- 开发服务器运行在: http://localhost:3001
- 数据库已初始化并包含测试数据
- 默认管理员账户已创建

## 🛠️ 技术栈

- **前端框架**: Next.js 15.4.6 + React 19.1.0
- **UI组件**: Tailwind CSS 4 + Headless UI
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT + bcryptjs
- **图标**: Lucide React
- **字体**: Inter + Noto Sans SC

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

项目已自动创建了 `.env` 文件，包含必要的环境变量：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

### 数据库初始化

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 运行种子数据
npm run seed
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 查看应用。

## 📚 文档说明

### 📖 使用指南
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - 详细的使用说明文档
- **[SCREENSHOTS_GUIDE.md](./SCREENSHOTS_GUIDE.md)** - 界面截图和功能说明
- **[MODULES_SUMMARY.md](./MODULES_SUMMARY.md)** - 模块功能总结

### 🎯 快速导航
- **系统管理**：用户、角色、菜单、部门、岗位管理
- **系统监控**：在线用户、定时任务监控
- **系统工具**：表单构建、代码生成
- **字典管理**：字典类型和数据管理
- **日志管理**：操作日志和登录日志

## 🔐 默认登录信息

- **用户名**: admin
- **密码**: admin123

## 📁 项目结构

```
ruoyi-nextjs/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── login/          # 登录页面
│   │   ├── system/         # 系统管理页面
│   │   └── monitor/        # 系统监控页面
│   ├── components/         # React 组件
│   └── lib/               # 工具库
├── prisma/                # 数据库配置
└── public/               # 静态资源
```

## 🎯 功能特性

### 已实现功能

- ✅ 用户认证与授权
- ✅ 响应式仪表板
- ✅ 侧边栏导航
- ✅ 深色模式支持
- ✅ 用户管理界面
- ✅ 角色管理界面
- ✅ 菜单管理界面
- ✅ 部门管理界面
- ✅ 系统监控界面
- ✅ 操作日志
- ✅ 登录日志

### 核心组件

- **Layout**: 主布局组件，包含侧边栏和头部
- **Sidebar**: 响应式侧边栏导航
- **Header**: 顶部导航栏
- **Dashboard**: 仪表板页面
- **DataTable**: 通用数据表格组件
- **Form**: 通用表单组件
- **Modal**: 模态框组件

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 数据库种子
npm run seed
```

## 📊 数据库模型

项目包含完整的数据模型：

- **用户管理**: User, UserRole, UserPost
- **权限管理**: Role, RoleMenu, Menu
- **组织架构**: Dept, Post
- **系统配置**: DictType, DictData
- **日志记录**: OperLog, LoginLog

## 🎨 UI/UX 特性

- 现代化设计风格
- 响应式布局
- 深色/浅色主题切换
- 流畅的动画效果
- 直观的用户界面
- 移动端友好

## 🔒 安全特性

- JWT 身份验证
- 密码加密存储
- 权限控制
- 操作日志记录
- 登录日志记录

## 🚀 部署

项目支持多种部署方式：

- **Vercel**: 推荐用于快速部署
- **Docker**: 容器化部署
- **传统服务器**: Node.js 环境部署

## 📝 开发计划

- [ ] 完善 API 接口
- [ ] 添加更多业务模块
- [ ] 优化性能
- [ ] 添加单元测试
- [ ] 国际化支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**若依科技** - 基于 Next.js 的现代化权限管理系统
