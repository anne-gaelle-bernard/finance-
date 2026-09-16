import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { DataProvider, useData } from '../contexts/DataContext'

const TestHarness = () => {
  const { transactions, addTransaction, clearCurrentMonthTransactions, clearAllTransactions } = useData()

  return (
    <div>
      <button onClick={() => addTransaction({ type: 'expense', description: 'Ce mois', amount: 10, category: 'food', date: new Date().toISOString().split('T')[0] })}>
        add-this-month
      </button>
      <button onClick={() => addTransaction({ type: 'expense', description: 'Mois dernier', amount: 20, category: 'food', date: '2000-01-15' })}>
        add-last-month
      </button>
      <button onClick={() => clearCurrentMonthTransactions()}>clear-month</button>
      <button onClick={() => clearAllTransactions()}>clear-all</button>
      <ul>
        {transactions.map(t => <li key={t.id}>{t.description}</li>)}
      </ul>
    </div>
  )
}

const renderHarness = () => render(
  <MemoryRouter>
    <AuthProvider>
      <DataProvider>
        <TestHarness />
      </DataProvider>
    </AuthProvider>
  </MemoryRouter>
)

beforeEach(() => {
  localStorage.setItem('currentUser', JSON.stringify({ id: 'u1', name: 'Test', email: 'nouser@example.com' }))
})

afterEach(() => {
  localStorage.clear()
})

describe('clearCurrentMonthTransactions (offline/local storage mode)', () => {
  it('removes only the current month transactions and keeps older ones', async () => {
    renderHarness()

    fireEvent.click(screen.getByText('add-this-month'))
    fireEvent.click(screen.getByText('add-last-month'))

    await waitFor(() => {
      expect(screen.getByText('Ce mois')).toBeInTheDocument()
      expect(screen.getByText('Mois dernier')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('clear-month'))

    await waitFor(() => {
      expect(screen.queryByText('Ce mois')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Mois dernier')).toBeInTheDocument()
  })
})

describe('clearAllTransactions (offline/local storage mode)', () => {
  it('removes every transaction regardless of date', async () => {
    renderHarness()

    fireEvent.click(screen.getByText('add-this-month'))
    fireEvent.click(screen.getByText('add-last-month'))

    await waitFor(() => {
      expect(screen.getByText('Ce mois')).toBeInTheDocument()
      expect(screen.getByText('Mois dernier')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('clear-all'))

    await waitFor(() => {
      expect(screen.queryByText('Ce mois')).not.toBeInTheDocument()
      expect(screen.queryByText('Mois dernier')).not.toBeInTheDocument()
    })
  })
})
