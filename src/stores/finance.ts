import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Expense, Income, Debt, Category } from '@/types/finance'

// 财务数据store
export const useFinanceStore = defineStore('finance', () => {
  // 状态
  const expenses = ref<Expense[]>([
    {
      id: '1',
      amount: 2500,
      category: '住房',
      date: '2023-06-01',
      description: '房租',
      tags: ['必要']
    },
    {
      id: '2',
      amount: 800,
      category: '餐饮',
      date: '2023-06-05',
      description: '超市购物',
      tags: ['日常']
    },
    {
      id: '3',
      amount: 300,
      category: '交通',
      date: '2023-06-10',
      description: '地铁月卡',
      tags: ['必要']
    }
  ])

  const incomes = ref<Income[]>([
    {
      id: '1',
      amount: 12000,
      source: '工资',
      date: '2023-06-01',
      description: '6月工资'
    },
    {
      id: '2',
      amount: 1500,
      source: '兼职',
      date: '2023-06-15',
      description: '项目奖金'
    }
  ])

  const debts = ref<Debt[]>([
    {
      id: '1',
      name: '信用卡欠款',
      totalAmount: 5000,
      remainingAmount: 2500,
      interestRate: 0.05,
      dueDate: '2023-07-01',
      status: 'active'
    },
    {
      id: '2',
      name: '个人贷款',
      totalAmount: 50000,
      remainingAmount: 45000,
      interestRate: 0.03,
      dueDate: '2023-07-15',
      status: 'active'
    }
  ])

  const categories = ref<Category[]>([
    { id: '1', name: '住房', icon: '🏠', color: '#4F46E5' },
    { id: '2', name: '餐饮', icon: '🍽️', color: '#EC4899' },
    { id: '3', name: '交通', icon: '🚗', color: '#10B981' },
    { id: '4', name: '购物', icon: '🛍️', color: '#F59E0B' },
    { id: '5', name: '娱乐', icon: '🎬', color: '#8B5CF6' },
    { id: '6', name: '医疗', icon: '🏥', color: '#EF4444' },
    { id: '7', name: '教育', icon: '📚', color: '#3B82F6' }
  ])

  // 计算属性
  const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) => sum + income.amount, 0)
  })

  const netIncome = computed(() => {
    return totalIncome.value - totalExpenses.value
  })

  const totalDebt = computed(() => {
    return debts.value.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  })

  const expensesByCategory = computed(() => {
    const result: Record<string, number> = {}
    expenses.value.forEach(expense => {
      if (result[expense.category]) {
        result[expense.category] += expense.amount
      } else {
        result[expense.category] = expense.amount
      }
    })
    return result
  })

  // 方法
  function addExpense(expense: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    }
    expenses.value.push(newExpense)
  }

  function updateExpense(id: string, data: Partial<Expense>) {
    const index = expenses.value.findIndex(expense => expense.id === id)
    if (index !== -1) {
      expenses.value[index] = { ...expenses.value[index], ...data }
    }
  }

  function deleteExpense(id: string) {
    expenses.value = expenses.value.filter(expense => expense.id !== id)
  }

  function addIncome(income: Omit<Income, 'id'>) {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString()
    }
    incomes.value.push(newIncome)
  }

  function updateIncome(id: string, data: Partial<Income>) {
    const index = incomes.value.findIndex(income => income.id === id)
    if (index !== -1) {
      incomes.value[index] = { ...incomes.value[index], ...data }
    }
  }

  function deleteIncome(id: string) {
    incomes.value = incomes.value.filter(income => income.id !== id)
  }

  function addDebt(debt: Omit<Debt, 'id'>) {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString()
    }
    debts.value.push(newDebt)
  }

  function updateDebt(id: string, data: Partial<Debt>) {
    const index = debts.value.findIndex(debt => debt.id === id)
    if (index !== -1) {
      debts.value[index] = { ...debts.value[index], ...data }
    }
  }

  function deleteDebt(id: string) {
    debts.value = debts.value.filter(debt => debt.id !== id)
  }

  function addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    categories.value.push(newCategory)
  }

  return {
    // 状态
    expenses,
    incomes,
    debts,
    categories,
    // 计算属性
    totalExpenses,
    totalIncome,
    netIncome,
    totalDebt,
    expensesByCategory,
    // 方法
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addDebt,
    updateDebt,
    deleteDebt,
    addCategory
  }
})