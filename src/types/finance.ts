// 财务相关类型定义

/**
 * 支出数据接口
 */
export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description: string
  tags: string[]
}

/**
 * 收入数据接口
 */
export interface Income {
  id: string
  amount: number
  source: string
  date: string
  description: string
}

/**
 * 债务数据接口
 */
export interface Debt {
  id: string
  name: string
  totalAmount: number
  remainingAmount: number
  interestRate: number
  dueDate: string
  status: 'active' | 'paid' | 'overdue'
}

/**
 * 支出类别接口
 */
export interface Category {
  id: string
  name: string
  icon: string
  color: string
}
