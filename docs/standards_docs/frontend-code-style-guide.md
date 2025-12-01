# 前端代码规范文档

## 1. 引言

### 1.1 文档目的

本文档旨在规范团队在前端开发过程中的代码风格和实践，确保代码的一致性、可读性和可维护性。遵循这些规范有助于提高团队协作效率，减少bug，降低维护成本，并确保项目的长期健康发展。

### 1.2 适用范围

本规范适用于基于Vue 3、TypeScript、Pinia和Vue Router开发的个人财务管理系统，涵盖了TypeScript/JavaScript、Vue组件、样式、文件结构等各个方面。

### 1.3 术语定义

- **SFC**: Single File Component，单文件组件
- **BEM**: Block-Element-Modifier，一种CSS命名方法论
- **a11y**: Accessibility，可访问性
- **i18n**: Internationalization，国际化
- **SSR**: Server-Side Rendering，服务端渲染
- **CSR**: Client-Side Rendering，客户端渲染

## 2. 基础语言规范

### 2.1 TypeScript 最佳实践

#### 2.1.1 类型使用

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

type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

function getUser(id: number): Promise<User | null> {
  // 实现
  return Promise.resolve(null);
}

// 避免
function getUser(id: any): any {
  // 实现
  return null;
}
```

#### 2.1.2 变量与常量

- **使用const和let**：始终使用`const`声明不可变变量，使用`let`声明可变变量
- **禁止使用var**：避免使用`var`声明变量，防止作用域问题
- **变量初始化**：声明变量时必须初始化
- **变量命名**：使用小驼峰命名法（camelCase）
- **常量命名**：使用全大写和下划线（SNAKE_CASE）命名常量

**示例**：
```typescript
// 推荐
const MAX_COUNT = 100;
const DEFAULT_TIMEOUT = 3000;
let counter = 0;
const userNames: string[] = [];

// 避免
var max_count = 100;
let Counter;
```

#### 2.1.3 函数编写

- **函数声明**：优先使用箭头函数（对于简单函数）和函数声明（对于复杂函数）
- **函数签名**：明确指定参数类型和返回类型
- **默认参数**：使用默认参数简化条件判断
- **剩余参数**：使用剩余参数（...）处理可变数量的参数
- **禁止使用arguments**：使用剩余参数替代`arguments`对象
- **JSDoc注释**：为公共函数添加完整的JSDoc注释

**示例**：
```typescript
// 推荐
/**
 * 计算两个数字的和
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两个数字的和
 */
const sum = (a: number, b: number): number => a + b;

/**
 * 获取API数据
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise包装的JSON响应
 */
async function fetchData<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 避免
function sum(a, b) {
  return a + b;
}
```

### 2.2 JavaScript 语言特性

#### 2.2.1 异步编程

- **使用async/await**：优先使用`async/await`处理异步操作，避免嵌套回调
- **Promise处理**：正确处理Promise的`then`、`catch`和`finally`
- **错误处理**：使用try/catch捕获异步错误
- **避免Promise嵌套**：避免多层嵌套的Promise链

**示例**：
```typescript
// 推荐
async function processUserData(userId: number): Promise<void> {
  try {
    const user = await getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const userActivity = await getUserActivity(userId);
    return {
      ...user,
      activity: userActivity
    };
  } catch (error) {
    console.error('Error processing user data:', error);
    // 适当处理错误，如通知用户或使用默认值
    throw error;
  }
}

// 避免 - 嵌套Promise
function processUserData(userId: number): Promise<any> {
  return getUser(userId)
    .then(user => {
      return getUserActivity(userId)
        .then(activity => {
          return { ...user, activity };
        });
    });
}
```

#### 2.2.2 数组和对象操作

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
const sum = numbers.reduce((acc, current) => acc + current, 0);

const { name, age, address } = user;
const userCopy = { ...user, active: true };

const userName = user?.profile?.name ?? 'Unknown';
const userAge = user?.age ?? 0;

// 避免
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}

const userName = user && user.profile && user.profile.name ? user.profile.name : 'Unknown';
```

#### 2.2.3 错误处理

- **明确的错误类型**：创建自定义错误类以提供更有意义的错误信息
- **错误日志**：记录详细的错误信息，包括上下文
- **用户反馈**：对于用户可操作的错误，提供友好的用户反馈
- **错误恢复**：实现适当的错误恢复机制，避免应用崩溃

**示例**：
```typescript
// 自定义错误类型
class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number, public errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

try {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
  
  const response = await fetch('/api/submit');
  if (!response.ok) {
    throw new ApiError('API request failed', response.status);
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation error in field ${error.field}: ${error.message}`);
    showErrorMessage(`Please enter a valid ${error.field}`);
  } else if (error instanceof ApiError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
    showErrorMessage('We encountered an issue with our service. Please try again later.');
  } else {
    console.error('Unexpected error:', error);
    showErrorMessage('An unexpected error occurred');
  }
}
```

## 3. Vue 3 组件开发规范

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

### 3.2 组合式API最佳实践

- **使用<script setup>**：优先使用`<script setup>`语法
- **响应式数据**：使用`ref`和`reactive`创建响应式数据
  - 使用`ref`处理基本类型和需要解构的值
  - 使用`reactive`处理复杂对象
- **计算属性**：使用`computed`创建依赖响应式数据的计算值
- **监听器**：使用`watch`和`watchEffect`监听数据变化
  - 使用`watch`监听特定数据源
  - 使用`watchEffect`监听副作用
- **生命周期钩子**：使用组合式API提供的生命周期钩子函数

**示例**：
```vue
<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 状态管理
const count = ref(0);
const userStore = useUserStore();
const route = useRoute();

// 计算属性
const doubleCount = computed(() => count.value * 2);
const isAuthenticated = computed(() => userStore.isLoggedIn);

// 监听器
watch(count, (newCount, oldCount) => {
  console.log(`Count changed from ${oldCount} to ${newCount}`);
}, { deep: false });

// 副作用监听
watchEffect(() => {
  // 当依赖项变化时执行
  document.title = `Count: ${count.value}`;
});

// 方法
function increment() {
  count.value++;
}

// 生命周期
onMounted(() => {
  console.log('Component mounted');
  // 初始化逻辑
});

onUnmounted(() => {
  console.log('Component unmounted');
  // 清理逻辑
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

interface UserCardProps {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest';
  avatarUrl?: string;
  isActive?: boolean;
}

// 定义props
const props = defineProps<UserCardProps>();

// 定义事件
const emit = defineEmits<{
  (e: 'user-click', userId: number): void;
  (e: 'role-change', userId: number, newRole: UserCardProps['role']): void;
}>();

// 事件处理器
function handleUserClick() {
  emit('user-click', props.id);
}

function changeUserRole(newRole: UserCardProps['role']) {
  emit('role-change', props.id, newRole);
}
</script>

<template>
  <div class="user-card" @click="handleUserClick">
    <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" />
    <h3>{{ name }}</h3>
    <p>{{ email }}</p>
    <span :class="['role-badge', `role-${role}`]">{{ role }}</span>
    <div v-if="isActive" class="active-indicator"></div>
  </div>
</template>
```

### 3.4 组件通信模式

- **父子组件**：使用props和emits进行通信
- **跨组件通信**：使用Pinia store管理共享状态
- **依赖注入**：对于多层级组件，使用provide/inject模式
- **避免prop drilling**：避免通过多层组件传递props，优先使用store或provide/inject

**示例 - Provide/Inject**：
```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue';

const theme = ref('light');
const updateTheme = (newTheme: 'light' | 'dark') => {
  theme.value = newTheme;
};

// 提供值和方法
provide('theme', {
  current: theme,
  update: updateTheme
});
</script>

<!-- DeepChild.vue -->
<script setup lang="ts">
import { inject } from 'vue';

interface ThemeProvider {
  current: Ref<'light' | 'dark'>;
  update: (theme: 'light' | 'dark') => void;
}

// 注入并使用
const theme = inject<ThemeProvider>('theme')!;

// 使用注入的值和方法
function toggleTheme() {
  const newTheme = theme.current.value === 'light' ? 'dark' : 'light';
  theme.update(newTheme);
}
</script>
```

### 3.5 模板语法和风格

- **表达式简洁**：模板中的表达式保持简单，复杂逻辑应移至脚本部分
- **v-for和key**：使用v-for时必须提供唯一的key属性
- **条件渲染**：优先使用v-if/v-else，仅当元素频繁切换显示状态时使用v-show
- **事件处理**：事件处理器函数应定义在脚本部分
- **避免内联样式**：避免在模板中使用内联样式，使用CSS类代替
- **使用template元素**：对于不需要渲染的包装元素，使用template标签

**示例**：
```vue
<template>
  <div class="user-list">
    <!-- 使用template进行条件分组 -->
    <template v-if="loading">
      <div class="loading-spinner"></div>
      <p>加载用户列表中...</p>
    </template>
    
    <template v-else-if="error">
      <div class="error-message">
        <p>{{ error.message }}</p>
        <button @click="fetchUsers">重试</button>
      </div>
    </template>
    
    <template v-else-if="users.length === 0">
      <div class="empty-state">
        <p>暂无用户数据</p>
      </div>
    </template>
    
    <template v-else>
      <!-- 列表渲染，使用唯一key -->
      <div 
        v-for="user in users" 
        :key="user.id" 
        @click="handleUserClick(user)"
        :class="['user-item', { 'user-item--active': user.id === selectedUserId }]"
      >
        {{ user.name }}
      </div>
    </template>
  </div>
</template>
```

## 4. 样式与UI规范

### 4.1 CSS 架构

- **组件样式隔离**：使用scoped属性隔离组件样式
- **全局样式**：仅在全局样式文件中定义全局样式
- **主题变量**：使用CSS变量定义主题相关样式
- **样式导入**：使用`@import`导入共享样式文件

**示例**：
```vue
<!-- 组件内样式 -->
<style scoped>
.user-card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
```

### 4.2 命名规范

- **BEM命名法**：组件样式使用BEM（Block-Element-Modifier）命名约定
- **语义化类名**：使用具有语义的类名，避免基于样式的命名
- **短横线连接**：使用kebab-case（短横线连接）命名CSS类和ID

**示例**：
```css
/* 推荐 - BEM 命名法 */
.user-card {
  /* 块样式 */
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.user-card__header {
  /* 元素样式 */
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.user-card__body {
  padding: 16px;
}

.user-card--active {
  /* 修饰器样式 */
  border: 2px solid #007bff;
}

/* 避免 - 基于样式的命名 */
.red-box {
  background-color: red;
  width: 100px;
  height: 100px;
}
```

### 4.3 CSS 最佳实践

- **避免ID选择器**：优先使用类选择器，避免使用ID选择器
- **避免!important**：尽量避免使用!important，通过提高选择器特异性解决问题
- **简写属性**：合理使用CSS简写属性
- **单位统一**：使用rem/em作为尺寸单位，使用无单位值（如0）
- **响应式设计**：使用媒体查询实现响应式设计
- **Flexbox/Grid**：优先使用Flexbox和Grid进行布局

**示例**：
```css
/* 推荐 */
.container {
  margin: 0 auto;
  padding: 1rem;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
  
  .card {
    flex: 1 1 100%;
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
- **减少重排**：避免在动画中改变宽度、高度、位置等会触发重排的属性

**示例**：
```vue
<template>
  <div class="fade-container">
    <transition name="fade">
      <div v-if="show" class="content">内容</div>
    </transition>
    
    <transition name="slide">
      <div v-if="showPanel" class="panel">侧边面板</div>
    </transition>
  </div>
</template>

<style>
/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动过渡 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
```

## 5. 状态管理规范

### 5.1 Pinia Store 结构

- **模块化**：按功能模块划分store
- **状态定义**：使用TypeScript定义state类型
- **Getters**：使用getters计算派生状态
- **Actions**：使用actions处理异步操作和业务逻辑
- **严格模式**：始终使用Pinia的严格模式，确保状态变更可追踪

**示例**：
```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { api } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  }),

  getters: {
    // 计算属性
    userName: (state) => state.currentUser?.name || '',
    isAdmin: (state) => state.currentUser?.role === 'admin',
  },

  actions: {
    // 异步操作
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.login(email, password);
        this.currentUser = response.user;
        this.isLoggedIn = true;
        localStorage.setItem('token', response.token);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.currentUser = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
    
    async fetchUserProfile() {
      if (!this.isLoggedIn) return;
      
      this.loading = true;
      try {
        const userData = await api.getUserProfile();
        this.currentUser = userData;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch user profile';
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### 5.2 状态管理最佳实践

- **最小化共享状态**：只将真正需要共享的状态放在store中
- **避免过度分散**：相关状态应组织在同一个store中
- **状态持久化**：关键状态（如用户认证信息）应考虑持久化存储
- **避免直接修改状态**：组件中应通过actions修改状态，而非直接修改
- **避免store膨胀**：对于简单的组件间通信，考虑使用provide/inject或props/emits

## 6. 路由与导航规范

### 6.1 路由配置

- **路由类型**：使用TypeScript定义路由类型和meta信息
- **懒加载**：使用动态导入实现组件懒加载
- **路由命名**：使用清晰、语义化的路由名称
- **路由顺序**：路由定义应按优先级排序，具体路由应在通配符路由之前

**示例**：
```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 定义路由元信息类型
interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  keepAlive?: boolean;
}

export interface AppRouteRecordRaw extends RouteRecordRaw {
  meta?: RouteMeta;
  children?: AppRouteRecordRaw[];
}

const routes: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users/index.vue'),
    meta: {
      title: '用户管理',
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  // 404页面应放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      title: '页面未找到',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
```

### 6.2 导航守卫

- **全局守卫**：使用全局导航守卫处理权限验证和页面标题设置
- **路由守卫**：使用路由级别的守卫处理特定路由的逻辑
- **组件守卫**：使用组件级别的守卫处理组件生命周期相关的路由逻辑

**示例**：
```typescript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 财务管理系统` : '财务管理系统';
  
  const userStore = useUserStore();
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 重定向到登录页
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    });
  } 
  // 检查是否需要管理员权限
  else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    // 无权限，重定向到首页
    next({
      name: 'Dashboard',
    });
  }
  else {
    next();
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  // 可以在这里添加路由切换后的分析或跟踪代码
  console.log(`Navigation from ${from.path} to ${to.path}`);
});
```

## 7. 文件与目录结构

### 7.1 标准目录结构

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
  ├── services/       # API 服务和数据访问
  ├── utils/          # 工具函数
  ├── styles/         # 全局样式
  ├── types/          # TypeScript 类型定义
  ├── constants/      # 常量定义
  ├── hooks/          # 自定义钩子
  ├── App.vue         # 应用根组件
  └── main.ts         # 应用入口文件
```

### 7.2 组件目录结构

对于复杂组件，应使用以下目录结构：

```
components/
  └── UserProfile/         # 组件目录
      ├── index.vue        # 主组件文件（导出组件）
      ├── UserProfileHeader.vue  # 子组件
      ├── UserProfileBody.vue    # 子组件
      ├── UserProfileFooter.vue  # 子组件
      ├── types.ts         # 类型定义
      └── utils.ts         # 组件专用工具函数
```

### 7.3 文件命名规范

- **组件文件**：使用PascalCase（大驼峰）命名组件文件
- **非组件文件**：使用kebab-case（短横线连接）命名非组件文件
- **目录命名**：使用kebab-case（短横线连接）命名目录
- **类型文件**：类型定义文件应命名为`types.ts`或特定领域名称+`.ts`

**示例**：
```
components/
  UserProfile.vue
  UserList.vue
views/
  Dashboard/index.vue
utils/
  format-helpers.ts
  validation-rules.ts
types/
  finance.ts
  user.ts
```

## 8. 性能优化指南

### 8.1 资源优化

- **代码分割**：按路由或功能模块进行代码分割
- **懒加载**：实现组件、图片和其他资源的懒加载
- **按需导入**：UI库使用按需加载，避免全量引入
- **Tree Shaking**：确保代码支持tree shaking，避免死代码

**示例 - 代码分割**：
```typescript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue'),
  },
];

// 组件懒加载
const LazyChart = defineAsyncComponent(() => import('@/components/common/Chart.vue'));
```

### 8.2 渲染优化

- **虚拟滚动**：对长列表使用虚拟滚动技术
- **KeepAlive**：使用`<KeepAlive>`缓存不活跃的组件
- **避免不必要的重新渲染**：使用`v-once`、`v-memo`和函数式组件优化渲染
- **计算属性缓存**：使用计算属性缓存计算结果

**示例 - KeepAlive**：
```vue
<template>
  <div class="app-layout">
    <header>应用头部</header>
    <main>
      <KeepAlive :include="['Dashboard', 'UserList']">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </KeepAlive>
    </main>
    <footer>应用底部</footer>
  </div>
</template>
```

### 8.3 运行时优化

- **防抖和节流**：对频繁触发的事件使用防抖和节流
- **事件委托**：使用事件委托处理大量子元素的事件
- **避免内存泄漏**：正确清理事件监听器和定时器
- **优化大型列表**：使用分页、虚拟列表或无限滚动

**示例 - 防抖和节流**：
```typescript
// utils/debounce-throttle.ts

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 使用示例
const searchInput = ref('');
const debouncedSearch = debounce((query: string) => {
  // 执行搜索逻辑
  searchUsers(query);
}, 300);

watch(searchInput, (newQuery) => {
  debouncedSearch(newQuery);
});
```

## 9. 安全与可访问性

### 9.1 安全实践

- **XSS防护**：避免直接拼接HTML，使用Vue的文本插值和v-html时注意安全
- **CSRF防护**：使用适当的CSRF令牌机制
- **输入验证**：对所有用户输入进行验证和净化
- **敏感数据处理**：避免在客户端存储敏感信息
- **安全的API请求**：使用HTTPS，实现适当的认证和授权

**示例 - 安全的HTML处理**：
```vue
<template>
  <!-- 安全方式：Vue会自动转义 -->
  <div>{{ userProvidedContent }}</div>
  
  <!-- 不安全：直接插入HTML，可能导致XSS -->
  <!-- <div v-html="userProvidedContent"></div> -->
  
  <!-- 更安全的方式：使用DOMPurify净化HTML -->
  <div v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DOMPurify from 'dompurify';

const userProvidedContent = ref('<script>alert("XSS")</script>');

// 使用DOMPurify净化HTML
const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(userProvidedContent.value);
});
</script>
```

### 9.2 可访问性（a11y）规范

- **语义化HTML**：使用适当的HTML元素传达正确的语义
- **ARIA属性**：为交互元素添加适当的ARIA属性
- **键盘导航**：确保所有功能可通过键盘访问
- **色彩对比度**：确保文本和背景的对比度符合WCAG标准
- **焦点管理**：管理焦点状态，提供清晰的视觉反馈
- **屏幕阅读器支持**：确保页面内容可被屏幕阅读器正确读取

**示例 - 可访问的组件**：
```vue
<template>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-header">
      <h2 id="modal-title">{{ title }}</h2>
      <button 
        @click="closeModal" 
        aria-label="关闭对话框"
        class="close-button"
      >
        ✕
      </button>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
    <div class="modal-footer">
      <button 
        @click="closeModal" 
        class="btn btn-secondary"
      >
        取消
      </button>
      <button 
        @click="confirmAction" 
        class="btn btn-primary"
        :disabled="isLoading"
      >
        {{ isLoading ? '处理中...' : '确认' }}
      </button>
    </div>
  </div>
</template>
```

### 9.3 国际化（i18n）

- **文本提取**：将所有用户可见文本提取到国际化资源文件中
- **避免硬编码**：避免在代码中硬编码用户可见文本
- **格式化考虑**：考虑不同语言的日期、数字和货币格式化
- **RTL支持**：为从右到左的语言提供支持

**示例 - 使用vue-i18n**：
```typescript
// i18n/index.ts
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome to Finance App',
    dashboard: {
      title: 'Dashboard',
      overview: 'Overview',
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
  },
  zh: {
    welcome: '欢迎使用财务管理系统',
    dashboard: {
      title: '仪表盘',
      overview: '概览',
    },
    actions: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'en',
  messages,
});

export default i18n;

// 在组件中使用
// <template>
//   <h1>{{ t('welcome') }}</h1>
//   <button>{{ t('actions.save') }}</button>
// </template>
```

## 10. 测试与质量保证

### 10.1 测试策略

- **单元测试**：测试独立的组件、函数和模块
- **集成测试**：测试多个组件或模块的协作
- **端到端测试**：测试完整的用户流程
- **测试覆盖率**：保持高测试覆盖率，重点关注核心功能

### 10.2 代码审查标准

- **TypeScript类型检查**：确保无TypeScript错误和警告
- **ESLint规则**：遵循项目的ESLint规则
- **代码格式**：确保代码格式一致（使用Prettier）
- **功能实现**：代码是否实现了所需功能
- **边界情况**：是否处理了边界情况和异常
- **性能考虑**：是否存在性能问题
- **可维护性**：代码是否易于理解和维护
- **安全性**：是否存在安全隐患（如XSS、CSRF等）

### 10.3 代码质量工具

- **ESLint**：静态代码分析，检测潜在问题
- **Prettier**：代码格式化，保持一致的代码风格
- **TypeScript**：类型检查，捕获类型错误
- **Vitest**：单元测试和集成测试
- **Cypress**：端到端测试

## 11. 开发工具与配置

### 11.1 推荐开发环境

- **编辑器**：VS Code
- **扩展**：
  - ESLint
  - Prettier - Code formatter
  - Volar
  - TypeScript Vue Plugin (Volar)
  - Vue Language Features (Volar)
  - GitLens
  - Code Spell Checker

### 11.2 配置文件

项目应包含以下配置文件：

- **.eslintrc.js**：ESLint配置
- **prettier.config.js**：Prettier配置
- **tsconfig.json**：TypeScript配置
- **vite.config.ts**：Vite构建配置
- **.editorconfig**：编辑器配置
- **.gitignore**：Git忽略文件配置

## 12. 总结与最佳实践

### 12.1 核心原则

- **一致性**：在整个项目中保持一致的代码风格和实践
- **可读性**：编写清晰、易懂的代码
- **可维护性**：设计易于维护和扩展的系统
- **性能优先**：始终考虑性能影响
- **安全性**：遵循安全最佳实践
- **可访问性**：确保应用对所有用户可用

### 12.2 持续改进

- **定期代码审查**：进行定期的代码审查，确保代码质量
- **规范更新**：根据项目需求和行业最佳实践，定期更新代码规范
- **知识分享**：团队成员之间分享经验和最佳实践
- **工具优化**：持续优化开发工具和工作流程

遵循这些规范有助于创建高质量、可维护的前端代码，提高团队协作效率，并为用户提供优秀的体验。团队成员应熟悉并严格遵守这些规范，在开发过程中不断改进和完善代码质量。