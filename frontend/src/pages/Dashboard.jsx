import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import QuickActions from '../components/QuickActions'
import TransactionList from '../components/TransactionList'
import GoalsList from '../components/GoalsList'
import RemindersList from '../components/RemindersList'
import NotesList from '../components/NotesList'
import FoldersList from '../components/FoldersList'
import ExpenseChart from '../components/ExpenseChart'
import AddExpenseModal from '../components/modals/AddExpenseModal'
import AddIncomeModal from '../components/modals/AddIncomeModal'
import AddGoalModal from '../components/modals/AddGoalModal'
import AddReminderModal from '../components/modals/AddReminderModal'
import AddNoteModal from '../components/modals/AddNoteModal'
import AddFolderModal from '../components/modals/AddFolderModal'
import AddReceiptModal from '../components/modals/AddReceiptModal'
import FolderDetailsModal from '../components/modals/FolderDetailsModal'
import CalculatorModal from '../components/modals/CalculatorModal'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const { transactions, goals, reminders, notes, folders } = useData()
  
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showCalculatorModal, setShowCalculatorModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const netSavings = totalIncome - totalExpenses

  const totalReceipts = folders.reduce((sum, folder) => sum + (folder.receipts?.length || 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar userName={currentUser?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netSavings={netSavings}
          receiptsCount={totalReceipts}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddExpense={() => setShowExpenseModal(true)}
          onAddIncome={() => setShowIncomeModal(true)}
          onAddGoal={() => setShowGoalModal(true)}
          onAddReminder={() => setShowReminderModal(true)}
          onAddNote={() => setShowNoteModal(true)}
          onScanReceipt={() => setShowReceiptModal(true)}
          onAddFolder={() => setShowFolderModal(true)}
          onCalculator={() => setShowCalculatorModal(true)}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            <TransactionList transactions={transactions} />
            <ExpenseChart transactions={transactions} />
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <FoldersList onSelectFolder={(folder) => setSelectedFolder(folder)} />
            <GoalsList goals={goals} />
            <RemindersList reminders={reminders} />
            <NotesList notes={notes} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExpenseModal && (
        <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
      )}
      {showIncomeModal && (
        <AddIncomeModal onClose={() => setShowIncomeModal(false)} />
      )}
      {showGoalModal && (
        <AddGoalModal onClose={() => setShowGoalModal(false)} />
      )}
      {showReminderModal && (
        <AddReminderModal onClose={() => setShowReminderModal(false)} />
      )}
      {showNoteModal && (
        <AddNoteModal onClose={() => setShowNoteModal(false)} />
      )}
      {showFolderModal && (
        <AddFolderModal onClose={() => setShowFolderModal(false)} />
      )}
      {showReceiptModal && (
        <AddReceiptModal onClose={() => setShowReceiptModal(false)} />
      )}
      {selectedFolder && (
        <FolderDetailsModal 
          folder={selectedFolder} 
          onClose={() => setSelectedFolder(null)} 
        />
      )}
      {showCalculatorModal && (
        <CalculatorModal onClose={() => setShowCalculatorModal(false)} />
      )}
    </div>
  )
}

export default Dashboard
