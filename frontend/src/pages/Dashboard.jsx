import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import Sidebar from '../components/Sidebar'
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
import ImportCSVModal from '../components/modals/ImportCSVModal'
import ProfileSection from '../components/sections/ProfileSection'
import AnalyticsSection from '../components/sections/AnalyticsSection'
import FoldersSection from '../components/sections/FoldersSection'
import FinanceSimulatorSection from '../components/sections/FinanceSimulatorSection'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const { transactions, goals, reminders, notes, folders } = useData()
  
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showCalculatorModal, setShowCalculatorModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showImportCSVModal, setShowImportCSVModal] = useState(false)
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

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">💸 Finance Tracker</h1>
          <div className="w-10"></div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Bienvenue, {currentUser?.name}</p>
              </div>

              <StatsCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                netSavings={netSavings}
                receiptsCount={totalReceipts}
              />

              <QuickActions
                onAddExpense={() => setShowExpenseModal(true)}
                onAddIncome={() => setShowIncomeModal(true)}
                onAddGoal={() => setShowGoalModal(true)}
                onAddReminder={() => setShowReminderModal(true)}
                onAddNote={() => setShowNoteModal(true)}
                onScanReceipt={() => setShowReceiptModal(true)}
                onAddFolder={() => setShowFolderModal(true)}
                onCalculator={() => setShowCalculatorModal(true)}
                onSimulator={() => setActiveSection('simulator')}
                onImportCSV={() => setShowImportCSVModal(true)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                  <TransactionList transactions={transactions} />
                  <ExpenseChart transactions={transactions} />
                </div>

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <FoldersList onSelectFolder={(folder) => setSelectedFolder(folder)} />
                  <GoalsList goals={goals} />
                  <RemindersList reminders={reminders} />
                  <NotesList notes={notes} />
                </div>
              </div>
            </>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <ProfileSection />
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <AnalyticsSection transactions={transactions} />
          )}

          {/* Folders Section */}
          {activeSection === 'folders' && (
            <FoldersSection 
              folders={folders}
              onSelectFolder={(folder) => setSelectedFolder(folder)}
              onAddFolder={() => setShowFolderModal(true)}
            />
          )}

          {/* Simulator Section */}
          {activeSection === 'simulator' && (
            <FinanceSimulatorSection />
          )}
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
      {showImportCSVModal && (
        <ImportCSVModal onClose={() => setShowImportCSVModal(false)} />
      )}
    </div>
  )
}

export default Dashboard
