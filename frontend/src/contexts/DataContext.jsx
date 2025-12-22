import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

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

  // Load user-specific data
  useEffect(() => {
    if (currentUser) {
      const userKey = currentUser.email
      setTransactions(JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [])
      setFolders(JSON.parse(localStorage.getItem(`${userKey}_folders`)) || [
        { id: 'taxes', name: '2025 Taxes', color: 'rose', receipts: [], totalAmount: 0 },
        { id: 'business', name: 'Business Expenses', color: 'pink', receipts: [], totalAmount: 0 }
      ])
      setGoals(JSON.parse(localStorage.getItem(`${userKey}_goals`)) || [])
      setReminders(JSON.parse(localStorage.getItem(`${userKey}_reminders`)) || [])
      setNotes(JSON.parse(localStorage.getItem(`${userKey}_notes`)) || [])
    }
  }, [currentUser])

  // Save data whenever it changes
  useEffect(() => {
    if (currentUser) {
      const userKey = currentUser.email
      localStorage.setItem(`${userKey}_transactions`, JSON.stringify(transactions))
      localStorage.setItem(`${userKey}_folders`, JSON.stringify(folders))
      localStorage.setItem(`${userKey}_goals`, JSON.stringify(goals))
      localStorage.setItem(`${userKey}_reminders`, JSON.stringify(reminders))
      localStorage.setItem(`${userKey}_notes`, JSON.stringify(notes))
    }
  }, [transactions, folders, goals, reminders, notes, currentUser])

  // Transaction operations
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    }
    setTransactions([newTransaction, ...transactions])
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  // Goal operations
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: goal.currentAmount || 0
    }
    setGoals([...goals, newGoal])
  }

  const updateGoal = (id, updates) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  // Reminder operations
  const addReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString()
    }
    setReminders([...reminders, newReminder])
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  // Note operations
  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  // Folder operations
  const addFolder = (folder) => {
    const newFolder = {
      ...folder,
      id: Date.now().toString(),
      receipts: [],
      totalAmount: 0
    }
    setFolders([...folders, newFolder])
  }

  const deleteFolder = (id) => {
    setFolders(folders.filter(f => f.id !== id))
  }

  const addReceiptToFolder = (folderId, receipt) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
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
      if (folder.id === folderId) {
        const updatedReceipts = folder.receipts.filter(r => r.id !== receiptId)
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
    deleteReceiptFromFolder
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
