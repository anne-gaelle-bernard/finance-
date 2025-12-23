import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Line, Bar, PolarArea } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, parseISO } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale);

const AnalyticsSection = ({ transactions }) => {
  // Monthly trend (last 12 months)
  const last12Months = eachMonthOfInterval({
    start: subMonths(new Date(), 11),
    end: new Date()
  });

  const monthlyTrend = last12Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      month: format(month, 'MMM yyyy'),
      income,
      expenses,
      net: income - expenses
    };
  });

  const trendChartData = {
    labels: monthlyTrend.map(d => d.month),
    datasets: [
      {
        label: 'Revenus',
        data: monthlyTrend.map(d => d.income),
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Dépenses',
        data: monthlyTrend.map(d => d.expenses),
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Category spending analysis
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const categoryData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#FF6B9D', '#C44569', '#F97F51', '#FFB142', '#8E44AD',
        '#3498DB', '#1ABC9C', '#E74C3C', '#95A5A6', '#34495E',
        '#16A085', '#D35400', '#8E44AD', '#2980B9', '#C0392B'
      ]
    }]
  };

  // Daily average spending
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const daysSinceFirstTransaction = transactions.length > 0
    ? Math.max(1, Math.ceil((new Date() - new Date(transactions[0].date)) / (1000 * 60 * 60 * 24)))
    : 1;

  const dailyAvgExpense = totalExpenses / daysSinceFirstTransaction;
  const dailyAvgIncome = totalIncome / daysSinceFirstTransaction;

  // Top spending categories
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topCategoriesData = {
    labels: topCategories.map(([cat]) => cat),
    datasets: [{
      label: 'Montant dépensé',
      data: topCategories.map(([, amount]) => amount),
      backgroundColor: [
        'rgba(255, 107, 157, 0.8)',
        'rgba(196, 69, 105, 0.8)',
        'rgba(249, 127, 81, 0.8)',
        'rgba(255, 177, 66, 0.8)',
        'rgba(142, 68, 173, 0.8)'
      ],
      borderColor: [
        'rgb(255, 107, 157)',
        'rgb(196, 69, 105)',
        'rgb(249, 127, 81)',
        'rgb(255, 177, 66)',
        'rgb(142, 68, 173)'
      ],
      borderWidth: 2
    }]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">Analyse détaillée de vos finances</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Dépense Quotidienne Moy.</h3>
            <TrendingUp className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">${dailyAvgExpense.toFixed(2)}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Revenu Quotidien Moy.</h3>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">${dailyAvgIncome.toFixed(2)}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Total Transactions</h3>
            <BarChart3 className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Catégories</h3>
            <PieChart className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(expensesByCategory).length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="glass-card rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-pink-500" size={24} />
            Tendance sur 12 Mois
          </h2>
          <div className="h-80">
            <Line 
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (value) => '$' + value }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-pink-500" size={24} />
            Distribution par Catégorie
          </h2>
          <div className="h-80 flex items-center justify-center">
            {Object.keys(expensesByCategory).length > 0 ? (
              <PolarArea 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 10, font: { size: 11 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed.r || 0;
                          return `${label}: $${value.toFixed(2)}`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-400">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="glass-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-pink-500" size={24} />
            Top 5 Catégories de Dépenses
          </h2>
          <div className="h-80">
            <Bar 
              data={topCategoriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.parsed.x.toFixed(2)}`
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { callback: (value) => '$' + value }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="glass-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Statistiques Détaillées par Catégorie</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Catégorie</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Montant Total</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Transactions</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Moyenne</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% du Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const count = transactions.filter(t => t.type === 'expense' && t.category === category).length;
                  const avg = amount / count;
                  const percentage = (amount / totalExpenses * 100).toFixed(1);
                  
                  return (
                    <tr key={category} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{category}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-800">${amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{count}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">${avg.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
