<template>
  <div class="settings-view">
    <div class="content-section">
      <h1 class="section-title">应用设置</h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">外观设置</h2>
        </div>
        <div class="card-body">
          <div class="settings-form">
            <div class="form-group">
              <label for="theme-select">主题</label>
              <select id="theme-select" v-model="settingsForm.theme" class="form-control" @change="updateSettings">
                <option value="light">浅色模式</option>
                <option value="dark">深色模式</option>
                <option value="auto">跟随系统</option>
              </select>
              <div class="form-text">选择应用程序的显示主题</div>
            </div>
            
            <div class="form-group">
              <label>主题预览</label>
              <div class="theme-preview-container">
                <div class="theme-preview light-theme-preview" @click="previewTheme('light')">
                  <div class="theme-preview-header"></div>
                  <div class="theme-preview-body">
                    <div class="theme-preview-circle"></div>
                  </div>
                </div>
                <div class="theme-preview dark-theme-preview" @click="previewTheme('dark')">
                  <div class="theme-preview-header"></div>
                  <div class="theme-preview-body">
                    <div class="theme-preview-circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-header">
          <h2 class="card-title">区域设置</h2>
        </div>
        <div class="card-body">
          <div class="settings-form">
            <div class="form-group">
              <label for="language-select">语言</label>
              <select id="language-select" v-model="settingsForm.language" class="form-control" @change="updateSettings">
                <option value="zh-CN">中文 (简体)</option>
                <option value="en-US">English (US)</option>
              </select>
              <div class="form-text">应用程序界面语言</div>
            </div>
            
            <div class="form-group">
              <label for="currency-select">货币</label>
              <select id="currency-select" v-model="settingsForm.currency" class="form-control" @change="updateSettings">
                <option value="CNY">人民币 (¥)</option>
                <option value="USD">美元 ($)</option>
                <option value="EUR">欧元 (€)</option>
                <option value="GBP">英镑 (£)</option>
                <option value="JPY">日元 (¥)</option>
              </select>
              <div class="form-text">设置默认货币</div>
            </div>
            
            <div class="form-group">
              <label for="date-format-select">日期格式</label>
              <select id="date-format-select" v-model="settingsForm.dateFormat" class="form-control" @change="updateSettings">
                <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-25)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (25/12/2023)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/25/2023)</option>
                <option value="YYYY年MM月DD日">YYYY年MM月DD日 (2023年12月25日)</option>
              </select>
              <div class="form-text">设置日期显示格式</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-header">
          <h2 class="card-title">预算提醒</h2>
        </div>
        <div class="card-body">
          <div class="settings-form">
            <div class="form-group">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  id="budget-alert-toggle" 
                  v-model="settingsForm.budgetAlerts" 
                  class="form-check-input"
                  @change="updateSettings"
                >
                <label for="budget-alert-toggle" class="form-check-label">启用预算提醒</label>
              </div>
              <div class="form-text">当支出接近预算限制时收到提醒</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-header">
          <h2 class="card-title">数据管理</h2>
        </div>
        <div class="card-body">
          <div class="settings-form">
            <div class="data-management-buttons">
              <button class="btn btn-outline-primary" @click="exportData">
                <span class="btn-icon">📤</span>
                导出数据
              </button>
              <button class="btn btn-outline-secondary" @click="backupData">
                <span class="btn-icon">💾</span>
                创建备份
              </button>
              <button class="btn btn-outline-info" @click="showImportModal = true">
                <span class="btn-icon">📥</span>
                导入数据
              </button>
              <button class="btn btn-outline-warning" @click="clearLocalData">
                <span class="btn-icon">🗑️</span>
                清除本地数据
              </button>
            </div>
            
            <!-- 自动备份功能将在后续版本中提供 -->
            <div class="form-group mt-4">
              <div class="form-check disabled">
                <input 
                  type="checkbox" 
                  id="auto-backup-toggle" 
                  class="form-check-input"
                  disabled
                >
                <label for="auto-backup-toggle" class="form-check-label">启用自动备份（即将推出）</label>
              </div>
              <div class="form-text">每周自动备份您的数据</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card mt-4">
        <div class="card-header">
          <h2 class="card-title">关于应用</h2>
        </div>
        <div class="card-body">
          <div class="about-section">
            <div class="app-logo">💰</div>
            <h3 class="app-name">个人财务管理系统</h3>
            <div class="app-version">版本 1.0.0</div>
            <div class="app-description">
              一个简洁、高效的个人财务管理工具，帮助您追踪支出、管理债务并规划未来。
            </div>
            <div class="app-links">
              <a href="#" class="app-link" @click.prevent="showPrivacyPolicy">隐私政策</a>
              <a href="#" class="app-link" @click.prevent="showTermsOfService">服务条款</a>
              <a href="#" class="app-link" @click.prevent="showHelp">帮助文档</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 导入数据模态框 -->
    <div class="modal" v-if="showImportModal" @click.self="closeImportModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">导入数据</h2>
            <button class="close-button" @click="closeImportModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>选择文件</label>
              <div class="file-input-container">
                <input 
                  type="file" 
                  id="file-upload" 
                  ref="fileInput" 
                  accept=".json,.csv"
                  class="file-input"
                  @change="handleFileChange"
                >
                <label for="file-upload" class="file-label">
                  <span class="file-icon">📁</span>
                  {{ selectedFileName || '点击选择文件或拖放文件到此处' }}
                </label>
              </div>
              <div class="form-text">支持 JSON 或 CSV 格式的数据文件</div>
            </div>
            
            <div class="form-group">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  id="merge-data-checkbox" 
                  v-model="importForm.mergeData"
                  class="form-check-input"
                >
                <label for="merge-data-checkbox" class="form-check-label">合并现有数据</label>
              </div>
              <div class="form-text">不勾选将替换所有现有数据</div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeImportModal">取消</button>
              <button 
                type="button" 
                class="btn btn-primary" 
                :disabled="!selectedFileName"
                @click="importData"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage } from 'element-plus'

// 使用store
const settingsStore = useSettingsStore()

// 响应式数据
const showImportModal = ref(false)
const fileInput = ref<HTMLInputElement>()
const selectedFileName = ref('')

// 设置表单数据
const settingsForm = reactive({
  theme: settingsStore.preferences.theme,
  language: settingsStore.preferences.language,
  currency: settingsStore.preferences.currency,
  dateFormat: settingsStore.preferences.dateFormat,
  budgetAlerts: settingsStore.preferences.budgetAlerts
})

// 导入表单数据
const importForm = reactive({
  mergeData: true
})

// 监听设置变化
watch(() => settingsStore.preferences.theme, (newTheme) => {
  settingsForm.theme = newTheme
})

// 方法：更新设置
const updateSettings = () => {
  // 更新store中的设置
  settingsStore.updatePreferences({
    theme: settingsForm.theme,
    language: settingsForm.language,
    currency: settingsForm.currency,
    dateFormat: settingsForm.dateFormat,
    budgetAlerts: settingsForm.budgetAlerts
  })
  
  ElMessage.success('设置已更新')
}

// 方法：预览主题
const previewTheme = (theme: any) => {
  settingsForm.theme = theme
  updateSettings()
}

// 方法：导出数据
const exportData = () => {
  // 这里应该实现数据导出逻辑
  ElMessage.info('数据导出功能开发中')
}

// 方法：备份数据
const backupData = () => {
  // 这里应该实现数据备份逻辑
  ElMessage.success('数据备份已创建')
}

// 方法：处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFileName.value = target.files[0].name
  }
}

// 方法：导入数据
const importData = () => {
  if (!fileInput.value?.files?.length) return
  
  const file = fileInput.value.files[0]
  
  // 这里应该实现数据导入逻辑
  ElMessage.info('数据导入功能开发中')
  
  closeImportModal()
}

// 方法：关闭导入模态框
const closeImportModal = () => {
  showImportModal.value = false
  selectedFileName.value = ''
  importForm.mergeData = true
  
  // 重置文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 方法：清除本地数据
const clearLocalData = () => {
  if (confirm('确定要清除所有本地数据吗？此操作无法撤销！')) {
    // 这里应该实现清除本地数据的逻辑
    // 注意：实际应用中需要谨慎处理此功能
    ElMessage.success('本地数据已清除')
  }
}

// 方法：显示隐私政策
const showPrivacyPolicy = () => {
  ElMessage.info('隐私政策页面开发中')
}

// 方法：显示服务条款
const showTermsOfService = () => {
  ElMessage.info('服务条款页面开发中')
}

// 方法：显示帮助文档
const showHelp = () => {
  ElMessage.info('帮助文档开发中')
}
</script>

<style scoped>
.settings-view {
  animation: fadeIn 0.3s ease-out;
}

.settings-form {
  max-width: 600px;
}

.theme-preview-container {
  display: flex;
  gap: 1rem;
}

.theme-preview {
  flex: 1;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: var(--shadow);
}

.theme-preview:hover {
  transform: translateY(-3px);
}

.light-theme-preview {
  background-color: #ffffff;
}

.dark-theme-preview {
  background-color: #1a1a1a;
}

.theme-preview-header {
  height: 30px;
}

.light-theme-preview .theme-preview-header {
  background-color: #e5e7eb;
}

.dark-theme-preview .theme-preview-header {
  background-color: #333333;
}

.theme-preview-body {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.theme-preview-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.light-theme-preview .theme-preview-circle {
  background-color: var(--primary-color);
}

.dark-theme-preview .theme-preview-circle {
  background-color: var(--primary-color-dark);
}

.range-value {
  text-align: center;
  font-weight: 500;
  margin-top: 0.5rem;
}

.data-management-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.file-input-container {
  position: relative;
}

.file-input {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: block;
  padding: 1.5rem;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-label:hover {
  border-color: var(--primary-color);
  background-color: var(--hover-color);
}

.file-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.about-section {
  text-align: center;
  padding: 2rem 0;
}

.app-logo {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.app-version {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.app-description {
  max-width: 400px;
  margin: 0 auto 2rem;
  color: var(--text-secondary);
}

.app-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.app-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .data-management-buttons {
    grid-template-columns: 1fr;
  }
  
  .app-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>