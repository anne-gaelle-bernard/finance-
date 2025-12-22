const QuickActions = ({ onAddExpense, onAddIncome, onAddGoal, onAddReminder, onAddNote, onCalculator, onScanReceipt, onAddFolder }) => {
  const actions = [
    { icon: 'fa-minus-circle', label: 'Add Expense', onClick: onAddExpense },
    { icon: 'fa-plus-circle', label: 'Add Income', onClick: onAddIncome },
    { icon: 'fa-bullseye', label: 'Add Goal', onClick: onAddGoal },
    { icon: 'fa-bell', label: 'Add Reminder', onClick: onAddReminder },
    { icon: 'fa-sticky-note', label: 'Add Note', onClick: onAddNote },
    { icon: 'fa-camera', label: 'Scan Receipt', onClick: onScanReceipt },
    { icon: 'fa-folder-plus', label: 'Add Folder', onClick: onAddFolder },
    { icon: 'fa-calculator', label: 'Calculator', onClick: onCalculator }
  ]

  return (
    <div className="glass-card rounded-xl shadow-md p-4 sm:p-6 mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <div key={index} className="flex flex-col items-center gap-1 sm:gap-2">
            <button onClick={action.onClick} className="icon-btn" title={action.label}>
              <i className={`fas ${action.icon} text-lg sm:text-xl`}></i>
            </button>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
