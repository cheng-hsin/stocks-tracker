# 股票投资追踪系统

一个使用GitHub作为数据库的股票投资追踪系统，基于 Next.js 构建。

## 功能特点

- 📝 记录投资信息（买价、股数、总价、现价、投资日期）
- 📊 自动分类显示（美股个股/ETF、台股个股/ETF、加密货币）
- 📈 投资总览圆饼图（粗略模式和详细模式）
- 💾 数据自动提交到GitHub仓库
- 🎨 现代化UI设计
- ⚡ 基于 Next.js 14，性能优异

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置GitHub

1. 在GitHub上创建一个新的仓库（可以是私有的）
2. 生成Personal Access Token：
   - 前往 GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - 点击 "Generate new token (classic)"
   - 勾选 `repo` 权限
   - 复制生成的token

3. 创建 `.env.local` 文件：

```bash
cp env.example .env.local
```

4. 编辑 `.env.local` 文件，填入你的信息：

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问网站

打开浏览器访问：`http://localhost:3000`

## 生产环境部署

### 构建项目

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 使用说明

1. **添加投资记录**：填写表单信息，选择投资类型，点击提交
2. **查看投资列表**：使用顶部标签筛选不同类型的投资
3. **查看投资总览**：
   - **粗略模式**：显示台股/美股/加密货币的比例
   - **详细模式**：显示每个个股和货币的详细比例
4. **删除记录**：点击投资卡片上的删除按钮

## 技术栈

- **框架**：Next.js 14
- **语言**：TypeScript
- **UI库**：React
- **图表**：Chart.js + react-chartjs-2
- **数据库**：GitHub仓库（JSON文件）
- **API**：GitHub REST API (@octokit/rest)

## 项目结构

```
stocks-tracker/
├── components/          # React 组件
│   ├── InvestmentForm.tsx
│   ├── InvestmentList.tsx
│   └── PieChart.tsx
├── lib/                 # 工具函数
│   └── github.ts       # GitHub API 封装
├── pages/               # Next.js 页面
│   ├── api/            # API 路由
│   │   └── investments/
│   ├── _app.tsx
│   └── index.tsx
├── styles/              # CSS 样式文件
└── public/              # 静态资源
```

## 注意事项

- 确保GitHub token有足够的权限
- 首次使用时会自动创建 `investments.json` 文件
- 所有数据变更都会通过Git commit记录在GitHub上
- 环境变量文件 `.env.local` 不会被提交到Git仓库
