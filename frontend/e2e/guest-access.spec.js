import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('redirects an unauthenticated visitor from the dashboard to the login page', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)
})

test('lets a visitor enter demo mode, see seeded data, and reset it', async ({ page }) => {
  await page.getByRole('button', { name: /continuer en visiteur/i }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText(/mode visiteur/i)).toBeVisible()
  await expect(page.getByText('Salaire')).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: /réinitialiser/i }).first().click()

  await expect(page.getByText('Salaire')).toBeVisible()
})

test('blocks writes for a guest and shows the read-only warning', async ({ page }) => {
  await page.getByRole('button', { name: /continuer en visiteur/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.getByTitle('Add Expense').click()
  await page.getByPlaceholder(/groceries/i).fill('Test expense')
  await page.getByPlaceholder('0.00').fill('10')

  page.once('dialog', (dialog) => {
    expect(dialog.message()).toMatch(/lecture seule/i)
    dialog.accept()
  })
  await page.getByRole('button', { name: /add expense/i }).click()
})

test('guest session survives a page reload', async ({ page }) => {
  await page.getByRole('button', { name: /continuer en visiteur/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.reload()
  await expect(page.getByText(/mode visiteur/i)).toBeVisible()
})
