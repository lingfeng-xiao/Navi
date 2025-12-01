<template>
  <div class="dashboard">
    <div class="dashboard__section">
      <h1 class="dashboard__title">财务概览</h1>
      
      <!-- 统计卡片区域 -->
      <div class="dashboard__cards">
        <!-- 总收入卡片 -->
        <Card class="dashboard__stats-card">
          <div class="dashboard__stats-icon">💰</div>
          <div class="dashboard__stats-value">
            {{ formatCurrency(financeStore.totalIncome) }}
          </div>
          <div class="dashboard__stats-label">总收入</div>
          <div class="dashboard__stats-change dashboard__stats-change--positive">
            <span>↗</span>
            <span>+12.5%</span>
            <span>相比上月</span>
          </div>
        </Card>
        
        <!-- 总支出卡片 -->
        <Card class="dashboard__stats-card">
          <div class="dashboard__stats-icon">💸</div>
          <div class="dashboard__stats-value">
            {{ formatCurrency(financeStore.totalExpenses) }}
          </div>
          <div class="dashboard__stats-label">总支出</div>
          <div class="dashboard__stats-change dashboard__stats-change--negative">
            <span>↘</span>
            <span>-8.2%</span>
            <span>相比上月</span>
          </div>
        </Card>
        
        <!-- 净收入卡片 -->
        <Card class="dashboard__stats-card">
          <div class="dashboard__stats-icon">📊</div>
          <div class="dashboard__stats-value" :class="{ 'dashboard__text-danger': financeStore.netIncome < 0 }">
            {{ formatCurrency(financeStore.netIncome) }}
          </div>
          <div class="dashboard__stats-label">净收入</div>
          <div class="dashboard__stats-change" :class="{ 
            'dashboard__stats-change--positive': financeStore.netIncome > 0, 
            'dashboard__stats-change--negative': financeStore.netIncome < 0 
          }">
            <span>{{ financeStore.netIncome > 0 ? '↗' : '↘' }}</span>
            <span>{{ financeStore.netIncome > 0 ? '+15.3%' : '-5.2%' }}</span>
            <span>相比上月</span>
          </div>
        </Card>
        
        <!-- 总债务卡片 -->
        <Card class="dashboard__stats-card">
          <div class="dashboard__stats-icon">💳</div>
          <div class="dashboard__stats-value">
            {{ formatCurrency(financeStore.totalDebt) }}
          </div>
          <div class="dashboard__stats-label">总债务</div>
          <div class="dashboard__stats-change dashboard__stats-change--negative">
            <span>↘</span>
            <span>-3.8%</span>
            <span>相比上月</span>
          </div>
        </Card>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="dashboard__section">
      <h2 class="dashboard__title">财务分析</h2>
      
      <div class="dashboard__charts">
        <!-- 支出分布饼图 -->
        <Card>
          <template #header>
            <h3 class="card__title">支出分布</h3>
          </template>
          <template #body>
            <div ref="expenseChartRef" class="dashboard__chart-container"></div>
          </template>
        </Card>
        
        <!-- 收支趋势图 -->
        <Card>
          <template #header>
            <h3 class="card__title">收支趋势</h3>
          </template>
          <template #body>
            <div ref="trendChartRef" class="dashboard__chart-container"></div>
          </template>
        </Card>
      </div>
    </div>
    
    <!-- 最近交易区域 -->
    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__title">最近交易</h2>
        <router-link to="/expense" class="btn btn--secondary btn--small">查看全部</router-link>
      </div>
      
      <Card>
        <div class="dashboard__table-wrapper">
          <table class="dashboard__table">
            <thead>
              <tr>
                <th>日期</th>
                <th>描述</th>
                <th>类别</th>
                <th>类型</th>
                <th>金额</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="recentTransactions.length > 0">
                <tr v-for="transaction in recentTransactions" :key="transaction.id">
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>{{ transaction.description }}</td>
                  <td>
                    <span class="badge" :style="transaction.category ? getCategoryBadgeStyle(transaction.category) : {}">
                      {{ transaction.category || transaction.source || '-' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="transaction.type === 'income' ? 'badge--success' : 'badge--danger'">
                      {{ transaction.type === 'income' ? '收入' : '支出' }}
                    </span>
                  </td>
                  <td :class="transaction.type === 'income' ? 'dashboard__text-success' : 'dashboard__text-danger'">
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </td>
                  <td>
                    <span class="badge" :class="getTransactionStatusClass(transaction.status)">
                      {{ getTransactionStatusText(transaction.status) }}
                    </span>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="6" class="text-center py-6">
                  <div class="dashboard__empty-state">
                    <div class="dashboard__empty-icon">📝</div>
                    <div class="dashboard__empty-title">暂无交易记录</div>
                    <div class="dashboard__empty-description">开始添加您的第一笔交易</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { useSettingsStore } from '@/stores/settings'
import * as echarts from 'echarts'
import Card from '@/components/common/Card.vue'
import type { Expense, Income, Debt, Category } from '@/types/finance'

// 响应式引用
const expenseChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
const expenseChart = ref<echarts.ECharts>()
const trendChart = ref<echarts.ECharts>()

// 使用store
const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

// 定义交易记录类型
interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category?: string
  source?: string
  type: 'income' | 'expense'
  status: string
}

// 计算属性：最近交易记录（合并收入和支出）
const recentTransactions = computed<Transaction[]>(() => {
  // 合并收入和支出数据
  const transactions: Transaction[] = [
    ...financeStore.incomes.map(income => ({
      ...income,
      type: 'income' as const,
      status: 'completed'
    })),
    ...financeStore.expenses.map(expense => ({
      ...expense,
      type: 'expense' as const,
      status: 'completed'
    }))
  ]
  
  // 按日期排序，取最近5条
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
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

// 方法：获取类别徽章样式
const getCategoryBadgeStyle = (categoryName: string): { backgroundColor: string, color: string } => {
  const category = financeStore.categories.find(c => c.name === categoryName)
  return {
    backgroundColor: category ? category.color : 'var(--text-tertiary)',
    color: 'white'
  }
}

// 方法：获取交易状态类
const getTransactionStatusClass = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'badge--success'
    case 'pending':
      return 'badge--warning'
    case 'failed':
      return 'badge--danger'
    default:
      return 'badge--secondary'
  }
}

// 方法：获取交易状态文本
const getTransactionStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'pending':
      return '待处理'
    case 'failed':
      return '失败'
    default:
      return '未知'
  }
}

// 方法：初始化支出分布图表
const initExpenseChart = () => {
  if (!expenseChartRef.value) return
  
  expenseChart.value = echarts.init(expenseChartRef.value)
  
  const categories = financeStore.categories
  const expensesByCategory = financeStore.expensesByCategory
  
  // 准备图表数据
  const pieData = Object.entries(expensesByCategory).map(([categoryName, amount]) => ({
    name: categoryName,
    value: amount,
    itemStyle: {
      color: categories.find(c => c.name === categoryName)?.color || '#9CA3AF'
    }
  }))
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: 'var(--text-primary)'
      }
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['60%', '50%'],
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }
  
  expenseChart.value.setOption(option)
}

// 方法：初始化收支趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart.value = echarts.init(trendChartRef.value)
  
  // 模拟6个月的数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const incomeData = [10000, 11500, 12000, 11800, 12500, 13000]
  const expenseData = [8000, 8500, 9000, 8800, 9200, 9500]
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param: any) => {
          result += `${param.marker}${param.seriesName}: ${formatCurrency(param.value)}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['收入', '支出'],
      textStyle: {
        color: 'var(--text-primary)'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)'
        }
      },
      axisLabel: {
        color: 'var(--text-secondary)',
        formatter: (value: number) => formatCurrency(value)
      },
      splitLine: {
        lineStyle: {
          color: 'var(--divider-color)'
        }
      }
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: incomeData,
        smooth: true,
        lineStyle: {
          color: 'var(--income-color)',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(16, 185, 129, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(16, 185, 129, 0.05)'
            }
          ])
        }
      },
      {
        name: '支出',
        type: 'line',
        data: expenseData,
        smooth: true,
        lineStyle: {
          color: 'var(--expense-color)',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(239, 68, 68, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(239, 68, 68, 0.05)'
            }
          ])
        }
      }
    ]
  }
  
  trendChart.value.setOption(option)
}

// 方法：调整图表大小
const handleResize = () => {
  expenseChart.value?.resize()
  trendChart.value?.resize()
}

// 生命周期钩子
onMounted(() => {
  // 初始化图表
  initExpenseChart()
  initTrendChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  
  // 销毁图表实例
  expenseChart.value?.dispose()
  trendChart.value?.dispose()
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-out;
}

.dashboard__section {
  margin-bottom: var(--spacing-lg);
}

.dashboard__title {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.dashboard__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.dashboard__stats-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard__stats-card:hover {
  transform: translateY(-2px);
}

.dashboard__stats-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.dashboard__stats-value {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.dashboard__stats-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.dashboard__stats-change {
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dashboard__stats-change--positive {
  color: var(--success-color);
}

.dashboard__stats-change--negative {
  color: var(--danger-color);
}

.dashboard__charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-md);
}

.dashboard__chart-container {
  width: 100%;
  height: 300px;
}

.dashboard__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.dashboard__table-wrapper {
  overflow-x: auto;
}

.dashboard__table {
  width: 100%;
  border-collapse: collapse;
}

.dashboard__table th,
.dashboard__table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.dashboard__table th {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.dashboard__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.dashboard__empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.dashboard__empty-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.dashboard__empty-description {
  color: var(--text-secondary);
}

.dashboard__text-success {
  color: var(--success-color);
}

.dashboard__text-danger {
  color: var(--danger-color);
}

/* 适配暗色模式的图表样式 */
.dark-theme :deep(.echarts-tooltip) {
  background-color: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

.dark-theme :deep(.echarts-legend-item) {
  color: var(--text-primary) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard__cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard__charts {
    grid-template-columns: 1fr;
  }
  
  .dashboard__section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>