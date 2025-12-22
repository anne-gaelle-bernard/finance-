import { useData } from '../contexts/DataContext'

const GoalsList = ({ goals }) => {
  const { updateGoal, deleteGoal } = useData()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleProgressChange = (goalId, newAmount) => {
    updateGoal(goalId, { currentAmount: parseFloat(newAmount) })
  }

  return (
    <div className="glass-card rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Financial Goals</h2>
      
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fas fa-bullseye text-4xl mb-2 opacity-70"></i>
            <p className="text-sm">No goals yet. Create one to start tracking.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            return (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{goal.title}</h3>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max={goal.targetAmount}
                    value={goal.currentAmount}
                    onChange={(e) => handleProgressChange(goal.id, e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GoalsList
