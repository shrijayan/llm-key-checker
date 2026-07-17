import { test, expect } from '@playwright/test'

test.describe('LLM Key Checker', () => {
  test('page loads with hero heading and key console', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/LLM Key Checker/)
    await expect(page.getByRole('heading', { name: /Validate any LLM API key/i })).toBeVisible()
    // Popular provider pills are visible immediately — no click required
    await expect(page.getByRole('button', { name: 'OpenAI' })).toBeVisible()
  })

  test('trust badge is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/no storage/i)).toBeVisible()
  })

  test('search filters providers inline', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/search all \d+ providers/i)
    await searchInput.fill('deepseek')
    await expect(page.getByRole('button', { name: /DeepSeek/i }).first()).toBeVisible()
  })

  test('selecting a popular provider shows the key form immediately', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'OpenAI' }).click()
    // Form should appear inline, in the same viewport, no scrolling/navigation needed
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /run check/i })).toBeVisible()
    // Request preview shows the real endpoint being hit — appears both in the
    // title bar and the request preview, so just confirm at least one is visible
    await expect(page.getByText(/api\.openai\.com/i).first()).toBeVisible()
  })

  test('selecting a provider via search shows the key form', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder(/search all \d+ providers/i)
    await searchInput.fill('groq')
    await page.getByRole('button', { name: /Groq/i }).first().click()
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
  })

  test('"change" link returns to provider picker', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'OpenAI' }).click()
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
    await page.getByRole('button', { name: 'change' }).click()
    await expect(page.getByRole('button', { name: 'OpenAI' })).toBeVisible()
  })

  test('submitting empty form does not proceed', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'OpenAI' }).click()
    await page.getByRole('button', { name: /run check/i }).click()
    // Required field validation prevents submission; button still present
    await expect(page.getByRole('button', { name: /run check/i })).toBeVisible()
  })

  test('invalid key returns an error result', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Groq' }).click()
    await page.getByLabel(/API Key/i).fill('invalid-test-key-12345')
    await page.getByRole('button', { name: /run check/i }).click()
    await expect(page.getByText(/result: invalid/i)).toBeVisible({ timeout: 15000 })
  })
})
