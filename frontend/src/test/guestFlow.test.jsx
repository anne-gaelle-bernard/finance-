import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import App from '../App'

afterEach(() => {
  localStorage.clear()
})

describe('Guest access flow', () => {
  it('lets a visitor enter read-only demo mode and see seeded data', async () => {
    render(<App />)

    const guestButton = await screen.findByText(/Continuer en visiteur/i)
    fireEvent.click(guestButton)

    expect(await screen.findByText(/Mode visiteur/i)).toBeInTheDocument()
    expect(await screen.findByText('Salaire')).toBeInTheDocument()
  })

  it('persists the guest session across a page reload', async () => {
    const { unmount } = render(<App />)
    const guestButton = await screen.findByText(/Continuer en visiteur/i)
    fireEvent.click(guestButton)
    await screen.findByText(/Mode visiteur/i)
    unmount()

    render(<App />)
    expect(await screen.findByText(/Mode visiteur/i)).toBeInTheDocument()
  })
})
