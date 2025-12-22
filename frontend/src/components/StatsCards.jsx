const StatsCards = ({ totalIncome, totalExpenses, netSavings, receiptsCount }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: 'fa-arrow-up',
      color: 'text-rose-600',
      bgColor: 'bg-pink-100'
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: 'fa-arrow-down',
      color: 'text-pink-700',
      bgColor: 'bg-pink-100'
    },
    {
      label: 'Net Savings',
      value: formatCurrency(netSavings),
      icon: 'fa-piggy-bank',
      color: 'text-rose-600',
      bgColor: 'bg-pink-100'
    },
    {
      label: 'Receipts Scanned',
      value: receiptsCount,
      icon: 'fa-receipt',
      color: 'text-rose-600',
      bgColor: 'bg-pink-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card rounded-xl shadow-md p-4 sm:p-6 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color} truncate`}>{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full flex-shrink-0 ml-2`}>
              <i className={`fas ${stat.icon} ${stat.color} text-lg sm:text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
