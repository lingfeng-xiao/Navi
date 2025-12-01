# 个人财务管理系统

## 项目简介

这是一个基于Vue 3开发的个人财务管理系统，提供收入、支出、债务管理和数据分析功能。

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **UI组件库**: Element Plus
- **数据可视化**: ECharts
- **开发语言**: TypeScript

## 功能特性

- 📊 数据仪表盘：直观展示财务状况
- 💵 收入管理：记录和分类收入
- 💸 支出管理：追踪和分析支出
- 📝 债务管理：监控和管理债务
- 📈 数据分析：提供多维度财务分析图表

## 安装与运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

## 项目结构

```
├── src/                # 源代码目录
│   ├── api/            # API请求模块
│   ├── assets/         # 静态资源
│   ├── components/     # Vue组件
│   ├── composables/    # 可复用的组合式函数
│   ├── layouts/        # 布局组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia状态管理
│   ├── styles/         # 样式文件
│   ├── types/          # TypeScript类型定义
│   ├── utils/          # 工具函数
│   └── views/          # 页面视图
├── index.html          # HTML入口文件
├── package.json        # 项目配置和依赖
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
└── VERSION_MANAGEMENT.md # 版本管理文档
```

## 版本管理

本项目采用语义化版本控制规范。详细信息请参阅[版本管理文档](VERSION_MANAGEMENT.md)。

## 安全注意事项

- 项目使用环境变量管理敏感信息
- 请勿在代码中硬编码API密钥、Token等敏感信息
- 定期更新依赖项以修复安全漏洞

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License