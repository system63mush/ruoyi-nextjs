# 若依管理系统部署指南

## 🚀 Vercel部署

### 1. 环境准备

#### 数据库配置
由于Vercel不支持SQLite文件数据库，需要配置云数据库：

**推荐选项：**
- **PlanetScale** (MySQL) - 免费计划，适合开发
- **Neon** (PostgreSQL) - 免费计划，性能优秀
- **Supabase** (PostgreSQL) - 免费计划，功能丰富

#### 环境变量配置
在Vercel项目设置中配置以下环境变量：

```env
# 数据库连接
DATABASE_URL="your_database_connection_string"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

### 2. 部署步骤

#### 方法一：通过Vercel Dashboard
1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库：`system63mush/ruoyi-nextjs`
4. 配置环境变量
5. 点击 "Deploy"

#### 方法二：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

### 3. 数据库迁移

#### 使用PlanetScale (推荐)
1. 注册 [PlanetScale](https://planetscale.com)
2. 创建新数据库
3. 获取连接字符串
4. 更新环境变量

```bash
# 更新Prisma配置
npx prisma db push --schema=./prisma/schema.prisma

# 运行种子数据
npm run seed
```

#### 使用Neon
1. 注册 [Neon](https://neon.tech)
2. 创建新项目
3. 获取连接字符串
4. 更新环境变量

### 4. 部署配置

#### vercel.json
项目已包含Vercel配置文件：
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### package.json脚本
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 5. 常见问题

#### Prisma客户端错误
如果遇到Prisma客户端初始化错误：
1. 确保环境变量`DATABASE_URL`正确配置
2. 检查数据库连接是否正常
3. 确认Prisma schema配置正确

#### 数据库连接问题
- 确保数据库服务正常运行
- 检查防火墙和网络连接
- 验证连接字符串格式

#### 构建失败
- 检查TypeScript类型错误
- 确认所有依赖项正确安装
- 查看构建日志获取详细错误信息

### 6. 生产环境优化

#### 性能优化
- 启用Vercel Edge Functions
- 配置CDN缓存
- 优化图片和静态资源

#### 安全配置
- 使用强密码的JWT密钥
- 配置CORS策略
- 启用HTTPS

#### 监控和日志
- 配置错误监控
- 设置性能监控
- 启用访问日志

### 7. 域名配置

#### 自定义域名
1. 在Vercel项目设置中添加自定义域名
2. 配置DNS记录
3. 启用HTTPS证书

#### 子域名
- `admin.yourdomain.com` - 管理后台
- `api.yourdomain.com` - API接口

### 8. 备份和恢复

#### 数据库备份
```bash
# 导出数据
npx prisma db pull

# 备份schema
cp prisma/schema.prisma backup/

# 导出数据
npx prisma db seed
```

#### 代码备份
- 使用Git版本控制
- 定期推送代码到GitHub
- 配置自动备份

### 9. 维护和更新

#### 定期更新
- 更新依赖项版本
- 修复安全漏洞
- 优化性能

#### 监控和维护
- 监控系统性能
- 检查错误日志
- 定期备份数据

---

## 📞 技术支持

如果在部署过程中遇到问题：

1. **查看文档**：参考本部署指南
2. **检查日志**：查看Vercel构建和运行日志
3. **社区支持**：在GitHub Issues中提问
4. **官方文档**：参考Vercel和Prisma官方文档

---

**若依管理系统** - 让部署更简单、更可靠！ 