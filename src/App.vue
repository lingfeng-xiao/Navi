<template>
  <div class="app-container">
    <!-- 应用导航 -->
    <nav class="app-nav">
      <div class="nav-brand">
        <h1>个人财务管理系统</h1>
      </div>
      <div class="nav-menu">
        <router-link to="/">仪表盘</router-link>
        <router-link to="/expense">支出管理</router-link>
        <router-link to="/debt">债务管理</router-link>
        <router-link to="/settings">系统设置</router-link>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>&copy; {{ currentYear }} 个人财务管理系统 - 版本 {{ appVersion }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前年份和应用版本
const currentYear = ref(new Date().getFullYear())
const appVersion = ref('1.0.0-beta.1')
const route = useRoute()

// 页面切换时的滚动到顶部
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.app-nav {
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

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: var(--primary-color);
}

.nav-menu a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  background-color: var(--bg-secondary);
  text-align: center;
  padding: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-nav {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .nav-menu {
    margin-top: 1rem;
    gap: 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>