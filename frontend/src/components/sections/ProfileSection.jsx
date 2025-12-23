import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Mail, Calendar, TrendingUp, TrendingDown, PieChart, BarChart3, Edit2, Save, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const ProfileSection = () => {
  const { currentUser } = useAuth();
  const { transactions } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome * 100).toFixed(1) : 0;

  // Expense breakdown by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const categoryChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#FF6B9D', '#C44569', '#F97F51', '#FFB142', '#8E44AD',
        '#3498DB', '#1ABC9C', '#E74C3C', '#95A5A6', '#34495E'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Monthly income vs expenses (last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyData = last6Months.map(month => {
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
      month: format(month, 'MMM'),
      income,
      expenses,
      savings: income - expenses
    };
  });

  const incomeExpenseChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        backgroundColor: 'rgba(248, 113, 113, 0.5)',
        borderColor: 'rgb(248, 113, 113)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const savingsChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [{
      label: 'Net Savings',
      data: monthlyData.map(d => d.savings),
      backgroundColor: monthlyData.map(d => d.savings >= 0 ? 'rgba(52, 211, 153, 0.7)' : 'rgba(248, 113, 113, 0.7)'),
      borderColor: monthlyData.map(d => d.savings >= 0 ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)'),
      borderWidth: 2
    }]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Gérez votre profil et visualisez vos statistiques</p>
      </div>

      {/* Profile Header */}
      <div className="glass-card rounded-xl shadow-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div className="flex-1 text-center sm:text-left w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{currentUser?.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Membre depuis {format(new Date(), 'MMMM yyyy')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors mx-auto sm:mx-0"
                >
                  <Edit2 size={18} />
                  Modifier le profil
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Revenus Totaux</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Dépenses Totales</h3>
            <TrendingDown className="text-red-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Épargne Nette</h3>
            <PieChart className={netSavings >= 0 ? 'text-green-500' : 'text-red-500'} size={24} />
          </div>
          <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netSavings.toFixed(2)}
          </p>
        </div>

        <div className="glass-card rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Taux d'Épargne</h3>
            <BarChart3 className="text-purple-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-purple-600">{savingsRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expense Breakdown */}
        <div className="glass-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-pink-500" size={24} />
            Répartition des Dépenses
          </h2>
          <div className="h-80 flex items-center justify-center">
            {Object.keys(expensesByCategory).length > 0 ? (
              <Doughnut 
                data={categoryChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 15, font: { size: 12 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-400">Aucune donnée de dépense disponible</p>
            )}
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="glass-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-pink-500" size={24} />
            Revenus vs Dépenses
          </h2>
          <div className="h-80">
            <Line 
              data={incomeExpenseChartData}
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

        {/* Monthly Savings */}
        <div className="glass-card rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-pink-500" size={24} />
            Épargne Mensuelle Nette
          </h2>
          <div className="h-80">
            <Bar 
              data={savingsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `Épargne nette: $${context.parsed.y.toFixed(2)}`
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
      </div>

      {/* Activity Summary */}
      <div className="glass-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Résumé d'Activité</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <p className="text-3xl font-bold text-pink-600">{transactions.length}</p>
            <p className="text-gray-600 mt-1">Transactions Totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {transactions.filter(t => t.type === 'income').length}
            </p>
            <p className="text-gray-600 mt-1">Entrées de Revenus</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {transactions.filter(t => t.type === 'expense').length}
            </p>
            <p className="text-gray-600 mt-1">Entrées de Dépenses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
