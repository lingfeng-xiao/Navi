<template>
  <div class="app-layout">
    <!-- 应用导航 -->
    <header class="app-layout__header">
      <div class="app-layout__brand">
        <h1 class="app-layout__title">个人财务管理系统</h1>
      </div>
      <nav class="app-layout__nav">
        <ul class="app-layout__nav-list">
          <li class="app-layout__nav-item">
            <router-link 
              to="/" 
              class="app-layout__nav-link"
              active-class="app-layout__nav-link--active"
            >
              仪表盘
            </router-link>
          </li>
          <li class="app-layout__nav-item">
            <router-link 
              to="/expense" 
              class="app-layout__nav-link"
              active-class="app-layout__nav-link--active"
            >
              支出管理
            </router-link>
          </li>
          <li class="app-layout__nav-item">
            <router-link 
              to="/debt" 
              class="app-layout__nav-link"
              active-class="app-layout__nav-link--active"
            >
              债务管理
            </router-link>
          </li>
          <li class="app-layout__nav-item">
            <router-link 
              to="/settings" 
              class="app-layout__nav-link"
              active-class="app-layout__nav-link--active"
            >
              系统设置
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-layout__content">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="app-layout__footer">
      <p class="app-layout__copyright">&copy; {{ currentYear }} 个人财务管理系统 - 版本 {{ appVersion }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 获取当前年份和应用版本
const currentYear = ref(new Date().getFullYear())
const appVersion = ref('1.0.0-beta.1')
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.app-layout__header {
  background-color: var(--bg-secondary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-layout__brand .app-layout__title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.app-layout__nav-list {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-layout__nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;
}

.app-layout__nav-link:hover,
.app-layout__nav-link--active {
  color: var(--primary-color);
}

.app-layout__nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.app-layout__content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.app-layout__footer {
  background-color: var(--bg-secondary);
  text-align: center;
  padding: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-layout__header {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .app-layout__nav-list {
    margin-top: 1rem;
    gap: 1rem;
  }

  .app-layout__content {
    padding: 1rem;
  }
}
</style>
