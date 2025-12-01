<template>
  <div class="debt-view">
    <div class="content-section">
      <div class="card-header">
        <h1 class="section-title m-0">债务管理</h1>
        <button class="btn btn-primary" @click="showAddModal = true">
          <span class="btn-icon">+</span>
          添加债务
        </button>
      </div>
      
      <!-- 债务概览卡片 -->
      <div class="debt-overview-cards">
        <div class="card stats-card">
          <div class="stats-card-icon">💳</div>
          <div class="stats-card-value">{{ formatCurrency(totalDebt) }}</div>
          <div class="stats-card-label">总债务</div>
          <div class="stats-card-detail">共有 {{ debts.length }} 笔债务</div>
        </div>
        
        <div class="card stats-card">
          <div class="stats-card-icon">📅</div>
          <div class="stats-card-value">{{ upcomingPayments.length }}</div>
          <div class="stats-card-label">待还款项</div>
          <div class="stats-card-detail">
            {{ formatCurrency(upcomingPaymentAmount) }} 待支付
          </div>
        </div>
        
        <div class="card stats-card">
          <div class="stats-card-icon">📊</div>
          <div class="stats-card-value">{{ formatCurrency(totalInterest) }}</div>
          <div class="stats-card-label">应付利息</div>
          <div class="stats-card-detail">基于当前利率计算</div>
        </div>
      </div>
      
      <!-- 债务列表 -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">债务列表</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>债务名称</th>
                <th>总额</th>
                <th>剩余金额</th>
                <th>利率</th>
                <th>期限</th>
                <th>到期日</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="debts.length > 0">
                <tr v-for="debt in debts" :key="debt.id">
                  <td>{{ debt.name }}</td>
                  <td>{{ formatCurrency(debt.totalAmount || debt.principal) }}</td>
                  <td class="text-danger">{{ formatCurrency(debt.remainingAmount) }}</td>
                  <td>{{ debt.interestRate }}%</td>
                  <td>{{ debt.term }} 个月</td>
                  <td>{{ formatDate(debt.dueDate) }}</td>
                  <td>
                    <span class="badge" :class="getDebtStatusClass(debt.status)">
                      {{ getDebtStatusText(debt.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline-secondary" @click="viewDebtDetails(debt)">
                        详情
                      </button>
                      <button class="btn btn-sm btn-outline-primary" @click="addPayment(debt)">
                        还款
                      </button>
                      <button class="btn btn-sm btn-outline-secondary" @click="editDebt(debt)">
                        编辑
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteDebt(debt.id)">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="9" class="text-center py-6">
                  <div class="empty-state">
                    <div class="empty-state-icon">💳</div>
                    <div class="empty-state-title">暂无债务记录</div>
                    <div class="empty-state-description">点击"添加债务"开始记录</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 近期还款计划 -->
      <div class="card mt-4">
        <div class="card-header">
          <h2 class="card-title">近期还款计划</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>债务名称</th>
                <th>还款日期</th>
                <th>还款金额</th>
                <th>本金</th>
                <th>利息</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="upcomingPayments.length > 0">
                <tr v-for="payment in upcomingPayments" :key="payment.id">
                  <td>{{ payment.debtName }}</td>
                  <td :class="isOverdue(payment.date) ? 'text-danger' : ''">
                    {{ formatDate(payment.date) }}
                  </td>
                  <td class="text-danger">{{ formatCurrency(payment.amount) }}</td>
                  <td>{{ formatCurrency(payment.principal) }}</td>
                  <td>{{ formatCurrency(payment.interest) }}</td>
                  <td>
                    <span class="badge" :class="getPaymentStatusClass(payment.status)">
                      {{ getPaymentStatusText(payment.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        v-if="payment.status !== 'completed'"
                        class="btn btn-sm btn-primary" 
                        @click="markPaymentAsCompleted(payment.id)"
                      >
                        标记完成
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="7" class="text-center py-6">
                  <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <div class="empty-state-title">暂无待还款项</div>
                    <div class="empty-state-description">所有还款计划已完成</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑债务模态框 -->
    <div class="modal" v-if="showAddModal || showEditModal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ showEditModal ? '编辑债务' : '添加债务' }}</h2>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="submitDebt">
              <div class="form-group">
                <label for="debt-name">债务名称 *</label>
                <input 
                  type="text" 
                  id="debt-name" 
                  v-model="debtForm.name" 
                  class="form-control" 
                  placeholder="例如：信用卡、房贷、车贷等" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="debt-type">债务类型 *</label>
                <select 
                  id="debt-type" 
                  v-model="debtForm.type" 
                  class="form-control" 
                  required
                >
                  <option value="" disabled>选择债务类型</option>
                  <option value="credit_card">信用卡</option>
                  <option value="loan">贷款</option>
                  <option value="personal">个人借款</option>
                  <option value="other">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="debt-principal">本金 *</label>
                <div class="input-group">
                  <span class="input-group-prepend">{{ settingsStore.currencySymbol }}</span>
                  <input 
                    type="number" 
                    id="debt-principal" 
                    v-model.number="debtForm.principal" 
                    class="form-control" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    required
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="debt-remaining">剩余金额 *</label>
                <div class="input-group">
                  <span class="input-group-prepend">{{ settingsStore.currencySymbol }}</span>
                  <input 
                    type="number" 
                    id="debt-remaining" 
                    v-model.number="debtForm.remainingAmount" 
                    class="form-control" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    required
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="debt-interest-rate">年利率 (%)</label>
                <input 
                  type="number" 
                  id="debt-interest-rate" 
                  v-model.number="debtForm.interestRate" 
                  class="form-control" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01"
                >
              </div>
              
              <div class="form-group">
                <label for="debt-term">期限 (月)</label>
                <input 
                  type="number" 
                  id="debt-term" 
                  v-model.number="debtForm.term" 
                  class="form-control" 
                  placeholder="例如：12、24、36等" 
                  min="1"
                >
              </div>
              
              <div class="form-group">
                <label for="debt-start-date">开始日期 *</label>
                <input 
                  type="date" 
                  id="debt-start-date" 
                  v-model="debtForm.startDate" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="debt-due-date">到期日期 *</label>
                <input 
                  type="date" 
                  id="debt-due-date" 
                  v-model="debtForm.dueDate" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="debt-creditor">债权人</label>
                <input 
                  type="text" 
                  id="debt-creditor" 
                  v-model="debtForm.creditor" 
                  class="form-control" 
                  placeholder="银行名称、个人姓名等"
                >
              </div>
              
              <div class="form-group">
                <label for="debt-note">备注</label>
                <textarea 
                  id="debt-note" 
                  v-model="debtForm.note" 
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
    
    <!-- 还款模态框 -->
    <div class="modal" v-if="showPaymentModal" @click.self="closePaymentModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">添加还款</h2>
            <button class="close-button" @click="closePaymentModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="submitPayment">
              <div class="form-group">
                <label>债务</label>
                <div class="form-control-plaintext">{{ selectedDebt?.name || '-' }}</div>
                <div class="form-control-plaintext text-danger">
                  剩余: {{ formatCurrency(selectedDebt?.remainingAmount || 0) }}
                </div>
              </div>
              
              <div class="form-group">
                <label for="payment-amount">还款金额 *</label>
                <div class="input-group">
                  <span class="input-group-prepend">{{ settingsStore.currencySymbol }}</span>
                  <input 
                    type="number" 
                    id="payment-amount" 
                    v-model.number="paymentForm.amount" 
                    class="form-control" 
                    placeholder="0.00" 
                    :max="selectedDebt?.remainingAmount || 0"
                    min="0.01" 
                    step="0.01" 
                    required
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="payment-date">还款日期 *</label>
                <input 
                  type="date" 
                  id="payment-date" 
                  v-model="paymentForm.date" 
                  class="form-control" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="payment-method">支付方式</label>
                <select 
                  id="payment-method" 
                  v-model="paymentForm.method" 
                  class="form-control"
                >
                  <option value="" disabled>选择支付方式</option>
                  <option value="cash">现金</option>
                  <option value="credit_card">信用卡</option>
                  <option value="debit_card">借记卡</option>
                  <option value="online_transfer">网上转账</option>
                  <option value="other">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="payment-note">备注</label>
                <textarea 
                  id="payment-note" 
                  v-model="paymentForm.note" 
                  class="form-control" 
                  placeholder="添加还款备注..."
                  rows="2"
                ></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closePaymentModal">取消</button>
                <button type="submit" class="btn btn-primary">确认还款</button>
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
import { useFinanceStore, Debt } from '@/stores/finance'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage } from 'element-plus'

// 使用store
const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

// 响应式数据
const showAddModal = ref(false)
const showEditModal = ref(false)
const showPaymentModal = ref(false)
const selectedDebt = ref<Debt | null>(null)
const editedDebtId = ref<string | null>(null)

// 债务表单数据
const debtForm = reactive({
  name: '',
  principal: 0,
  interestRate: 0,
  dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
})

// 还款表单数据
const paymentForm = reactive({
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  method: 'online_transfer',
  note: ''
})

// 计算属性：债务列表
const debts = computed(() => {
  return financeStore.debts.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
})

// 计算属性：总债务
const totalDebt = computed(() => {
  return financeStore.totalDebt
})

// 计算属性：总利息
const totalInterest = computed(() => {
  return debts.value.reduce((total, debt) => {
    const interest = debt.principal - debt.remainingAmount
    return total + interest
  }, 0)
})

// 计算属性：近期待还款项（未来30天内）
const upcomingPayments = computed(() => {
  // 这里使用模拟数据，实际应用中应该从store中获取
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
  
  // 模拟还款计划数据
  const mockPayments: Array<{
    id: string,
    debtName: string,
    date: string,
    amount: number,
    principal: number,
    interest: number,
    status: 'pending' | 'completed' | 'overdue'
  }> = [
    {
      id: '1',
      debtName: '信用卡账单',
      date: new Date().toISOString().split('T')[0],
      amount: 3250.00,
      principal: 3200.00,
      interest: 50.00,
      status: 'pending'
    },
    {
      id: '2',
      debtName: '车贷',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 2500.00,
      principal: 2300.00,
      interest: 200.00,
      status: 'pending'
    },
    {
      id: '3',
      debtName: '房贷',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 8500.00,
      principal: 5500.00,
      interest: 3000.00,
      status: 'pending'
    }
  ]
  
  return mockPayments
    .filter(payment => new Date(payment.date) <= thirtyDaysLater)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// 计算属性：待还款总金额
const upcomingPaymentAmount = computed(() => {
  return upcomingPayments.value
    .filter(payment => payment.status !== 'completed')
    .reduce((total, payment) => total + payment.amount, 0)
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

// 方法：判断是否逾期
const isOverdue = (dateString: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const paymentDate = new Date(dateString)
  paymentDate.setHours(0, 0, 0, 0)
  return paymentDate < today
}

// 方法：获取债务类型文本
const getDebtTypeText = (type: string): string => {
  switch (type) {
    case 'credit_card':
      return '信用卡'
    case 'loan':
      return '贷款'
    case 'personal':
      return '个人借款'
    case 'other':
      return '其他'
    default:
      return '未知'
  }
}

// 方法：获取债务类型样式类
const getDebtTypeClass = (type: string): string => {
  switch (type) {
    case 'credit_card':
      return 'badge-primary'
    case 'loan':
      return 'badge-secondary'
    case 'personal':
      return 'badge-info'
    case 'other':
      return 'badge-dark'
    default:
      return 'badge-light'
  }
}

// 方法：获取债务状态文本
const getDebtStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '进行中'
    case 'paid':
      return '已还清'
    case 'default':
      return '违约'
    default:
      return '未知'
  }
}

// 方法：获取债务状态样式类
const getDebtStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'badge-warning'
    case 'paid':
      return 'badge-success'
    case 'default':
      return 'badge-danger'
    default:
      return 'badge-light'
  }
}

// 方法：获取支付状态文本
const getPaymentStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return '待还款'
    case 'completed':
      return '已完成'
    case 'overdue':
      return '已逾期'
    default:
      return '未知'
  }
}

// 方法：获取支付状态样式类
const getPaymentStatusClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'badge-warning'
    case 'completed':
      return 'badge-success'
    case 'overdue':
      return 'badge-danger'
    default:
      return 'badge-light'
  }
}

// 方法：重置债务表单
const resetDebtForm = () => {
  debtForm.name = ''
  debtForm.principal = 0
  debtForm.interestRate = 0
  debtForm.dueDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  editedDebtId.value = null
}

// 方法：重置还款表单
const resetPaymentForm = () => {
  paymentForm.amount = 0
  paymentForm.date = new Date().toISOString().split('T')[0]
  paymentForm.method = 'online_transfer'
  paymentForm.note = ''
  selectedDebt.value = null
}

// 方法：关闭债务模态框
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetDebtForm()
}

// 方法：关闭还款模态框
const closePaymentModal = () => {
  showPaymentModal.value = false
  resetPaymentForm()
}

// 方法：编辑债务
const editDebt = (debt: Debt) => {
  editedDebtId.value = debt.id
  debtForm.name = debt.name
  debtForm.principal = debt.principal || 0
  debtForm.interestRate = debt.interestRate || 0
  debtForm.dueDate = debt.dueDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  showEditModal.value = true
}

// 方法：删除债务
const deleteDebt = (debtId: string) => {
  if (confirm('确定要删除这条债务记录吗？')) {
    financeStore.deleteDebt(debtId)
    ElMessage.success('债务记录已删除')
  }
}

// 方法：提交债务（添加或更新）
const submitDebt = () => {
  if (showEditModal.value && editedDebtId.value) {
    // 更新债务
    financeStore.updateDebt(editedDebtId.value, {
      name: debtForm.name,
      totalAmount: debtForm.principal,
      remainingAmount: debtForm.principal,
      interestRate: debtForm.interestRate,
      dueDate: debtForm.dueDate,
      status: 'active'
    })
    ElMessage.success('债务记录已更新')
  } else {
    // 添加债务
    financeStore.addDebt({
      name: debtForm.name,
      totalAmount: debtForm.principal,
      remainingAmount: debtForm.principal,
      interestRate: debtForm.interestRate,
      dueDate: debtForm.dueDate,
      status: 'active',
      id: Date.now().toString() // 临时ID，实际应用中应该由后端生成
    })
    ElMessage.success('债务记录已添加')
  }
  
  closeModal()
}

// 方法：查看债务详情
const viewDebtDetails = (debt: Debt) => {
  // 这里可以实现查看债务详情的逻辑，比如打开详情模态框
  // 暂时先使用alert显示基本信息
  const message = `债务名称：${debt.name}\n` +
                 `类型：${getDebtTypeText(debt.type)}\n` +
                 `本金：${formatCurrency(debt.principal)}\n` +
                 `剩余金额：${formatCurrency(debt.remainingAmount)}\n` +
                 `利率：${debt.interestRate}%\n` +
                 `期限：${debt.term} 个月\n` +
                 `到期日：${formatDate(debt.dueDate)}\n` +
                 `债权人：${debt.creditor || '-'}\n` +
                 `状态：${getDebtStatusText(debt.status)}\n` +
                 `备注：${debt.note || '-'}`
  
  alert(message)
}

// 方法：添加还款
const addPayment = (debt: Debt) => {
  selectedDebt.value = debt
  showPaymentModal.value = true
}

// 方法：提交还款
const submitPayment = () => {
  if (!selectedDebt.value) return
  
  // 更新债务剩余金额
  const updatedDebt = {
    ...selectedDebt.value,
    remainingAmount: Math.max(0, selectedDebt.value.remainingAmount - paymentForm.amount)
  }
  
  // 如果已还清，更新状态
  if (updatedDebt.remainingAmount === 0) {
    updatedDebt.status = 'paid'
  }
  
  // 更新债务
  financeStore.updateDebt(selectedDebt.value.id, updatedDebt)
  
  // 这里可以添加还款记录到数据库
  // financeStore.addPayment({...})
  
  ElMessage.success('还款记录已添加')
  closePaymentModal()
}

// 方法：标记还款完成
const markPaymentAsCompleted = (paymentId: string) => {
  // 这里可以实现标记还款为完成的逻辑
  ElMessage.success('还款已标记为完成')
}
</script>

<style scoped>
.debt-view {
  animation: fadeIn 0.3s ease-out;
}

.debt-overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .debt-overview-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>