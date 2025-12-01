<template>
  <div class="expense-view">
    <div class="content-section">
      <div class="card-header">
        <h1 class="section-title m-0">支出管理</h1>
        <button class="btn btn-primary" @click="showAddModal = true">
          <span class="btn-icon">+</span>
          添加支出
        </button>
      </div>
      
      <!-- 过滤和搜索区域 -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="filter-container">
            <div class="filter-item">
              <label for="category-filter">类别</label>
              <select id="category-filter" v-model="categoryFilter" class="form-control">
                <option value="">全部类别</option>
                <option v-for="category in expenseCategories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-item">
              <label for="date-range">日期范围</label>
              <div class="date-range">
                <input type="date" v-model="dateFrom" class="form-control" placeholder="开始日期">
                <span class="date-separator">至</span>
                <input type="date" v-model="dateTo" class="form-control" placeholder="结束日期">
              </div>
            </div>
            
            <div class="filter-item">
              <label for="search-input">搜索</label>
              <div class="search-input-wrapper">
                <input 
                  type="text" 
                  id="search-input" 
                  v-model="searchQuery"
                  class="form-control"
                  placeholder="搜索描述..."
                >
                <span class="search-icon">🔍</span>
              </div>
            </div>
            
            <div class="filter-item">
              <label>&nbsp;</label>
              <div class="filter-actions">
                <button class="btn btn-secondary" @click="resetFilters">重置</button>
                <button class="btn btn-primary" @click="applyFilters">应用</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 支出统计卡片 -->
      <div class="stats-cards">
        <div class="card stats-card">
          <div class="stats-card-value">{{ formatCurrency(filteredExpensesTotal) }}</div>
          <div class="stats-card-label">总支出</div>
          <div class="stats-card-period">{{ getFilterPeriodText() }}</div>
        </div>
        
        <div class="card stats-card">
          <div class="stats-card-value">{{ formatCurrency(averageExpense) }}</div>
          <div class="stats-card-label">平均支出</div>
          <div class="stats-card-period">{{ getFilterPeriodText() }}</div>
        </div>
        
        <div class="card stats-card">
          <div class="stats-card-value">{{ filteredExpenses.length }} 笔</div>
          <div class="stats-card-label">交易笔数</div>
          <div class="stats-card-period">{{ getFilterPeriodText() }}</div>
        </div>
      </div>
      
      <!-- 支出列表 -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>描述</th>
                <th>类别</th>
                <th>金额</th>
                <th>支付方式</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="paginatedExpenses.length > 0">
                <tr v-for="expense in paginatedExpenses" :key="expense.id">
                  <td>{{ formatDate(expense.date) }}</td>
                  <td>{{ expense.description }}</td>
                  <td>
                    <span 
                      class="badge" 
                      :style="{ backgroundColor: getCategoryColor(expense.category) }"
                    >
                      {{ expense.category }}
                    </span>
                  </td>
                  <td class="text-danger">{{ formatCurrency(expense.amount) }}</td>
                  <td>{{ expense.tags?.join(', ') || '-' }}</td>
                  <td>{{ formatDate(expense.date) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline-secondary" @click="editExpense(expense)">
                        编辑
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteExpense(expense.id)">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="7" class="text-center py-6">
                  <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">暂无支出记录</div>
                    <div class="empty-state-description">点击"添加支出"开始记录</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页控制 -->
        <div class="pagination-container" v-if="filteredExpenses.length > 0">
          <div class="pagination-info">
            显示 {{ startItem }} - {{ endItem }} 项，共 {{ filteredExpenses.length }} 项
          </div>
          <div class="pagination-controls">
            <button 
              class="btn btn-sm btn-outline-secondary" 
              :disabled="currentPage === 1"
              @click="currentPage = currentPage - 1"
            >
              上一页
            </button>
            <span class="pagination-page">{{ currentPage }}</span>
            <button 
              class="btn btn-sm btn-outline-secondary" 
              :disabled="currentPage === totalPages"
              @click="currentPage = currentPage + 1"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑支出模态框 -->
    <div class="modal" v-if="showAddModal || showEditModal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ showEditModal ? '编辑支出' : '添加支出' }}</h2>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="submitExpense">
              <div class="form-group">
                <label for="expense-amount">金额 *</label>
                <div class="input-group">
                  <span class="input-group-prepend">{{ settingsStore.currencySymbol }}</span>
                  <input 
                    type="number" 
                    id="expense-amount" 
                    v-model.number="formData.amount" 
                    class="form-control" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    required
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="expense-description">描述 *</label>
                <input 
                  type="text" 
                  id="expense-description" 
                  v-model="formData.description" 
                  class="form-control" 
                  placeholder="支出描述" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="expense-category">类别 *</label>
                <select 
                  id="expense-category" 
                  v-model="formData.category" 
                  class="form-control" 
                  required
                >
                  <option value="" disabled>选择类别</option>
                  <option 
                    v-for="category in expenseCategories" 
                    :key="category.id" 
                    :value="category.name"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="expense-date">日期 *</label>
                <input 
                  type="date" 
                  id="expense-date" 
                  v-model="formData.date" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="expense-payment-method">支付方式</label>
                <select 
                  id="expense-payment-method" 
                  v-model="formData.paymentMethod" 
                  class="form-control"
                >
                  <option value="" disabled>选择支付方式</option>
                  <option value="现金">现金</option>
                  <option value="信用卡">信用卡</option>
                  <option value="借记卡">借记卡</option>
                  <option value="移动支付">移动支付</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="expense-note">备注</label>
                <textarea 
                  id="expense-note" 
                  v-model="formData.note" 
                  class="form-control" 
                  placeholder="添加备注信息..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                <button type="submit" class="btn btn-primary">
                  {{ showEditModal ? '更新' : '保存' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useSettingsStore } from '@/stores/settings'
import { Expense, Category } from '@/stores/finance'
import { ElMessage } from 'element-plus'

// 使用store
const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

// 响应式数据
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// 过滤条件
const categoryFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const searchQuery = ref('')
const editedExpenseId = ref<string | null>(null)

// 表单数据
const formData = reactive({
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: '现金',
  note: ''
})

// 计算属性：支出类别列表
const expenseCategories = computed(() => {
  return financeStore.categories
})

// 计算属性：过滤后的支出列表
const filteredExpenses = computed(() => {
  return financeStore.expenses.filter(expense => {
    // 类别过滤
    if (categoryFilter.value && expense.category !== categoryFilter.value) {
      return false
    }
    
    // 日期范围过滤
    const expenseDate = new Date(expense.date)
    if (dateFrom.value && expenseDate < new Date(dateFrom.value)) {
      return false
    }
    if (dateTo.value && expenseDate > new Date(dateTo.value)) {
      return false
    }
    
    // 搜索过滤
    if (searchQuery.value && !expense.description.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 计算属性：过滤后的支出总额
const filteredExpensesTotal = computed(() => {
  return filteredExpenses.value.reduce((total, expense) => total + expense.amount, 0)
})

// 计算属性：平均支出
const averageExpense = computed(() => {
  if (filteredExpenses.value.length === 0) return 0
  return filteredExpensesTotal.value / filteredExpenses.value.length
})

// 计算属性：分页后的支出列表
const paginatedExpenses = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredExpenses.value.slice(startIndex, endIndex)
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredExpenses.value.length / itemsPerPage)
})

// 计算属性：当前页起始项
const startItem = computed(() => {
  if (filteredExpenses.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

// 计算属性：当前页结束项
const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredExpenses.value.length)
})

// 方法：格式化货币
const formatCurrency = (amount: number): string => {
  const symbol = settingsStore.currencySymbol
  return `${symbol}${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// 方法：格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

// 方法：获取类别颜色
const getCategoryColor = (categoryName: string): string => {
  const category = financeStore.categories.find(c => c.name === categoryName)
  return category ? category.color : 'var(--text-tertiary)'
}

// 方法：获取过滤周期文本
const getFilterPeriodText = (): string => {
  if (dateFrom.value && dateTo.value) {
    return `${formatDate(dateFrom.value)} 至 ${formatDate(dateTo.value)}`
  } else if (dateFrom.value) {
    return `自 ${formatDate(dateFrom.value)} 起`
  } else if (dateTo.value) {
    return `至 ${formatDate(dateTo.value)} 止`
  } else {
    return '全部时间'
  }
}

// 方法：重置表单
const resetForm = () => {
  formData.amount = 0
  formData.description = ''
  formData.category = ''
  formData.date = new Date().toISOString().split('T')[0]
  formData.paymentMethod = '现金'
  formData.note = ''
  editedExpenseId.value = null
}

// 方法：关闭模态框
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

// 方法：编辑支出
const editExpense = (expense: Expense) => {
  editedExpenseId.value = expense.id
  formData.amount = expense.amount
  formData.description = expense.description
  formData.category = expense.category
  formData.date = expense.date
  formData.tags = expense.tags || []
  showEditModal.value = true
}

// 方法：删除支出
const deleteExpense = (expenseId: string) => {
  if (confirm('确定要删除这条支出记录吗？')) {
    financeStore.deleteExpense(expenseId)
    ElMessage.success('支出记录已删除')
    
    // 如果删除后当前页没有数据，则返回上一页
    if (paginatedExpenses.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
  }
}

// 方法：提交支出（添加或更新）
const submitExpense = () => {
  if (showEditModal.value && editedExpenseId.value) {
    // 更新支出
    financeStore.updateExpense(editedExpenseId.value, formData)
    ElMessage.success('支出记录已更新')
  } else {
    // 添加支出
    financeStore.addExpense({
      ...formData
    })
    ElMessage.success('支出记录已添加')
  }
  
  closeModal()
}

// 方法：应用过滤器
const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
}

// 方法：重置过滤器
const resetFilters = () => {
  categoryFilter.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}
</script>

<style scoped>
.expense-view {
  animation: fadeIn 0.3s ease-out;
}

.filter-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-range .form-control {
  flex: 1;
}

.date-separator {
  padding: 0 0.5rem;
  color: var(--text-secondary);
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-page {
  font-weight: 500;
  min-width: 30px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-container {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    flex-direction: column;
  }
  
  .date-range .form-control {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>