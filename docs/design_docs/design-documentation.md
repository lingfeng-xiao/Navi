# 个人经济管理系统 - 设计文档

> 本文档基于 Notion Pro 设计系统标准，提供个人经济管理系统的完整设计规范，包括技术栈、项目结构、核心功能模块和 UI/UX 设计标准。

## 📋 目录

- [设计理念与原则](#设计理念与原则)
  - [设计理念](#设计理念)
  - [核心原则](#核心原则)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心功能模块](#核心功能模块)
  - [📊 数据大盘](#-数据大盘)
  - [💰 收入管理](#-收入管理)
  - [💸 支出管理](#-支出管理)
  - [📉 负债管理](#-负债管理)
- [UI/UX 设计规范](#uiux-设计规范)
  - [🎨 色彩系统](#-色彩系统)
    - [设计原则](#设计原则)
    - [主题类型](#主题类型)
    - [中性色调](#中性色调)
    - [功能色](#功能色)
    - [文字色](#文字色)
    - [状态色](#状态色)
  - [🔤 排版系统](#-排版系统)
  - [📏 间距系统](#-间距系统)
  - [🔲 圆角系统](#-圆角系统)
  - [🔲 阴影系统](#-阴影系统)
  - [🎬 过渡动画](#-过渡动画)
  - [📱 响应式设计](#-响应式设计)
  - [♿ 无障碍设计](#-无障碍设计)
- [🌈 主题切换机制和实现指南](#-主题切换机制和实现指南)
  - [设计原则](#设计原则-1)
  - [CSS实现方法](#css实现方法)
  - [JavaScript实现](#javascript实现)
  - [主题切换组件设计](#主题切换组件设计)
  - [最佳实践和注意事项](#最佳实践和注意事项)
- [📋 CSS变量速查表](#-css变量速查表)
  - [颜色变量](#颜色变量)
  - [主题变量](#主题变量)
  - [排版变量](#排版变量)
  - [间距变量](#间距变量)
  - [圆角变量](#圆角变量)
  - [阴影变量](#阴影变量)
  - [过渡变量](#过渡变量)
  - [Z-Index变量](#z-index变量)

## 设计理念与原则

### 设计理念
采用简洁、清晰、高质量排版的设计语言，注重内容的可读性和用户体验。设计风格追求极简主义，同时保持专业性和现代感，确保界面既美观又实用。

### 核心原则
- **简洁明了**：减少视觉干扰，突出核心内容
- **一致性**：在整个产品中保持统一的设计语言
- **可访问性**：确保所有用户都能轻松使用产品
- **响应式**：适配各种设备尺寸和屏幕分辨率
- **性能优先**：轻量化设计，确保快速加载和流畅交互

## 技术栈

### 前端技术
- **Vue 3 + TypeScript + Vite**：核心开发框架
- **Element Plus**：UI 组件库
- **ECharts**：图表可视化
- **Axios**：HTTP 请求
- **Pinia**：状态管理
- **Vue Router**：路由管理
- **CSS Variables**：样式变量管理

### 后端技术
- **Python FastAPI**：后端 API
- **MySQL**：数据存储
- **Redis**：缓存服务

## 项目结构

```
src/
├── assets/        # 静态资源
├── components/    # 公共组件
│   ├── common/    # 基础组件
│   │   ├── Button.vue
│   │   └── Card.vue
│   ├── business/  # 业务组件（当前为空）
│   └── layout/    # 布局组件
│       └── AppLayout.vue
├── composables/   # 组合式函数
├── router/        # 路由配置
│   └── index.ts
├── services/      # 服务层（替代原api目录）
│   └── financeService.ts
├── stores/        # 状态管理
│   └── finance.ts
├── styles/        # 全局样式
├── types/         # 类型定义
│   └── finance.ts
├── views/         # 页面组件
│   ├── Dashboard/
│   ├── Debt/
│   ├── Expense/
│   ├── NotFound/
│   └── Settings/
├── App.vue
└── main.ts
```

## 核心功能模块

### 📊 数据大盘

#### 功能描述
提供个人财务总体概览，包括收支总额、预算执行情况、财务趋势等关键指标。

#### 布局架构
- **固定顶部导航**：包含 logo、主要导航菜单、搜索、通知和用户信息
- **侧边栏导航**：可折叠，包含主要功能模块入口
- **主内容区**：
  - **顶部概览区**：4 个关键指标卡片，带有动态数值变化动画
  - **中部分析区**：左右两栏布局，左侧为收入/支出趋势图，右侧为支出分类饼图
  - **预算跟踪区**：进度条卡片，显示各分类预算使用情况
  - **最近交易区**：交易记录表格，支持实时筛选和排序
- **浮动操作按钮**：快速添加交易记录

#### 响应式布局
- **桌面端(≥1200px)**：完整多列布局，所有卡片同时显示
- **平板端(768-1199px)**：双列布局，图表垂直排列
- **移动端(<768px)**：单列布局，卡片堆叠，侧边栏转为抽屉式菜单

#### 视觉层次
- **Z轴分层**：卡片悬浮在背景之上，导航栏位于顶层
- **信息优先级**：最重要的财务概览位于页面顶部，详细数据在下方
- **色彩区分**：使用主题色和功能色强调不同类型的数据

#### 交互功能
- **图表交互**：支持多维度数据筛选，图表数据动态更新动画
- **卡片交互**：卡片悬停效果，点击展开详情模态框
- **实时更新**：数据变化时的平滑过渡动画
- **时间选择器**：直观的日历式时间范围选择，支持快速预设选项
- **滚动体验**：平滑滚动，元素随滚动渐入

#### 数据字段
- 总收入：Number
- 总支出：Number
- 总余额：Number
- 预算执行率：Number
- 交易记录列表：Array<{id, amount, type, category, date, description}>

### ⚙️ 系统设置

#### 布局架构
- **主要内容区**：
  - **外观设置**：主题选择（浅色/深色/跟随系统），包含主题预览功能
  - **区域设置**：语言选择、货币设置、日期格式设置
  - **预算提醒设置**：启用/禁用预算提醒功能
- **表单布局**：采用卡片式分组布局，清晰区分不同设置类别

#### 交互优化
- **即时预览**：主题设置可实时预览效果
- **自动保存**：设置更改即时生效并保存
- **简洁表单**：使用下拉选择器和开关组件，操作直观
- **设置说明**：每个设置项提供简洁明了的提示说明

### 💸 支出管理

#### 布局架构
- **顶部操作栏**：搜索框、多维度筛选器、排序选项、批量操作
- **主要内容区**：
  - **支出概览卡片**：展示选定时间范围的总支出、平均支出、预算使用情况
  - **支出记录列表**：分页表格，支持行内编辑和展开详情
  - **支出热力图**：以日历形式展示每日支出情况
- **右侧分析面板**：
  - **支出分类占比**：环形图展示各类别支出比例
  - **预算跟踪器**：各分类预算使用进度
  - **异常支出提醒**：标记超出预期的支出
- **浮动操作按钮**：快速添加新支出记录

#### 交互优化
- **智能分类建议**：基于历史记录自动推荐支出分类
- **批量编辑**：支持同时修改多条记录的相同字段
- **标签过滤**：支持多标签组合筛选
- **收支对比视图**：一键切换到与收入的对比视图
- **导出功能**：支持多种格式导出支出数据

### 📉 负债管理

#### 布局架构
- **顶部概览区**：
  - **总负债卡片**：展示总负债金额、已还金额、剩余负债、下月还款额
  - **负债健康指标**：可视化展示负债比例、信用评分等关键指标
- **主要内容区**：
  - **负债记录列表**：采用卡片式布局展示每条负债，包含状态指示器
  - **还款计划日历**：直观展示未来还款日期和金额
  - **负债趋势图**：展示负债随时间变化的趋势
- **右侧分析面板**：
  - **负债分类统计**：不同类型负债的比例分析
  - **还款策略建议**：基于当前负债情况提供智能还款建议
  - **提前还款计算器**：模拟提前还款对总利息的影响
- **底部操作区**：批量操作按钮、导出报告按钮

#### 交互优化
- **负债详情模态框**：点击负债卡片展开详细信息和还款历史
- **交互式还款计划**：可调整还款日期和金额，实时计算影响
- **拖拽排序**：可自定义负债列表显示顺序
- **状态变更动画**：负债状态变化时的过渡动画
- **智能提醒**：到期还款前的视觉提醒和通知
- **情境菜单**：右键点击负债记录弹出快捷操作菜单
- **数据导出**：支持多种格式导出负债报表

#### 数据可视化
- **负债饼图**：展示不同类型负债占比
- **还款进度条**：直观显示每条负债的还款进度
- **利息累计图**：展示利息随时间的累计情况
- **现金流预测**：基于还款计划的未来现金流预测

## UI/UX 设计规范

### 🎨 色彩系统

#### 设计原则
- 使用简洁、专业的色彩方案
- 确保浅色/深色模式的良好支持
- 维持足够的对比度以保证可访问性
- 功能色应明确传达信息和状态
- 支持多主题切换，满足不同场景和用户偏好

#### 主题类型
- **默认主题**：专业、清晰的基础主题
- **现代极简主题**：极简主义、现代感强烈、高级感突出的主题

#### 中性色调

##### 浅色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 背景主色 | `#ffffff` | 页面主背景 |
| 卡片背景 | `#ffffff` | 卡片和内容容器 |
| 悬停背景 | `#f7f6f3` | 鼠标悬停状态 |
| 激活背景 | `#ebeaea` | 选中或激活状态 |
| 次要背景 | `#fbfbfa` | 次要内容区域 |
| 浅边框 | `#eaeaea` | 轻分隔线和边框 |
| 默认边框 | `#e0e0e0` | 标准边框 |
| 深边框 | `#d0d0d0` | 强调边框 |

##### 深色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 背景主色 | `#191919` | 页面主背景 |
| 卡片背景 | `#252525` | 卡片和内容容器 |
| 悬停背景 | `#37352f` | 鼠标悬停状态 |
| 激活背景 | `#404040` | 选中或激活状态 |
| 次要背景 | `#2a2a2a` | 次要内容区域 |
| 浅边框 | `#37352f` | 轻分隔线和边框 |
| 默认边框 | `#4a4a4a` | 标准边框 |
| 深边框 | `#525252` | 强调边框 |

##### 现代极简主题
| 名称 | 值 | 用途 |
|-----|-----|------|
| 背景主色 | `#fafafa` | 极浅的页面主背景 |
| 卡片背景 | `#ffffff` | 纯白卡片背景，创造强烈对比 |
| 悬停背景 | `#f2f2f2` | 微妙的悬停状态 |
| 激活背景 | `#e8e8e8` | 精确的激活状态 |
| 次要背景 | `#f5f5f5` | 次要内容区域 |
| 浅边框 | `#f0f0f0` | 几乎不可见的轻分隔线 |
| 默认边框 | `#e0e0e0` | 标准边框 |
| 深边框 | `#d0d0d0` | 强调边框 |

#### 功能色

##### 浅色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 收入色 | `#2e75cc` | 收入相关数据和标签 |
| 支出色 | `#e74c3c` | 支出相关数据和标签 |
| 负债色 | `#8e44ad` | 负债相关数据和标签 |
| 强调色 | `#2e75cc` | 高亮显示和交互元素 |
| 主色 | `#2e75cc` | 主要操作按钮和链接 |

##### 深色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 收入色 | `#7cb7ff` | 收入相关数据和标签 |
| 支出色 | `#ff7cb7` | 支出相关数据和标签 |
| 负债色 | `#b77cff` | 负债相关数据和标签 |
| 强调色 | `#7cb7ff` | 高亮显示和交互元素 |
| 主色 | `#7cb7ff` | 主要操作按钮和链接 |

##### 现代极简主题
| 名称 | 值 | 用途 |
|-----|-----|------|
| 收入色 | `#1a73e8` | 饱和度更高的收入色，更现代 |
| 支出色 | `#ea4335` | 鲜明的支出色，更具视觉冲击力 |
| 负债色 | `#673ab7` | 更具高级感的负债色 |
| 强调色 | `#1a73e8` | 清晰的强调色 |
| 主色 | `#1a73e8` | 现代感强烈的主色调 |

#### 文字色

##### 浅色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 主文字 | `#37352f` | 主要内容文字 |
| 次要文字 | `#6b7280` | 辅助说明文字 |
| 提示文字 | `#9ca3af` | 占位符和提示文本 |
| 禁用文字 | `#d1d5db` | 禁用状态文字 |

##### 深色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 主文字 | `#ffffff` | 主要内容文字 |
| 次要文字 | `#9ca3af` | 辅助说明文字 |
| 提示文字 | `#6b7280` | 占位符和提示文本 |
| 禁用文字 | `#4b5563` | 禁用状态文字 |

##### 现代极简主题
| 名称 | 值 | 用途 |
|-----|-----|------|
| 主文字 | `#121212` | 更深的主文字，提高对比度 |
| 次要文字 | `#666666` | 精确的次要文字灰度 |
| 提示文字 | `#999999` | 清晰的提示文字 |
| 禁用文字 | `#cccccc` | 禁用状态文字 |

#### 状态色

##### 浅色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 成功 | `#10b981` | 成功状态和提示 |
| 警告 | `#f59e0b` | 警告状态和提示 |
| 信息 | `#3b82f6` | 信息提示 |
| 错误 | `#ef4444` | 错误状态和提示 |

##### 深色模式（默认主题）
| 名称 | 值 | 用途 |
|-----|-----|------|
| 成功 | `#34d399` | 成功状态和提示 |
| 警告 | `#fcd34d` | 警告状态和提示 |
| 信息 | `#60a5fa` | 信息提示 |
| 错误 | `#f87171` | 错误状态和提示 |

##### 现代极简主题
| 名称 | 值 | 用途 |
|-----|-----|------|
| 成功 | `#34a853` | 现代风格的成功色 |
| 警告 | `#fbbc05` | 鲜明的警告色 |
| 信息 | `#4285f4` | 清晰的信息色 |
| 错误 | `#ea4335` | 明确的错误色 |

### 🔤 排版系统

#### 字体家族
- **无衬线字体**：`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`
- **等宽字体**：`'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', monospace`

#### 字重
- 轻量 (`300`)
- 常规 (`400`)
- 中等 (`500`)
- 半粗体 (`600`)
- 粗体 (`700`)

#### 字号系统

| 名称 | 大小 | 用途 |
|-----|------|------|
| 超小 | `11px` | 微小辅助文本 |
| 小 | `13px` | 辅助文本、标签 |
| 基础 | `15px` | 正文内容 |
| 中等 | `18px` | 小标题、重要文本 |
| 大 | `22px` | 中标题 |
| 超大 | `26px` | 大标题 |
| 特大 | `32px` | 页面标题、强调文本 |

#### 行高
- 紧凑 (`1.2`)：标题、短文本
- 正常 (`1.5`)：正文内容
- 宽松 (`1.75`)：长段落、详细说明
- 标题 (`1.3`)：各种标题

#### 标题样式

| 级别 | 字号 | 行高 | 字重 | 颜色 | 间距 |
|-----|------|------|------|------|------|
| H1 | 32px | 1.3 | 700 | 主文字色 | 1.5em |
| H2 | 26px | 1.3 | 600 | 主文字色 | 1.3em |
| H3 | 22px | 1.3 | 600 | 主文字色 | 1.2em |
| H4 | 18px | 1.3 | 500 | 主文字色 | 1.1em |
| H5 | 15px | 1.5 | 500 | 主文字色 | 1em |
| H6 | 13px | 1.5 | 500 | 主文字色 | 1em |

### 📏 间距系统

#### 基础网格
采用 8px 网格系统，所有间距和尺寸都基于此网格的倍数。

#### 间距值

| 名称 | 值 | 用途 |
|-----|-----|------|
| 超小 | `4px` | 微小元素间距 |
| 小 | `8px` | 元素内边距、小间距 |
| 中 | `16px` | 元素间距、容器内边距 |
| 大 | `24px` | 区域间距、较大内边距 |
| 超大 | `32px` | 大区域间距、页面边距 |
| 特大 | `48px` | 主要区域间距 |
| 超大特大 | `64px` | 页面主要区块间距 |

#### 布局间距
- **内容区域**：左右边距 16px (移动端) - 24px (桌面端)
- **区块间距**：32px - 48px
- **元素间距**：16px
- **组件内间距**：8px - 16px

### ⚪ 圆角系统

#### 圆角值

| 名称 | 值 | 用途 |
|-----|-----|------|
| 小 | `3px` | 小元素、标签 |
| 中 | `4px` | 按钮、输入框 |
| 大 | `6px` | 卡片、容器 |
| 超大 | `8px` | 大型容器、弹窗 |
| 圆形 | `9999px` | 圆形按钮、图标 |

#### 圆角使用指南
- 保持一致性，相同类型的组件使用相同的圆角值
- 避免过度使用圆角，保持界面的专业性
- 关键操作和重要元素可以使用稍微大一点的圆角

### 🔲 阴影系统

#### 阴影值

| 名称 | 值 | 用途 |
|-----|-----|------|
| 小 | `0 1px 2px rgba(0, 0, 0, 0.03)` | 轻微分隔 |
| 中 | `0 2px 4px rgba(0, 0, 0, 0.04)` | 按钮、小卡片 |
| 大 | `0 4px 8px rgba(0, 0, 0, 0.05)` | 卡片、容器 |
| 超大 | `0 8px 16px rgba(0, 0, 0, 0.07)` | 弹窗、下拉菜单 |

#### 阴影使用原则
- 阴影应该轻微、自然，避免过重
- 仅在需要创建层次感时使用阴影
- 确保阴影在深色模式下也能正常显示

### 🎬 过渡动画

#### 过渡时长
- **快速**：`100ms` - 微小交互，如按钮悬停
- **正常**：`150ms` - 常规交互，如切换状态
- **缓慢**：`200ms` - 较大元素的过渡

#### 缓动函数
- **默认**：`ease-in-out` - 平滑的加速和减速
- **加速**：`ease-in` - 开始慢，逐渐变快
- **减速**：`ease-out` - 开始快，逐渐变慢

#### 动画使用原则
- 保持动画简洁、有目的
- 避免过度动画，以免分散用户注意力
- 确保动画在所有设备上性能良好

### 📱 响应式设计

#### 断点设置
- **移动设备**：< 640px
- **平板设备**：640px - 1024px
- **桌面设备**：> 1024px

#### 适配原则
- **移动优先**：从移动设备开始设计，然后扩展到更大屏幕
- **内容重排**：在较小屏幕上合理重排内容
- **组件大小调整**：根据屏幕尺寸调整组件大小
- **布局变更**：在不同断点使用不同的布局策略

### 设计系统管理

#### CSS变量管理
- 使用CSS变量（Custom Properties）进行主题管理
- 所有设计令牌集中在`src/styles/variables.css`中定义
- 通过`:root`选择器全局应用变量

#### 设计令牌命名
- 变量命名遵循`--[category]-[element]-[variant]`模式
- 所有组件应通过CSS变量引用设计值，而非硬编码

#### 组件变体和状态
  - 为每个组件定义默认、悬停、聚焦、禁用等状态
  - 提供不同尺寸的组件变体（小型、中型、大型）

### ♿ 无障碍设计

#### 设计原则
- **包容性**：设计应考虑所有用户，包括不同能力水平的用户
- **可感知性**：所有信息和用户界面组件必须以可感知的方式呈现给用户
- **可操作性**：用户界面组件和导航必须可操作
- **可理解性**：信息和用户界面操作必须可理解

#### 键盘导航
- 所有交互元素必须支持键盘导航
- 提供明确的焦点指示器
- 确保焦点顺序符合逻辑和直观
- 支持常用键盘快捷键

#### 颜色对比度
- 确保文本与背景的对比度符合WCAG AA标准（正常文本至少4.5:1，大文本至少3:1）
- 不要仅依赖颜色传达重要信息，始终提供辅助标识（如图标、文本标签）
- 为图表和数据可视化提供替代表示方式

#### 语义化HTML
- 使用正确的HTML语义元素（header、nav、main、section、footer等）
- 确保表单元素有关联的标签
- 使用适当的ARIA角色、属性和状态

#### 屏幕阅读器支持
- 确保所有交互元素有适当的alt文本
- 提供表格的标题和描述
- 确保动态内容变化能够被屏幕阅读器检测到
- 为复杂控件提供详细的ARIA标签

#### 错误处理
- 错误信息应明确、具体，并提供修正建议
- 确保错误信息与相关表单字段关联
- 支持语音输入和替代输入方法

  ---

## 📋 CSS变量速查表

  ### 颜色变量

  #### 中性色（浅色模式）
  ```css
  --color-bg-primary: #ffffff;
  --color-bg-card: #ffffff;
  --color-bg-hover: #f7f6f3;
  --color-bg-active: #ebeaea;
  --color-bg-secondary: #fbfbfa;
  --color-border-light: #eaeaea;
  --color-border-default: #e0e0e0;
  --color-border-dark: #d0d0d0;
  ```

  #### 中性色（深色模式）
  ```css
  --color-bg-primary-dark: #191919;
  --color-bg-card-dark: #252525;
  --color-bg-hover-dark: #37352f;
  --color-bg-active-dark: #404040;
  --color-bg-secondary-dark: #2a2a2a;
  --color-border-light-dark: #37352f;
  --color-border-default-dark: #4a4a4a;
  --color-border-dark-dark: #525252;
  ```

  #### 中性色（现代极简主题）
  ```css
  --color-bg-primary-minimal: #fafafa;
  --color-bg-card-minimal: #ffffff;
  --color-bg-hover-minimal: #f2f2f2;
  --color-bg-active-minimal: #e8e8e8;
  --color-bg-secondary-minimal: #f5f5f5;
  --color-border-light-minimal: #f0f0f0;
  --color-border-default-minimal: #e0e0e0;
  --color-border-dark-minimal: #d0d0d0;
  ```

  #### 功能色
  ```css
  --color-income: #2e75cc;
  --color-income-dark: #7cb7ff;
  --color-income-minimal: #1a73e8;
  --color-expense: #e74c3c;
  --color-expense-dark: #ff7cb7;
  --color-expense-minimal: #ea4335;
  --color-debt: #8e44ad;
  --color-debt-dark: #b77cff;
  --color-debt-minimal: #673ab7;
  --color-primary: #2e75cc;
  --color-primary-dark: #7cb7ff;
  --color-primary-minimal: #1a73e8;
  --color-accent: #2e75cc;
  --color-accent-dark: #7cb7ff;
  --color-accent-minimal: #1a73e8;
  ```

  #### 文字色
  ```css
  --color-text-primary: #37352f;
  --color-text-primary-dark: #ffffff;
  --color-text-primary-minimal: #121212;
  --color-text-secondary: #6b7280;
  --color-text-secondary-dark: #9ca3af;
  --color-text-secondary-minimal: #666666;
  --color-text-tertiary: #9ca3af;
  --color-text-tertiary-dark: #6b7280;
  --color-text-tertiary-minimal: #999999;
  --color-text-disabled: #d1d5db;
  --color-text-disabled-dark: #4b5563;
  --color-text-disabled-minimal: #cccccc;
  --color-text-hint: #9ca3af;
  --color-text-hint-dark: #6b7280;
  --color-text-hint-minimal: #999999;
  ```

  #### 状态色
  ```css
  --color-success: #10b981;
  --color-success-dark: #34d399;
  --color-success-minimal: #34a853;
  --color-warning: #f59e0b;
  --color-warning-dark: #fcd34d;
  --color-warning-minimal: #fbbc05;
  --color-info: #3b82f6;
  --color-info-dark: #60a5fa;
  --color-info-minimal: #4285f4;
  --color-error: #ef4444;
  --color-error-dark: #f87171;
  --color-error-minimal: #ea4335;
  ```

  ### 主题变量

#### 主题切换基础变量
```css
/* 主题切换控制变量 */
--theme-default: 'default';
--theme-minimal: 'minimal';
--theme-current: var(--theme-default); /* 默认使用默认主题 */

/* 主题模式变量 */
--mode-light: 'light';
--mode-dark: 'dark';
--mode-current: var(--mode-light); /* 默认使用浅色模式 */
```

## 🌈 主题切换机制和实现指南

### 设计原则
- **无缝切换体验**：主题切换过程应平滑无闪烁
- **持久化存储**：用户选择的主题应保存在本地存储中
- **响应式适配**：支持浅色/深色模式与主题的组合
- **渐进增强**：默认样式作为后备，确保基础可用性

### CSS实现方法

#### 1. 使用CSS变量和数据属性

```css
/* 基础变量定义 */
:root {
  /* 默认主题变量 (浅色模式) */
  --color-bg-primary: #ffffff;
  --color-text-primary: #37352f;
  /* 其他默认变量... */
  
  /* 深色模式变量 */
  --color-bg-primary-dark: #191919;
  --color-text-primary-dark: #ffffff;
  /* 其他深色模式变量... */
  
  /* 现代极简主题变量 */
  --color-bg-primary-minimal: #fafafa;
  --color-text-primary-minimal: #121212;
  /* 其他极简主题变量... */
}

/* 默认主题浅色模式 (默认状态) */
body {
  --bg-primary: var(--color-bg-primary);
  --text-primary: var(--color-text-primary);
  /* 其他运行时变量... */
}

/* 深色模式 */
body[data-theme-mode="dark"] {
  --bg-primary: var(--color-bg-primary-dark);
  --text-primary: var(--color-text-primary-dark);
  /* 其他运行时变量... */
}

/* 现代极简主题 */
body[data-theme="minimal"] {
  --bg-primary: var(--color-bg-primary-minimal);
  --text-primary: var(--color-text-primary-minimal);
  /* 其他运行时变量... */
}

/* 现代极简主题深色模式 */
body[data-theme="minimal"][data-theme-mode="dark"] {
  --bg-primary: var(--color-bg-primary-dark);
  --text-primary: var(--color-text-primary-dark);
  /* 可以根据需要覆盖特定变量 */
  /* --color-primary: #34a853; */
}

/* 实际组件使用运行时变量 */
.card {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

### JavaScript实现

#### 1. 主题管理工具函数

```javascript
/**
 * 主题管理器
 */
const ThemeManager = {
  // 主题类型
  themes: {
    DEFAULT: 'default',
    MINIMAL: 'minimal'
  },
  
  // 模式类型
  modes: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  
  // 存储键名
  STORAGE_KEY: 'app_theme_settings',
  
  /**
   * 初始化主题系统
   */
  init() {
    // 获取存储的主题设置
    const savedSettings = this.getSavedSettings();
    
    // 应用主题设置
    this.applyTheme(savedSettings.theme, savedSettings.mode);
    
    // 添加系统主题变化监听器
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const savedSettings = this.getSavedSettings();
        // 只有当未明确设置模式时才响应系统变化
        if (savedSettings.mode === 'system') {
          this.applyTheme(savedSettings.theme, e.matches ? this.modes.DARK : this.modes.LIGHT);
        }
      });
    }
  },
  
  /**
   * 获取保存的主题设置
   */
  getSavedSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        theme: this.themes.DEFAULT,
        mode: this.modes.LIGHT
      };
    } catch (error) {
      console.error('Error loading theme settings:', error);
      return {
        theme: this.themes.DEFAULT,
        mode: this.modes.LIGHT
      };
    }
  },
  
  /**
   * 保存主题设置
   */
  saveSettings(theme, mode) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ theme, mode }));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  },
  
  /**
   * 应用主题
   */
  applyTheme(theme, mode) {
    // 应用主题类
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme-mode', mode);
    
    // 保存设置
    this.saveSettings(theme, mode);
    
    // 触发主题变化事件
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, mode } }));
  },
  
  /**
   * 切换主题
   */
  toggleTheme(theme) {
    const savedSettings = this.getSavedSettings();
    this.applyTheme(theme, savedSettings.mode);
  },
  
  /**
   * 切换模式
   */
  toggleMode(mode) {
    const savedSettings = this.getSavedSettings();
    this.applyTheme(savedSettings.theme, mode);
  }
};

// 初始化主题系统
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});
```

### 主题切换组件设计

#### 1. 主题选择器组件

```jsx
/**
 * 主题切换组件
 */
function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedMode, setSelectedMode] = useState('light');
  
  useEffect(() => {
    // 从ThemeManager获取当前主题设置
    const settings = ThemeManager.getSavedSettings();
    setSelectedTheme(settings.theme);
    setSelectedMode(settings.mode);
    
    // 监听主题变化事件
    const handleThemeChange = (e) => {
      setSelectedTheme(e.detail.theme);
      setSelectedMode(e.detail.mode);
    };
    
    document.addEventListener('themeChanged', handleThemeChange);
    return () => document.removeEventListener('themeChanged', handleThemeChange);
  }, []);
  
  const handleThemeChange = (theme) => {
    ThemeManager.toggleTheme(theme);
  };
  
  const handleModeChange = (mode) => {
    ThemeManager.toggleMode(mode);
  };
  
  return (
    <div className="theme-selector">
      <h3>外观设置</h3>
      
      <div className="theme-options">
        <h4>主题</h4>
        <div className="theme-buttons">
          <button 
            className={selectedTheme === 'default' ? 'active' : ''}
            onClick={() => handleThemeChange('default')}
          >
            默认主题
          </button>
          <button 
            className={selectedTheme === 'minimal' ? 'active' : ''}
            onClick={() => handleThemeChange('minimal')}
          >
            现代极简
          </button>
        </div>
      </div>
      
      <div className="mode-options">
        <h4>模式</h4>
        <div className="mode-buttons">
          <button 
            className={selectedMode === 'light' ? 'active' : ''}
            onClick={() => handleModeChange('light')}
          >
            浅色
          </button>
          <button 
            className={selectedMode === 'dark' ? 'active' : ''}
            onClick={() => handleModeChange('dark')}
          >
            深色
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 最佳实践和注意事项

1. **性能优化**
   - 使用CSS变量进行主题切换，避免在JavaScript中直接操作大量DOM元素
   - 考虑使用CSS过渡动画，使主题切换更加平滑
   - 避免在主题切换时进行复杂计算

2. **响应式设计**
   - 确保每个主题都能正确适配各种屏幕尺寸
   - 在不同断点测试主题的视觉效果

3. **可访问性考虑**
   - 确保所有主题都满足WCAG AA级别的颜色对比度要求
   - 提供足够的颜色区分，使界面元素易于识别

4. **兼容性支持**
   - 对于不支持CSS变量的旧浏览器，提供合适的后备样式
   - 使用特性检测确保功能降级优雅

5. **用户体验**
   - 提供即时的主题切换反馈
   - 在设置中保存用户的主题偏好
   - 考虑添加主题预览功能，让用户在应用前查看效果

  ### 排版变量
  ```css
  /* 字体大小 */
  --font-size-xs: 11px;
  --font-size-sm: 13px;
  --font-size-base: 15px;
  --font-size-md: 18px;
  --font-size-lg: 22px;
  --font-size-xl: 26px;
  --font-size-xxl: 32px;
  
  /* 行高 */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-heading: 1.3;
  
  /* 字重 */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  ```

  ### 间距变量
  ```css
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --spacing-xxxl: 64px;
  ```

  ### 圆角变量
  ```css
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
  --radius-full: 9999px;
  ```

  ### 阴影变量
  ```css
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.07);
  ```

  ### 过渡变量
  ```css
  --transition-fast: 100ms;
  --transition-normal: 150ms;
  --transition-slow: 200ms;
  --transition-timing: ease-in-out;
  --transition-timing-in: ease-in;
  --transition-timing-out: ease-out;
  ```

  ### Z-Index变量
  ```css
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  ```

  ---  

  本文档为个人经济管理系统的设计标准，所有前端实现应严格遵循此规范，确保视觉一致性和用户体验的连贯性。