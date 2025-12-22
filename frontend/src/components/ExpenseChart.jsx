import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const ExpenseChart = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  
  const categoryTotals = {}
  expenseTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount)
  })

  const data = {
    labels: Object.keys(categoryTotals).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#ec4899',
          '#db2777',
          '#be185d',
          '#ff7ea8',
          '#ffa8c1',
          '#ffc9d9'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  return (
    <div className="glass-card rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Spending by Category</h2>
      <div className="relative h-64">
        {expenseTransactions.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <i className="fas fa-chart-pie text-4xl mb-2 opacity-70"></i>
              <p>No expenses to display</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseChart
