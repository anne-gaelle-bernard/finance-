import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { transactionAPI, folderAPI, goalAPI, reminderAPI, noteAPI } from '../services/api'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [folders, setFolders] = useState([])
  const [goals, setGoals] = useState([])
  const [reminders, setReminders] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [monthlyArchive, setMonthlyArchive] = useState([])

  const withId = (item) => {
    if (!item || typeof item !== 'object') return item
    return { ...item, id: item.id || item._id }
  }

  const normalizeList = (list) => (Array.isArray(list) ? list.map(withId) : [])

  const getUserKey = () => currentUser?.email || 'guest'

  const GUEST_READONLY_MESSAGE = 'Mode visiteur : lecture seule. Créez un compte pour enregistrer vos données.'

  const seedGuestDataIfNeeded = () => {
    const userKey = getUserKey()
    if (localStorage.getItem(`${userKey}_transactions`)) return

    const today = new Date()
    const isoDaysAgo = (days) => {
      const d = new Date(today)
      d.setDate(d.getDate() - days)
      return d.toISOString().split('T')[0]
    }

    const demoTransactions = [
      { id: 'demo-1', type: 'income', description: 'Salaire', amount: 2400, date: isoDaysAgo(2), category: 'salary', notes: '' },
      { id: 'demo-2', type: 'expense', description: 'Courses', amount: 86.4, date: isoDaysAgo(1), category: 'food', notes: '' },
      { id: 'demo-3', type: 'expense', description: 'Loyer', amount: 750, date: isoDaysAgo(5), category: 'housing', notes: '' },
      { id: 'demo-4', type: 'expense', description: 'Transport', amount: 45, date: isoDaysAgo(3), category: 'transport', notes: '' },
      { id: 'demo-5', type: 'income', description: 'Vente en ligne', amount: 120, date: isoDaysAgo(7), category: 'other', notes: '' }
    ]
    const demoGoals = [
      { id: 'demo-goal-1', name: 'Fonds d\'urgence', targetAmount: 3000, currentAmount: 950 }
    ]
    const demoFolders = []
    const demoReminders = [
      { id: 'demo-reminder-1', title: 'Facture électricité', date: isoDaysAgo(-4), amount: 60 }
    ]
    const demoNotes = [
      { id: 'demo-note-1', title: 'Bienvenue', content: 'Ceci est un compte de démonstration en lecture seule.', createdAt: new Date().toISOString() }
    ]

    localStorage.setItem(`${userKey}_transactions`, JSON.stringify(demoTransactions))
    localStorage.setItem(`${userKey}_goals`, JSON.stringify(demoGoals))
    localStorage.setItem(`${userKey}_folders`, JSON.stringify(demoFolders))
    localStorage.setItem(`${userKey}_reminders`, JSON.stringify(demoReminders))
    localStorage.setItem(`${userKey}_notes`, JSON.stringify(demoNotes))
  }

  const loadFromLocal = () => {
    if (currentUser?.isGuest) seedGuestDataIfNeeded()
    const userKey = getUserKey()
    setTransactions(JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [])
    setFolders(JSON.parse(localStorage.getItem(`${userKey}_folders`)) || [])
    setGoals(JSON.parse(localStorage.getItem(`${userKey}_goals`)) || [])
    setReminders(JSON.parse(localStorage.getItem(`${userKey}_reminders`)) || [])
    setNotes(JSON.parse(localStorage.getItem(`${userKey}_notes`)) || [])
    setMonthlyArchive(JSON.parse(localStorage.getItem(`${userKey}_monthlyArchive`)) || [])
  }

  const saveToLocal = (key, value) => {
    const userKey = getUserKey()
    localStorage.setItem(`${userKey}_${key}`, JSON.stringify(value))
  }

  const resetGuestData = () => {
    if (!currentUser?.isGuest) return
    const userKey = getUserKey()
    localStorage.removeItem(`${userKey}_transactions`)
    localStorage.removeItem(`${userKey}_folders`)
    localStorage.removeItem(`${userKey}_goals`)
    localStorage.removeItem(`${userKey}_reminders`)
    localStorage.removeItem(`${userKey}_notes`)
    localStorage.removeItem(`${userKey}_monthlyArchive`)
    loadFromLocal()
  }

  // Archive a month's income/expense totals before its transactions are cleared,
  // so historical trend charts keep showing that month after a reset.
  const archiveMonthTotals = (monthKey, monthTransactions) => {
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

    const existing = monthlyArchive.find(m => m.month === monthKey)
    const next = existing
      ? monthlyArchive.map(m => m.month === monthKey
          ? { month: monthKey, income: m.income + income, expenses: m.expenses + expenses }
          : m)
      : [...monthlyArchive, { month: monthKey, income, expenses }]

    setMonthlyArchive(next)
    saveToLocal('monthlyArchive', next)
  }

  // Fetch all data from backend
  const fetchAllData = async () => {
    if (!currentUser) return

    const token = localStorage.getItem('token')
    if (!token) {
      loadFromLocal()
      return
    }

    setLoading(true)
    try {
      const [transRes, folderRes, goalRes, reminderRes, noteRes] = await Promise.all([
        transactionAPI.getAll().catch(() => ({ success: true, data: [] })),
        folderAPI.getAll().catch(() => ({ success: true, data: [] })),
        goalAPI.getAll().catch(() => ({ success: true, data: [] })),
        reminderAPI.getAll().catch(() => ({ success: true, data: [] })),
        noteAPI.getAll().catch(() => ({ success: true, data: [] }))
      ])

      setTransactions(normalizeList(transRes.data))
      setFolders(normalizeList(folderRes.data))
      setGoals(normalizeList(goalRes.data))
      setReminders(normalizeList(reminderRes.data))
      setNotes(normalizeList(noteRes.data))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchAllData()
    } else {
      setTransactions([])
      setFolders([])
      setGoals([])
      setReminders([])
      setNotes([])
    }
  }, [currentUser])

  // Transaction operations
  const addTransaction = async (transaction) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        date: transaction.date || new Date().toISOString().split('T')[0]
      }
      const next = [newTransaction, ...transactions]
      setTransactions(next)
      saveToLocal('transactions', next)
      return
    }

    try {
      const response = await transactionAPI.create(transaction)
      if (response.success) {
        setTransactions([withId(response.data), ...transactions])
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = transactions.filter(t => t.id !== id && t._id !== id)
      setTransactions(next)
      saveToLocal('transactions', next)
      return
    }

    try {
      await transactionAPI.delete(id)
      setTransactions(transactions.filter(t => t._id !== id && t.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  const clearCurrentMonthTransactions = async () => {
    const now = new Date()
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const monthTransactions = transactions.filter(t => (t.date || '').startsWith(currentMonthKey))
    const idsToDelete = monthTransactions.map(t => t._id || t.id)

    if (idsToDelete.length === 0) return

    archiveMonthTotals(currentMonthKey, monthTransactions)

    const remaining = transactions.filter(t => !idsToDelete.includes(t._id || t.id))

    const token = localStorage.getItem('token')
    if (!token) {
      setTransactions(remaining)
      saveToLocal('transactions', remaining)
      return
    }

    try {
      await Promise.all(idsToDelete.map(id => transactionAPI.delete(id)))
      setTransactions(remaining)
    } catch (error) {
      console.error('Error clearing month transactions:', error)
      throw error
    }
  }

  const clearAllTransactions = async () => {
    if (transactions.length === 0) return

    const token = localStorage.getItem('token')
    if (!token) {
      setTransactions([])
      saveToLocal('transactions', [])
      return
    }

    try {
      await Promise.all(transactions.map(t => transactionAPI.delete(t._id || t.id)))
      setTransactions([])
    } catch (error) {
      console.error('Error clearing all transactions:', error)
      throw error
    }
  }

  // Goal operations
  const addGoal = async (goal) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newGoal = {
        ...goal,
        id: Date.now().toString(),
        currentAmount: goal.currentAmount || 0
      }
      const next = [...goals, newGoal]
      setGoals(next)
      saveToLocal('goals', next)
      return
    }

    try {
      const response = await goalAPI.create(goal)
      if (response.success) {
        setGoals([...goals, withId(response.data)])
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      throw error
    }
  }

  const updateGoal = async (id, updates) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = goals.map(g => g.id === id ? { ...g, ...updates } : g)
      setGoals(next)
      saveToLocal('goals', next)
      return
    }

    try {
      const response = await goalAPI.update(id, updates)
      if (response.success) {
        setGoals(goals.map(g => (g._id === id || g.id === id) ? withId(response.data) : g))
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  const deleteGoal = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = goals.filter(g => g.id !== id && g._id !== id)
      setGoals(next)
      saveToLocal('goals', next)
      return
    }

    try {
      await goalAPI.delete(id)
      setGoals(goals.filter(g => g._id !== id && g.id !== id))
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }

  // Reminder operations
  const addReminder = async (reminder) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newReminder = {
        ...reminder,
        id: Date.now().toString()
      }
      const next = [...reminders, newReminder]
      setReminders(next)
      saveToLocal('reminders', next)
      return
    }

    try {
      const response = await reminderAPI.create(reminder)
      if (response.success) {
        setReminders([...reminders, withId(response.data)])
      }
    } catch (error) {
      console.error('Error adding reminder:', error)
      throw error
    }
  }

  const deleteReminder = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = reminders.filter(r => r.id !== id && r._id !== id)
      setReminders(next)
      saveToLocal('reminders', next)
      return
    }

    try {
      await reminderAPI.delete(id)
      setReminders(reminders.filter(r => r._id !== id && r.id !== id))
    } catch (error) {
      console.error('Error deleting reminder:', error)
      throw error
    }
  }

  // Note operations
  const addNote = async (note) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newNote = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      const next = [newNote, ...notes]
      setNotes(next)
      saveToLocal('notes', next)
      return
    }

    try {
      const response = await noteAPI.create(note)
      if (response.success) {
        setNotes([withId(response.data), ...notes])
      }
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  }

  const updateNote = async (id, updates) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = notes.map(n => n.id === id ? { ...n, ...updates } : n)
      setNotes(next)
      saveToLocal('notes', next)
      return
    }

    try {
      const response = await noteAPI.update(id, updates)
      if (response.success) {
        setNotes(notes.map(n => (n._id === id || n.id === id) ? withId(response.data) : n))
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const deleteNote = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = notes.filter(n => n.id !== id && n._id !== id)
      setNotes(next)
      saveToLocal('notes', next)
      return
    }

    try {
      await noteAPI.delete(id)
      setNotes(notes.filter(n => n._id !== id && n.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }

  // Folder operations
  const addFolder = async (folder) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newFolder = {
        ...folder,
        id: Date.now().toString(),
        receipts: [],
        totalAmount: 0
      }
      const next = [...folders, newFolder]
      setFolders(next)
      saveToLocal('folders', next)
      return
    }

    try {
      const response = await folderAPI.create(folder)
      if (response.success) {
        setFolders([...folders, withId(response.data)])
      }
    } catch (error) {
      console.error('Error adding folder:', error)
      throw error
    }
  }

  const deleteFolder = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = folders.filter(f => f.id !== id && f._id !== id)
      setFolders(next)
      saveToLocal('folders', next)
      return
    }

    try {
      await folderAPI.delete(id)
      setFolders(folders.filter(f => f._id !== id && f.id !== id))
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw error
    }
  }

  const addReceiptToFolder = async (folderId, receipt) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = folders.map(folder => {
        if (folder.id === folderId || folder._id === folderId) {
          const newReceipt = {
            ...receipt,
            id: Date.now().toString()
          }
          const updatedReceipts = [...(folder.receipts || []), newReceipt]
          const totalAmount = updatedReceipts.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
          return {
            ...folder,
            receipts: updatedReceipts,
            totalAmount
          }
        }
        return folder
      })
      setFolders(next)
      saveToLocal('folders', next)
      return
    }

    try {
      const response = await folderAPI.addReceipt(folderId, receipt)
      if (response.success) {
        setFolders(folders.map(f => (f._id === folderId || f.id === folderId) ? withId(response.data) : f))
      }
    } catch (error) {
      console.error('Error adding receipt:', error)
      throw error
    }
  }

  const deleteReceiptFromFolder = async (folderId, receiptId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const next = folders.map(folder => {
        if (folder.id === folderId || folder._id === folderId) {
          const updatedReceipts = folder.receipts.filter(r => r.id !== receiptId && r._id !== receiptId)
          const totalAmount = updatedReceipts.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
          return {
            ...folder,
            receipts: updatedReceipts,
            totalAmount
          }
        }
        return folder
      })
      setFolders(next)
      saveToLocal('folders', next)
      return
    }

    try {
      const response = await folderAPI.deleteReceipt(folderId, receiptId)
      if (response.success) {
        setFolders(folders.map(f => (f._id === folderId || f.id === folderId) ? withId(response.data) : f))
      }
    } catch (error) {
      console.error('Error deleting receipt:', error)
      throw error
    }
  }

  const guardWrite = (fn) => async (...args) => {
    if (currentUser?.isGuest) {
      window.alert(GUEST_READONLY_MESSAGE)
      return
    }
    return fn(...args)
  }

  const value = {
    transactions,
    folders,
    goals,
    reminders,
    notes,
    monthlyArchive,
    loading,
    isReadOnly: !!currentUser?.isGuest,
    addTransaction: guardWrite(addTransaction),
    deleteTransaction: guardWrite(deleteTransaction),
    clearCurrentMonthTransactions: guardWrite(clearCurrentMonthTransactions),
    clearAllTransactions: guardWrite(clearAllTransactions),
    addGoal: guardWrite(addGoal),
    updateGoal: guardWrite(updateGoal),
    deleteGoal: guardWrite(deleteGoal),
    addReminder: guardWrite(addReminder),
    deleteReminder: guardWrite(deleteReminder),
    addNote: guardWrite(addNote),
    updateNote: guardWrite(updateNote),
    deleteNote: guardWrite(deleteNote),
    addFolder: guardWrite(addFolder),
    deleteFolder: guardWrite(deleteFolder),
    addReceiptToFolder: guardWrite(addReceiptToFolder),
    deleteReceiptFromFolder: guardWrite(deleteReceiptFromFolder),
    refreshData: fetchAllData,
    resetGuestData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
