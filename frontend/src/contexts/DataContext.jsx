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

  const withId = (item) => {
    if (!item || typeof item !== 'object') return item
    return { ...item, id: item.id || item._id }
  }

  const normalizeList = (list) => (Array.isArray(list) ? list.map(withId) : [])

  const getUserKey = () => currentUser?.email || 'guest'

  const loadFromLocal = () => {
    const userKey = getUserKey()
    setTransactions(JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [])
    setFolders(JSON.parse(localStorage.getItem(`${userKey}_folders`)) || [])
    setGoals(JSON.parse(localStorage.getItem(`${userKey}_goals`)) || [])
    setReminders(JSON.parse(localStorage.getItem(`${userKey}_reminders`)) || [])
    setNotes(JSON.parse(localStorage.getItem(`${userKey}_notes`)) || [])
  }

  const saveToLocal = (key, value) => {
    const userKey = getUserKey()
    localStorage.setItem(`${userKey}_${key}`, JSON.stringify(value))
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
      const next = transactions.filter(t => t.id !== id)
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
      const next = goals.filter(g => g.id !== id)
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
      const next = reminders.filter(r => r.id !== id)
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
      const next = notes.filter(n => n.id !== id)
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
      const next = folders.filter(f => f.id !== id)
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

  const value = {
    transactions,
    folders,
    goals,
    reminders,
    notes,
    loading,
    addTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addReminder,
    deleteReminder,
    addNote,
    updateNote,
    deleteNote,
    addFolder,
    deleteFolder,
    addReceiptToFolder,
    deleteReceiptFromFolder,
    refreshData: fetchAllData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
