import React, { useState } from 'react';
import { X, TrendingUp, Home, DollarSign, PiggyBank, CreditCard, Calendar, BarChart3 } from 'lucide-react';

const FinanceSimulatorModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('savings');

  // Savings Growth State
  const [savingsData, setSavingsData] = useState({
    initialAmount: 1000,
    monthlyDeposit: 200,
    annualRate: 5,
    years: 10
  });
  const [savingsResult, setSavingsResult] = useState(null);

  // Loan Calculator State
  const [loanData, setLoanData] = useState({
    principal: 200000,
    annualRate: 4.5,
    years: 30
  });
  const [loanResult, setLoanResult] = useState(null);

  // Budget Scenario State
  const [budgetData, setBudgetData] = useState({
    currentExpenses: 3000,
    reduction: 20,
    months: 12
  });
  const [budgetResult, setBudgetResult] = useState(null);

  // Investment Growth State
  const [investmentData, setInvestmentData] = useState({
    initialAmount: 5000,
    monthlyContribution: 500,
    annualReturn: 8,
    years: 20
  });
  const [investmentResult, setInvestmentResult] = useState(null);

  // Debt Payoff State
  const [debtData, setDebtData] = useState({
    totalDebt: 10000,
    monthlyPayment: 500,
    interestRate: 18
  });
  const [debtResult, setDebtResult] = useState(null);

  // Retirement Calculator State
  const [retirementData, setRetirementData] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 10000,
    monthlyContribution: 500,
    annualReturn: 7
  });
  const [retirementResult, setRetirementResult] = useState(null);

  // Cash Flow State
  const [cashFlowData, setCashFlowData] = useState({
    currentBalance: 5000,
    monthlyIncome: 4000,
    monthlyExpenses: 3200,
    months: 12
  });
  const [cashFlowResult, setCashFlowResult] = useState(null);

  // Calculations
  const calculateSavings = () => {
    const { initialAmount, monthlyDeposit, annualRate, years } = savingsData;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    let balance = initialAmount;
    const projection = [];
    
    for (let i = 0; i <= months; i++) {
      if (i > 0) {
        balance = balance * (1 + monthlyRate) + monthlyDeposit;
      }
      if (i % 12 === 0) {
        projection.push({ year: i / 12, balance: balance });
      }
    }
    
    const totalDeposits = initialAmount + (monthlyDeposit * months);
    const totalInterest = balance - totalDeposits;
    
    setSavingsResult({
      finalBalance: balance,
      totalDeposits,
      totalInterest,
      projection
    });
  };

  const calculateLoan = () => {
    const { principal, annualRate, years } = loanData;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - principal;
    
    // Amortization schedule (first 12 months)
    let remainingBalance = principal;
    const schedule = [];
    
    for (let i = 1; i <= Math.min(12, months); i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      });
    }
    
    setLoanResult({
      monthlyPayment,
      totalPaid,
      totalInterest,
      schedule
    });
  };

  const calculateBudget = () => {
    const { currentExpenses, reduction, months } = budgetData;
    const newExpenses = currentExpenses * (1 - reduction / 100);
    const monthlySavings = currentExpenses - newExpenses;
    const totalSavings = monthlySavings * months;
    const annualSavings = monthlySavings * 12;
    
    setBudgetResult({
      newExpenses,
      monthlySavings,
      totalSavings,
      annualSavings,
      percentageReduction: reduction
    });
  };

  const calculateInvestment = () => {
    const { initialAmount, monthlyContribution, annualReturn, years } = investmentData;
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    
    let balance = initialAmount;
    const projection = [];
    
    for (let i = 0; i <= months; i++) {
      if (i > 0) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
      if (i % 12 === 0) {
        projection.push({ year: i / 12, balance: balance });
      }
    }
    
    const totalContributions = initialAmount + (monthlyContribution * months);
    const totalGains = balance - totalContributions;
    
    setInvestmentResult({
      finalValue: balance,
      totalContributions,
      totalGains,
      projection
    });
  };

  const calculateDebt = () => {
    const { totalDebt, monthlyPayment, interestRate } = debtData;
    const monthlyRate = interestRate / 100 / 12;
    
    let balance = totalDebt;
    let months = 0;
    let totalPaid = 0;
    
    while (balance > 0 && months < 600) { // Max 50 years
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, balance);
      balance -= principal;
      totalPaid += monthlyPayment;
      months++;
      
      if (monthlyPayment <= interest) break; // Payment too low
    }
    
    const totalInterest = totalPaid - totalDebt;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    setDebtResult({
      months,
      years,
      remainingMonths,
      totalPaid,
      totalInterest,
      payoffPossible: balance <= 0
    });
  };

  const calculateRetirement = () => {
    const { currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn } = retirementData;
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = annualReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    
    let balance = currentSavings;
    
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    
    const totalContributions = currentSavings + (monthlyContribution * months);
    const totalGrowth = balance - totalContributions;
    
    setRetirementResult({
      finalAmount: balance,
      totalContributions,
      totalGrowth,
      yearsToRetirement
    });
  };

  const calculateCashFlow = () => {
    const { currentBalance, monthlyIncome, monthlyExpenses, months } = cashFlowData;
    const monthlyNet = monthlyIncome - monthlyExpenses;
    
    const projection = [];
    let balance = currentBalance;
    
    for (let i = 0; i <= months; i++) {
      projection.push({ month: i, balance: balance });
      balance += monthlyNet;
    }
    
    const finalBalance = currentBalance + (monthlyNet * months);
    const totalIncome = monthlyIncome * months;
    const totalExpenses = monthlyExpenses * months;
    
    setCashFlowResult({
      finalBalance,
      totalIncome,
      totalExpenses,
      netChange: finalBalance - currentBalance,
      projection
    });
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'savings', name: 'Savings Growth', icon: PiggyBank },
    { id: 'loan', name: 'Loan Calculator', icon: Home },
    { id: 'budget', name: 'Budget Scenario', icon: DollarSign },
    { id: 'investment', name: 'Investment Growth', icon: TrendingUp },
    { id: 'debt', name: 'Debt Payoff', icon: CreditCard },
    { id: 'retirement', name: 'Retirement', icon: Calendar },
    { id: 'cashflow', name: 'Cash Flow', icon: BarChart3 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">💰 Finance Simulator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Savings Growth Simulator */}
          {activeTab === 'savings' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Savings Growth Simulator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Amount ($)
                  </label>
                  <input
                    type="number"
                    value={savingsData.initialAmount}
                    onChange={(e) => setSavingsData({...savingsData, initialAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={savingsData.monthlyDeposit}
                    onChange={(e) => setSavingsData({...savingsData, monthlyDeposit: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={savingsData.annualRate}
                    onChange={(e) => setSavingsData({...savingsData, annualRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Period (years)
                  </label>
                  <input
                    type="number"
                    value={savingsData.years}
                    onChange={(e) => setSavingsData({...savingsData, years: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateSavings}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {savingsResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Results:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Final Balance:</span>
                      <span className="font-bold text-green-600">${savingsResult.finalBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deposits:</span>
                      <span>${savingsResult.totalDeposits.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest Earned:</span>
                      <span className="font-bold text-green-600">${savingsResult.totalInterest.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loan Calculator */}
          {activeTab === 'loan' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Loan/Mortgage Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    value={loanData.principal}
                    onChange={(e) => setLoanData({...loanData, principal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanData.annualRate}
                    onChange={(e) => setLoanData({...loanData, annualRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Term (years)
                  </label>
                  <input
                    type="number"
                    value={loanData.years}
                    onChange={(e) => setLoanData({...loanData, years: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateLoan}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {loanResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Results:</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-bold text-blue-600">${loanResult.monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span>${loanResult.totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="text-red-600">${loanResult.totalInterest.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <h5 className="font-semibold text-sm mb-2">First Year Schedule:</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="p-2 text-left">Month</th>
                          <th className="p-2 text-right">Payment</th>
                          <th className="p-2 text-right">Principal</th>
                          <th className="p-2 text-right">Interest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanResult.schedule.map((row) => (
                          <tr key={row.month} className="border-b border-blue-100">
                            <td className="p-2">{row.month}</td>
                            <td className="p-2 text-right">${row.payment.toFixed(2)}</td>
                            <td className="p-2 text-right">${row.principal.toFixed(2)}</td>
                            <td className="p-2 text-right">${row.interest.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Budget Scenario */}
          {activeTab === 'budget' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Budget Scenario Planner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Monthly Expenses ($)
                  </label>
                  <input
                    type="number"
                    value={budgetData.currentExpenses}
                    onChange={(e) => setBudgetData({...budgetData, currentExpenses: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reduction Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={budgetData.reduction}
                    onChange={(e) => setBudgetData({...budgetData, reduction: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Period (months)
                  </label>
                  <input
                    type="number"
                    value={budgetData.months}
                    onChange={(e) => setBudgetData({...budgetData, months: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateBudget}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {budgetResult && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">Results:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>New Monthly Expenses:</span>
                      <span className="font-bold text-purple-600">${budgetResult.newExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Savings:</span>
                      <span className="font-bold text-green-600">${budgetResult.monthlySavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Savings ({budgetData.months} months):</span>
                      <span className="font-bold text-green-600">${budgetResult.totalSavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Savings:</span>
                      <span className="font-bold text-green-600">${budgetResult.annualSavings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Investment Growth */}
          {activeTab === 'investment' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Investment Growth Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={investmentData.initialAmount}
                    onChange={(e) => setInvestmentData({...investmentData, initialAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={investmentData.monthlyContribution}
                    onChange={(e) => setInvestmentData({...investmentData, monthlyContribution: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={investmentData.annualReturn}
                    onChange={(e) => setInvestmentData({...investmentData, annualReturn: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Period (years)
                  </label>
                  <input
                    type="number"
                    value={investmentData.years}
                    onChange={(e) => setInvestmentData({...investmentData, years: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateInvestment}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {investmentResult && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 mb-3">Results:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Final Investment Value:</span>
                      <span className="font-bold text-indigo-600">${investmentResult.finalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Contributions:</span>
                      <span>${investmentResult.totalContributions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Gains:</span>
                      <span className="font-bold text-green-600">${investmentResult.totalGains.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return on Investment:</span>
                      <span className="font-bold text-green-600">
                        {((investmentResult.totalGains / investmentResult.totalContributions) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Debt Payoff */}
          {activeTab === 'debt' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Debt Payoff Simulator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Debt ($)
                  </label>
                  <input
                    type="number"
                    value={debtData.totalDebt}
                    onChange={(e) => setDebtData({...debtData, totalDebt: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Payment ($)
                  </label>
                  <input
                    type="number"
                    value={debtData.monthlyPayment}
                    onChange={(e) => setDebtData({...debtData, monthlyPayment: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={debtData.interestRate}
                    onChange={(e) => setDebtData({...debtData, interestRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateDebt}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {debtResult && (
                <div className={`border rounded-lg p-4 ${debtResult.payoffPossible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <h4 className={`font-semibold mb-3 ${debtResult.payoffPossible ? 'text-green-800' : 'text-red-800'}`}>
                    Results:
                  </h4>
                  {debtResult.payoffPossible ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Time to Pay Off:</span>
                        <span className="font-bold text-green-600">
                          {debtResult.years} years {debtResult.remainingMonths} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Paid:</span>
                        <span>${debtResult.totalPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="text-red-600">${debtResult.totalInterest.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      ⚠️ Your monthly payment is too low to pay off this debt. 
                      Please increase the monthly payment amount.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Retirement Calculator */}
          {activeTab === 'retirement' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Retirement Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={retirementData.currentAge}
                    onChange={(e) => setRetirementData({...retirementData, currentAge: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={retirementData.retirementAge}
                    onChange={(e) => setRetirementData({...retirementData, retirementAge: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Savings ($)
                  </label>
                  <input
                    type="number"
                    value={retirementData.currentSavings}
                    onChange={(e) => setRetirementData({...retirementData, currentSavings: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={retirementData.monthlyContribution}
                    onChange={(e) => setRetirementData({...retirementData, monthlyContribution: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={retirementData.annualReturn}
                    onChange={(e) => setRetirementData({...retirementData, annualReturn: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateRetirement}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {retirementResult && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-3">Results:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Retirement Savings at Age {retirementData.retirementAge}:</span>
                      <span className="font-bold text-amber-600">${retirementResult.finalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Contributions:</span>
                      <span>${retirementResult.totalContributions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Growth:</span>
                      <span className="font-bold text-green-600">${retirementResult.totalGrowth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Years to Retirement:</span>
                      <span className="font-bold">{retirementResult.yearsToRetirement} years</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cash Flow Forecaster */}
          {activeTab === 'cashflow' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Cash Flow Forecaster</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Balance ($)
                  </label>
                  <input
                    type="number"
                    value={cashFlowData.currentBalance}
                    onChange={(e) => setCashFlowData({...cashFlowData, currentBalance: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    value={cashFlowData.monthlyIncome}
                    onChange={(e) => setCashFlowData({...cashFlowData, monthlyIncome: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Expenses ($)
                  </label>
                  <input
                    type="number"
                    value={cashFlowData.monthlyExpenses}
                    onChange={(e) => setCashFlowData({...cashFlowData, monthlyExpenses: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forecast Period (months)
                  </label>
                  <input
                    type="number"
                    value={cashFlowData.months}
                    onChange={(e) => setCashFlowData({...cashFlowData, months: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <button
                onClick={calculateCashFlow}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors mb-4"
              >
                Calculate
              </button>
              
              {cashFlowResult && (
                <div className={`border rounded-lg p-4 ${cashFlowResult.netChange >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <h4 className={`font-semibold mb-3 ${cashFlowResult.netChange >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    Results:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Final Balance:</span>
                      <span className={`font-bold ${cashFlowResult.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${cashFlowResult.finalBalance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Income:</span>
                      <span className="text-green-600">${cashFlowResult.totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses:</span>
                      <span className="text-red-600">${cashFlowResult.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Change:</span>
                      <span className={`font-bold ${cashFlowResult.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cashFlowResult.netChange >= 0 ? '+' : ''}${cashFlowResult.netChange.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceSimulatorModal;
