import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 主题类型
export type Theme = 'light' | 'dark' | 'auto'

// 用户偏好设置接口
export interface UserPreferences {
  theme: Theme
  language: string
  currency: string
  dateFormat: string
  budgetAlerts: boolean
}

// 应用设置store
export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const preferences = ref<UserPreferences>({
    theme: 'auto',
    language: 'zh-CN',
    currency: 'CNY',
    dateFormat: 'YYYY-MM-DD',
    budgetAlerts: true
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentTheme = computed(() => {
    if (preferences.value.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return preferences.value.theme
  })

  const isDarkMode = computed(() => currentTheme.value === 'dark')

  // 货币符号映射
  const currencySymbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    KRW: '₩',
    HKD: 'HK$'
  }

  const currencySymbol = computed(() => {
    return currencySymbols[preferences.value.currency] || preferences.value.currency
  })

  // 方法
  function updatePreferences(newPreferences: Partial<UserPreferences>) {
    try {
      preferences.value = { ...preferences.value, ...newPreferences }
      
      // 应用主题
      applyTheme()
      
      // 保存到本地存储
      saveToLocalStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新设置失败'
    }
  }

  function applyTheme() {
    // 移除所有主题类
    document.documentElement.classList.remove('light-theme', 'dark-theme')
    
    // 添加当前主题类
    document.documentElement.classList.add(`${currentTheme.value}-theme`)
    
    // 设置主题属性
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem('finance-settings', JSON.stringify(preferences.value))
    } catch (err) {
      console.error('保存设置到本地存储失败:', err)
    }
  }

  function loadFromLocalStorage() {
    try {
      const savedSettings = localStorage.getItem('finance-settings')
      if (savedSettings) {
        preferences.value = JSON.parse(savedSettings)
        applyTheme()
      }
    } catch (err) {
      console.error('从本地存储加载设置失败:', err)
    }
  }

  function resetSettings() {
    preferences.value = {
      theme: 'auto',
      language: 'zh-CN',
      currency: 'CNY',
      dateFormat: 'YYYY-MM-DD',
      budgetAlerts: true
    }
    applyTheme()
    saveToLocalStorage()
  }

  // 监听系统主题变化（如果设置为自动）
  function setupThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleThemeChange = () => {
      if (preferences.value.theme === 'auto') {
        applyTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleThemeChange)
    
    // 返回清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }

  return {
    // 状态
    preferences,
    isLoading,
    error,
    // 计算属性
    currentTheme,
    isDarkMode,
    currencySymbol,
    // 方法
    updatePreferences,
    applyTheme,
    saveToLocalStorage,
    loadFromLocalStorage,
    resetSettings,
    setupThemeListener
  }
})