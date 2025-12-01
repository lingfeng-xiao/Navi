<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--fullwidth': fullWidth },
      { 'btn--disabled': disabled },
      { 'btn--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="onClick"
    :type="type"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
interface Props {
  /** 按钮变体类型 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否占满父容器宽度 */
  fullWidth?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 按钮文本标签 */
  label?: string
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  fullWidth: false,
  disabled: false,
  loading: false,
  label: '',
  type: 'button',
})

// Emits 定义
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 点击处理函数
const onClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 基础按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  line-height: 1.5;
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  outline: none;
  user-select: none;
}

/* 按钮变体样式 */
.btn--primary {
  background-color: var(--primary-color);
  color: white;
}

.btn--primary:hover:not(.btn--disabled):not(.btn--loading) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.btn--primary:focus {
  box-shadow: var(--focus-ring);
}

.btn--secondary {
  background-color: var(--surface-color);
  color: var(--text-primary);
}

.btn--secondary:hover:not(.btn--disabled):not(.btn--loading) {
  background-color: var(--divider-color);
  transform: translateY(-1px);
}

.btn--secondary:focus {
  box-shadow: var(--focus-ring);
}

.btn--outline {
  background-color: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn--outline:hover:not(.btn--disabled):not(.btn--loading) {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.btn--outline:focus {
  box-shadow: var(--focus-ring);
}

.btn--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.btn--ghost:hover:not(.btn--disabled):not(.btn--loading) {
  background-color: var(--surface-color);
  transform: translateY(-1px);
}

.btn--danger {
  background-color: var(--error-color);
  color: white;
}

.btn--danger:hover:not(.btn--disabled):not(.btn--loading) {
  background-color: #DC2626;
  transform: translateY(-1px);
}

.btn--danger:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

/* 按钮尺寸 */
.btn--small {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-sm);
}

.btn--medium {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-base);
}

.btn--large {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-lg);
}

/* 特殊状态 */
.btn--fullwidth {
  width: 100%;
}

.btn--disabled,
.btn--loading {
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
  transform: none !important;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .btn--large {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-base);
  }
}
</style>
