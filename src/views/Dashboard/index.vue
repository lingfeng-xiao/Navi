<template>
  <div class="dashboard-view">
    <div class="content-section">
      <h1 class="section-title">财务概览</h1>
      
      <!-- 统计卡片区域 -->
      <div class="dashboard-cards">
        <!-- 总收入卡片 -->
        <div class="card stats-card">
          <div class="stats-card-icon">💰</div>
          <div class="stats-card-value">
            {{ formatCurrency(financeStore.totalIncome) }}
          </div>
          <div class="stats-card-label">总收入</div>
          <div class="stats-card-change positive">
            <span>↗</span>
            <span>+12.5%</span>
            <span>相比上月</span>
          </div>
        </div>
        
        <!-- 总支出卡片 -->
        <div class="card stats-card">
          <div class="stats-card-icon">💸</div>
          <div class="stats-card-value">
            {{ formatCurrency(financeStore.totalExpenses) }}
          </div>
          <div class="stats-card-label">总支出</div>
          <div class="stats-card-change negative">
            <span>↘</span>
            <span>-8.2%</span>
            <span>相比上月</span>
          </div>
        </div>
        
        <!-- 净收入卡片 -->
        <div class="card stats-card">
          <div class="stats-card-icon">📊</div>
          <div class="stats-card-value" :class="{ 'text-danger': financeStore.netIncome < 0 }">
            {{ formatCurrency(financeStore.netIncome) }}
          </div>
          <div class="stats-card-label">净收入</div>
          <div class="stats-card-change" :class="{ 'positive': financeStore.netIncome > 0, 'negative': financeStore.netIncome < 0 }">
            <span>{{ financeStore.netIncome > 0 ? '↗' : '↘' }}</span>
            <span>{{ financeStore.netIncome > 0 ? '+15.3%' : '-5.2%' }}</span>
            <span>相比上月</span>
          </div>
        </div>
        
        <!-- 总债务卡片 -->
        <div class="card stats-card">
          <div class="stats-card-icon">💳</div>
          <div class="stats-card-value">
            {{ formatCurrency(financeStore.totalDebt) }}
          </div>
          <div class="stats-card-label">总债务</div>
          <div class="stats-card-change negative">
            <span>↘</span>
            <span>-3.8%</span>
            <span>相比上月</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="content-section">
      <h2 class="section-title">财务分析</h2>
      
      <div class="dashboard-charts">
        <!-- 支出分布饼图 -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">支出分布</h3>
          </div>
          <div class="card-body">
            <div ref="expenseChartRef" class="chart-container" style="height: 300px;"></div>
          </div>
        </div>
        
        <!-- 收支趋势图 -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">收支趋势</h3>
          </div>
          <div class="card-body">
            <div ref="trendChartRef" class="chart-container" style="height: 300px;"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最近交易区域 -->
    <div class="content-section">
      <div class="card-header">
        <h2 class="section-title m-0">最近交易</h2>
        <router-link to="/expense" class="btn btn-secondary btn-sm">查看全部</router-link>
      </div>
      
      <div class="card">
        <div class="overflow-x-auto">
          <table class="data-table">
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
                    <span class="badge" :class="transaction.type === 'income' ? 'badge-success' : 'badge-danger'">
                      {{ transaction.type === 'income' ? '收入' : '支出' }}
                    </span>
                  </td>
                  <td :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
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
                  <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-title">暂无交易记录</div>
                    <div class="empty-state-description">开始添加您的第一笔交易</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useSettingsStore } from '@/stores/settings'
import * as echarts from 'echarts'

// 响应式引用
const expenseChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
const expenseChart = ref<echarts.ECharts>()
const trendChart = ref<echarts.ECharts>()

// 使用store
const financeStore = useFinanceStore()
const settingsStore = useSettingsStore()

// 计算属性：最近交易记录（合并收入和支出）
const recentTransactions = computed(() => {
  // 合并收入和支出数据
  const transactions = [
    ...financeStore.incomes.map(income => ({
      ...income,
      type: 'income',
      status: 'completed'
    })),
    ...financeStore.expenses.map(expense => ({
      ...expense,
      type: 'expense',
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
const getCategoryBadgeStyle = (categoryName: string) => {
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
      return 'badge-success'
    case 'pending':
      return 'badge-warning'
    case 'failed':
      return 'badge-danger'
    default:
      return 'badge-secondary'
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
.dashboard-view {
  animation: fadeIn 0.3s ease-out;
}

.chart-container {
  width: 100%;
  min-height: 300px;
}

/* 适配暗色模式的图表样式 */
.dark-theme :deep(.echarts-tooltip) {
  background-color: var(--card-color) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

.dark-theme :deep(.echarts-legend-item) {
  color: var(--text-primary) !important;
}
</style>