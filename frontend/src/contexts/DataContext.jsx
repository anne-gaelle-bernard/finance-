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

  // Fetch all data from backend
  const fetchAllData = async () => {
    if (!currentUser || !localStorage.getItem('token')) {
      // If no token, use localStorage fallback
      const userKey = currentUser?.email || 'guest'
      setTransactions(JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [])
      setFolders(JSON.parse(localStorage.getItem(`${userKey}_folders`)) || [])
      setGoals(JSON.parse(localStorage.getItem(`${userKey}_goals`)) || [])
      setReminders(JSON.parse(localStorage.getItem(`${userKey}_reminders`)) || [])
      setNotes(JSON.parse(localStorage.getItem(`${userKey}_notes`)) || [])
      return
    }

    setLoading(true)
    try {
      const [transRes, folderRes, goalRes, reminderRes, noteRes] = await Promise.all([
        transactionAPI.getAll().catch(() => ({ data: { data: [] } })),
        folderAPI.getAll().catch(() => ({ data: { data: [] } })),
        goalAPI.getAll().catch(() => ({ data: { data: [] } })),
        reminderAPI.getAll().catch(() => ({ data: { data: [] } })),
        noteAPI.getAll().catch(() => ({ data: { data: [] } }))
      ])

      setTransactions(transRes.data.data || [])
      setFolders(folderRes.data.data || [])
      setGoals(goalRes.data.data || [])
      setReminders(reminderRes.data.data || [])
      setNotes(noteRes.data.data || [])
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
    if (!localStorage.getItem('token')) {
      // Fallback to localStorage
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        date: transaction.date || new Date().toISOString().split('T')[0]
      }
      setTransactions([newTransaction, ...transactions])
      return
    }

    try {
      const response = await transactionAPI.create(transaction)
      if (response.data.success) {
        setTransactions([response.data.data, ...transactions])
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }

  const deleteTransaction = async (id) => {
    if (!localStorage.getItem('token')) {
      setTransactions(transactions.filter(t => t.id !== id))
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
    if (!localStorage.getItem('token')) {
      const newGoal = {
        ...goal,
        id: Date.now().toString(),
        currentAmount: goal.currentAmount || 0
      }
      setGoals([...goals, newGoal])
      return
    }

    try {
      const response = await goalAPI.create(goal)
      if (response.data.success) {
        setGoals([...goals, response.data.data])
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      throw error
    }
  }

  const updateGoal = async (id, updates) => {
    if (!localStorage.getItem('token')) {
      setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g))
      return
    }

    try {
      const response = await goalAPI.update(id, updates)
      if (response.data.success) {
        setGoals(goals.map(g => (g._id === id || g.id === id) ? response.data.data : g))
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  const deleteGoal = async (id) => {
    if (!localStorage.getItem('token')) {
      setGoals(goals.filter(g => g.id !== id))
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
    if (!localStorage.getItem('token')) {
      const newReminder = {
        ...reminder,
        id: Date.now().toString()
      }
      setReminders([...reminders, newReminder])
      return
    }

    try {
      const response = await reminderAPI.create(reminder)
      if (response.data.success) {
        setReminders([...reminders, response.data.data])
      }
    } catch (error) {
      console.error('Error adding reminder:', error)
      throw error
    }
  }

  const deleteReminder = async (id) => {
    if (!localStorage.getItem('token')) {
      setReminders(reminders.filter(r => r.id !== id))
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
    if (!localStorage.getItem('token')) {
      const newNote = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      setNotes([newNote, ...notes])
      return
    }

    try {
      const response = await noteAPI.create(note)
      if (response.data.success) {
        setNotes([response.data.data, ...notes])
      }
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  }

  const updateNote = async (id, updates) => {
    if (!localStorage.getItem('token')) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n))
      return
    }

    try {
      const response = await noteAPI.update(id, updates)
      if (response.data.success) {
        setNotes(notes.map(n => (n._id === id || n.id === id) ? response.data.data : n))
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const deleteNote = async (id) => {
    if (!localStorage.getItem('token')) {
      setNotes(notes.filter(n => n.id !== id))
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
    if (!localStorage.getItem('token')) {
      const newFolder = {
        ...folder,
        id: Date.now().toString(),
        receipts: [],
        totalAmount: 0
      }
      setFolders([...folders, newFolder])
      return
    }

    try {
      const response = await folderAPI.create(folder)
      if (response.data.success) {
        setFolders([...folders, response.data.data])
      }
    } catch (error) {
      console.error('Error adding folder:', error)
      throw error
    }
  }

  const deleteFolder = async (id) => {
    if (!localStorage.getItem('token')) {
      setFolders(folders.filter(f => f.id !== id))
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

  const addReceiptToFolder = (folderId, receipt) => {
    setFolders(folders.map(folder => {
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
    }))
  }

  const deleteReceiptFromFolder = (folderId, receiptId) => {
    setFolders(folders.map(folder => {
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
    }))
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
