<template>
  <div :class="['card', { 'card--shadow': shadow }]">
    <!-- 卡片头部 -->
    <div v-if="header || $slots.header" class="card__header">
      <div v-if="header" class="card__title">{{ header }}</div>
      <slot name="header"></slot>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card__content">
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div v-if="footer || $slots.footer" class="card__footer">
      <div v-if="footer">{{ footer }}</div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props 定义
interface Props {
  /** 卡片标题 */
  header?: string
  /** 卡片底部内容 */
  footer?: string
  /** 是否显示阴影 */
  shadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shadow: true
})
</script>

<style scoped>
/* 卡片基础样式 */
.card {
  background-color: var(--card-color);
  border-radius: var(--radius-lg);
  border: var(--border-width) solid var(--border-color);
  overflow: hidden;
}

/* 阴影样式 */
.card--shadow {
  box-shadow: var(--shadow);
}

/* 头部样式 */
.card__header {
  padding: var(--spacing-4);
  border-bottom: var(--border-width) solid var(--border-color);
}

.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

/* 内容区域样式 */
.card__content {
  padding: var(--spacing-4);
}

/* 底部样式 */
.card__footer {
  padding: var(--spacing-4);
  border-top: var(--border-width) solid var(--border-color);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .card__header,
  .card__content,
  .card__footer {
    padding: var(--spacing-3);
  }
  
  .card__title {
    font-size: var(--font-size-base);
  }
}
</style>
