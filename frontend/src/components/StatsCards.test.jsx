import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatsCards from './StatsCards'

describe('StatsCards', () => {
  it('formats and displays income, expenses, savings and receipts count', () => {
    render(
      <StatsCards
        totalIncome={2500}
        totalExpenses={1300.5}
        netSavings={1199.5}
        receiptsCount={4}
      />
    )

    expect(screen.getByText('Total Income')).toBeInTheDocument()
    expect(screen.getByText('$2,500.00')).toBeInTheDocument()
    expect(screen.getByText('$1,300.50')).toBeInTheDocument()
    expect(screen.getByText('$1,199.50')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('handles negative net savings', () => {
    render(
      <StatsCards
        totalIncome={500}
        totalExpenses={800}
        netSavings={-300}
        receiptsCount={0}
      />
    )

    expect(screen.getByText('-$300.00')).toBeInTheDocument()
  })
})
