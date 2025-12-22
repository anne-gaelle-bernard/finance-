import { format } from 'date-fns'

const TransactionList = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'fa-utensils',
      transport: 'fa-car',
      housing: 'fa-home',
      entertainment: 'fa-gamepad',
      healthcare: 'fa-heartbeat',
      shopping: 'fa-shopping-bag',
      income: 'fa-dollar-sign'
    }
    return icons[category] || 'fa-receipt'
  }

  return (
    <div className="glass-card rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Transactions</h2>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-6 sm:py-8">
            <i className="fas fa-inbox text-3xl sm:text-4xl mb-2 opacity-70"></i>
            <p className="text-sm sm:text-base">No transactions yet</p>
          </div>
        ) : (
          transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <i className={`fas ${getCategoryIcon(transaction.category)} text-sm ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{transaction.description}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {transaction.date} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm sm:text-base ${
                  transaction.type === 'income' ? 'text-rose-600' : 'text-pink-700'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TransactionList
