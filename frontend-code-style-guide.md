# 前端代码规范文档

## 1. 项目概述

本项目是一个基于Vue 3的个人财务管理系统，使用TypeScript作为开发语言，采用Pinia进行状态管理，Vue Router进行路由管理，并集成了Element Plus UI组件库。本文档旨在规范团队成员的代码风格，提高代码质量和可维护性。

## 2. TypeScript/JavaScript 代码规范

### 2.1 类型使用

- **强制类型注解**：所有变量、函数参数和返回值必须有明确的类型注解
- **避免使用any**：除非确实无法确定类型，否则禁止使用`any`类型
- **使用联合类型**：当值可能是多种类型时，使用联合类型（`|`）而非`any`
- **使用字面量类型**：对于有限取值的变量，使用字面量类型（如`'success' | 'error'`）
- **接口定义**：使用`interface`定义对象结构，使用`type`定义联合类型和映射类型

**示例**：
```typescript
// 推荐
interface User {
  id: number;
  name: string;
  email?: string;
}

type Status = 'active' | 'inactive' | 'pending';

function getUser(id: number): User | null {
  // 实现
  return null;
}

// 避免
function getUser(id: any): any {
  // 实现
  return null;
}
```

### 2.2 变量声明

- **使用const和let**：始终使用`const`声明不可变变量，使用`let`声明可变变量
- **禁止使用var**：避免使用`var`声明变量，防止作用域问题
- **变量初始化**：声明变量时必须初始化
- **变量命名**：使用小驼峰命名法（camelCase）

**示例**：
```typescript
// 推荐
const MAX_COUNT = 100;
let counter = 0;
const userNames: string[] = [];

// 避免
var max_count = 100;
let Counter;
```

### 2.3 函数编写

- **函数声明**：优先使用箭头函数（对于简单函数）和函数声明（对于复杂函数）
- **函数签名**：明确指定参数类型和返回类型
- **默认参数**：使用默认参数简化条件判断
- **剩余参数**：使用剩余参数（...）处理可变数量的参数
- **禁止使用arguments**：使用剩余参数替代`arguments`对象

**示例**：
```typescript
// 推荐
const sum = (a: number, b: number): number => a + b;

function fetchData(url: string, options: RequestInit = {}): Promise<any> {
  return fetch(url, options).then(res => res.json());
}

function logMessages(...messages: string[]): void {
  messages.forEach(msg => console.log(msg));
}

// 避免
function sum(a, b) {
  return a + b;
}

function logMessages() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}
```

### 2.4 异步代码

- **使用async/await**：优先使用`async/await`处理异步操作，避免嵌套回调
- **Promise处理**：正确处理Promise的`then`、`catch`和`finally`
- **错误处理**：使用try/catch捕获异步错误
- **避免Promise嵌套**：避免多层嵌套的Promise链

**示例**：
```typescript
// 推荐
async function getUserData(userId: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// 避免
function getUserData(userId: number): Promise<User> {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      return response.json().then(data => {
        return data;
      }).catch(err => {
        console.error(err);
      });
    });
}
```

### 2.5 数组和对象操作

- **数组方法**：使用数组方法（如map、filter、reduce）代替for循环
- **对象解构**：使用解构赋值简化代码
- **展开运算符**：使用展开运算符（...）复制对象和数组
- **可选链操作符**：使用可选链操作符（?.）安全地访问对象属性
- **空值合并操作符**：使用空值合并操作符（??）处理默认值

**示例**：
```typescript
// 推荐
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evenNumbers = numbers.filter(n => n % 2 === 0);

const { name, age } = user;
const userCopy = { ...user, active: true };

const userName = user?.profile?.name ?? 'Unknown';

// 避免
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}

const userName = user && user.profile && user.profile.name ? user.profile.name : 'Unknown';
```

### 2.6 错误处理

- **明确的错误类型**：创建自定义错误类以提供更有意义的错误信息
- **错误日志**：记录详细的错误信息，包括上下文
- **用户反馈**：对于用户可操作的错误，提供友好的用户反馈

**示例**：
```typescript
// 推荐
class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed for field ${error.field}: ${error.message}`);
    showErrorMessage(`Please enter a valid ${error.field}`);
  } else {
    console.error('Unexpected error:', error);
    showErrorMessage('An unexpected error occurred');
  }
}
```

## 3. Vue 组件设计与开发规范

### 3.1 组件结构

- **单文件组件（SFC）**：使用`.vue`单文件组件格式
- **结构顺序**：模板（template）、脚本（script）、样式（style）
- **组件拆分**：遵循单一职责原则，将大型组件拆分为更小、可复用的组件
- **组件命名**：使用PascalCase命名组件文件和组件定义

**示例**：
```vue
<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <!-- 组件模板 -->
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 3.2 组合式API

- **使用<script setup>**：优先使用`<script setup>`语法
- **响应式数据**：使用`ref`和`reactive`创建响应式数据
- **计算属性**：使用`computed`创建依赖响应式数据的计算值
- **监听器**：使用`watch`和`watchEffect`监听数据变化
- **生命周期钩子**：使用组合式API提供的生命周期钩子函数

**示例**：
```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

watch(count, (newCount, oldCount) => {
  console.log(`Count changed from ${oldCount} to ${newCount}`);
});

const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

### 3.3 Props 和 Emits

- **Props定义**：使用TypeScript接口定义props类型
- **Props验证**：为props指定类型、默认值、必填项等验证规则
- **Emits定义**：使用`defineEmits`定义组件发出的事件
- **命名约定**：props使用小驼峰，emits使用kebab-case

**示例**：
```vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface UserProps {
  id: number;
  name: string;
  role?: 'admin' | 'user';
}

const props = defineProps<UserProps>();
const emit = defineEmits<{
  (e: 'user-click', userId: number): void;
  (e: 'role-change', role: 'admin' | 'user'): void;
}>();

const handleUserClick = () => {
  emit('user-click', props.id);
};
</script>
```

### 3.4 组件通信

- **父子组件**：使用props和emits进行通信
- **跨组件通信**：使用Pinia store管理共享状态
- **依赖注入**：对于多层级组件，使用provide/inject模式
- **避免prop drilling**：避免通过多层组件传递props，优先使用store或provide/inject

**示例**：
```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { provide } from 'vue';

provide('theme', 'dark');
</script>

<!-- DeepChild.vue -->
<script setup lang="ts">
import { inject } from 'vue';

const theme = inject<string>('theme', 'light');
</script>
```

### 3.5 模板语法

- **表达式简洁**：模板中的表达式保持简单，复杂逻辑应移至脚本部分
- **v-for和key**：使用v-for时必须提供唯一的key属性
- **条件渲染**：优先使用v-if/v-else，仅当元素频繁切换显示状态时使用v-show
- **事件处理**：事件处理器函数应定义在脚本部分

**示例**：
```vue
<template>
  <div>
    <div v-for="item in items" :key="item.id" @click="handleItemClick(item)">
      {{ item.name }}
    </div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败</div>
    <div v-else-if="items.length === 0">暂无数据</div>
    <div v-else>显示内容</div>
  </div>
</template>
```

### 3.6 路由和导航

- **路由配置**：使用TypeScript定义路由类型和meta信息
- **懒加载**：使用动态导入实现组件懒加载
- **导航守卫**：使用导航守卫处理权限验证和页面标题设置
- **编程式导航**：使用router.push/replace进行编程式导航

**示例**：
```typescript
// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true
    }
  }
];

// 导航守卫
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - 应用名称`;
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
});
```

## 4. CSS/SCSS 样式规范

### 4.1 样式组织结构

- **组件样式隔离**：使用scoped属性隔离组件样式
- **全局样式**：仅在全局样式文件中定义全局样式
- **主题变量**：使用CSS变量定义主题相关样式
- **样式导入**：使用`@import`导入共享样式文件

**示例**：
```vue
<style scoped>
.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
}
</style>
```

### 4.2 命名规范

- **BEM命名法**：组件样式使用BEM（Block-Element-Modifier）命名约定
- **语义化类名**：使用具有语义的类名，避免基于样式的命名
- **短横线连接**：使用kebab-case（短横线连接）命名CSS类和ID

**示例**：
```css
/* 推荐 */
.user-card {
  /* 块样式 */
}

.user-card__header {
  /* 元素样式 */
}

.user-card--active {
  /* 修饰器样式 */
}

/* 避免 */
.red-box {
  /* 基于样式的命名 */
}
```

### 4.3 CSS 最佳实践

- **避免ID选择器**：优先使用类选择器，避免使用ID选择器
- **避免!important**：尽量避免使用!important，通过提高选择器特异性解决问题
- **简写属性**：合理使用CSS简写属性
- **单位统一**：使用rem/em作为尺寸单位，使用无单位值（如0）
- **响应式设计**：使用媒体查询实现响应式设计

**示例**：
```css
/* 推荐 */
.container {
  margin: 0 auto;
  padding: 1rem;
  max-width: 1200px;
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
}

/* 避免 */
#main-content {
  margin-top: 0px !important;
  padding-left: 20px;
  padding-right: 20px;
}
```

### 4.4 动画和过渡

- **Vue过渡**：使用Vue的transition组件处理组件过渡
- **性能优化**：优先使用transform和opacity属性进行动画
- **帧率控制**：使用requestAnimationFrame优化动画性能

**示例**：
```vue
<template>
  <transition name="fade">
    <div v-if="show">内容</div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 5. 命名规范与最佳实践

### 5.1 文件命名

- **组件文件**：使用PascalCase（大驼峰）命名组件文件
- **非组件文件**：使用kebab-case（短横线连接）命名非组件文件
- **目录命名**：使用kebab-case（短横线连接）命名目录

**示例**：
```
components/
  UserProfile.vue
  UserList.vue
utils/
  format-helpers.ts
  api-service.ts
```

### 5.2 变量和函数命名

- **变量命名**：使用小驼峰（camelCase）命名变量
- **常量命名**：使用全大写和下划线（SNAKE_CASE）命名常量
- **函数命名**：使用小驼峰（camelCase）命名函数
- **布尔变量**：布尔变量应使用is/has/can等前缀

**示例**：
```typescript
const MAX_RETRY_COUNT = 3;
let userData: User | null = null;
const isLoading = ref(false);
const hasPermission = computed(() => user.value?.role === 'admin');

function fetchUserData(userId: number): Promise<User> {
  // 实现
}
```

### 5.3 接口和类型命名

- **接口命名**：使用PascalCase（大驼峰）命名接口
- **类型命名**：使用PascalCase（大驼峰）命名类型别名
- **泛型命名**：使用单个大写字母命名泛型参数

**示例**：
```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

type Status = 'active' | 'inactive' | 'pending';

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // 实现
}
```

### 5.4 注释规范

- **代码注释**：为复杂逻辑和关键算法添加注释
- **JSDoc注释**：为公共API、函数、类和接口添加JSDoc注释
- **组件注释**：为组件添加使用说明、props和emits的文档注释

**示例**：
```typescript
/**
 * 计算两个数字的和
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两个数字的和
 */
function add(a: number, b: number): number {
  return a + b;
}
```

## 6. 文件与目录结构规范

### 6.1 目录结构

项目目录应遵循以下结构：

```
src/
  ├── assets/         # 静态资源（图片、图标、字体等）
  ├── components/     # 公共组件
  │   ├── common/     # 基础UI组件
  │   ├── layout/     # 布局组件
  │   └── business/   # 业务组件
  ├── composables/    # 可复用的组合式函数
  ├── views/          # 页面视图组件
  ├── router/         # 路由配置
  ├── stores/         # Pinia 状态管理
  ├── services/       # API 服务
  ├── utils/          # 工具函数
  ├── styles/         # 全局样式
  ├── types/          # TypeScript 类型定义
  ├── App.vue         # 应用根组件
  └── main.ts         # 应用入口文件
```

### 6.2 组件目录结构

对于复杂组件，应使用以下目录结构：

```
components/
  └── UserProfile/
      ├── index.vue       # 主组件文件
      ├── UserProfileHeader.vue  # 子组件
      ├── UserProfileBody.vue    # 子组件
      └── types.ts        # 类型定义
```

### 6.3 文件组织原则

- **职责分离**：每个文件负责单一职责
- **模块封装**：将相关功能组织在同一个目录下
- **按功能分组**：文件和目录应按功能而非类型分组
- **避免过深嵌套**：目录嵌套不应超过4层

## 7. 性能优化与可访问性规范

### 7.1 性能优化

- **组件懒加载**：使用动态导入实现路由和组件懒加载
- **代码分割**：按路由或功能模块进行代码分割
- **虚拟滚动**：对长列表使用虚拟滚动技术
- **按需加载**：UI库使用按需加载，避免全量引入
- **图片优化**：使用合适尺寸的图片，实现懒加载
- **防抖和节流**：对频繁触发的事件使用防抖和节流

**示例**：
```typescript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard/index.vue')
  }
];

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### 7.2 可访问性（a11y）

- **语义化HTML**：使用适当的HTML元素传达正确的语义
- **ARIA属性**：为交互元素添加适当的ARIA属性
- **键盘导航**：确保所有功能可通过键盘访问
- **色彩对比度**：确保文本和背景的对比度符合WCAG标准
- **焦点管理**：管理焦点状态，提供清晰的视觉反馈

**示例**：
```html
<!-- 推荐 -->
<button aria-label="关闭对话框">✕</button>

<nav aria-label="主导航">
  <!-- 导航链接 -->
</nav>

<!-- 避免 -->
<div class="button" onclick="closeDialog()">✕</div>
```

### 7.3 国际化（i18n）

- **文本提取**：将所有用户可见文本提取到国际化资源文件中
- **避免硬编码**：避免在代码中硬编码用户可见文本
- **格式化考虑**：考虑不同语言的日期、数字和货币格式化
- **RTL支持**：为从右到左的语言提供支持

## 8. 代码审查标准

### 8.1 代码质量检查

- **TypeScript类型检查**：确保无TypeScript错误和警告
- **ESLint规则**：遵循项目的ESLint规则
- **代码格式**：确保代码格式一致（使用Prettier）
- **单元测试**：关键功能应有单元测试覆盖

### 8.2 审查要点

- **功能实现**：代码是否实现了所需功能
- **边界情况**：是否处理了边界情况和异常
- **性能考虑**：是否存在性能问题
- **可维护性**：代码是否易于理解和维护
- **安全性**：是否存在安全隐患（如XSS、CSRF等）

### 8.3 文档完整性

- **代码注释**：关键逻辑是否有适当的注释
- **API文档**：公共API是否有文档说明
- **使用示例**：复杂组件是否有使用示例

## 9. 工具和配置

### 9.1 开发工具

- **编辑器**：推荐使用VS Code
- **扩展**：
  - ESLint
  - Prettier
  - Volar
  - TypeScript Vue Plugin (Volar)
  - Vue Language Features (Volar)

### 9.2 配置文件

项目应包含以下配置文件：

- **.eslintrc.js**：ESLint配置
- **prettier.config.js**：Prettier配置
- **tsconfig.json**：TypeScript配置
- **vite.config.ts**：Vite构建配置

## 10. 总结

遵循这些代码规范有助于提高代码质量、可维护性和团队协作效率。团队成员应熟悉并严格遵守这些规范，在开发过程中不断改进和完善这些标准。

定期回顾和更新代码规范是保持代码库健康的重要措施，确保规范与项目需求和行业最佳实践保持一致。