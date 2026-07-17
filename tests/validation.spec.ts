import { test, expect } from '@playwright/test'

test.describe('LLM Key Checker', () => {
  test('page loads with title and provider grid', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/LLM Key Checker/)
    await expect(page.getByRole('heading', { name: /LLM Key Checker/i })).toBeVisible()
    await expect(page.getByTestId('provider-grid')).toBeVisible()
  })

  test('trust badge is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/No backend storage/i)).toBeVisible()
  })

  test('provider grid shows multiple providers', async ({ page }) => {
    await page.goto('/')
    const count = page.getByTestId('provider-count')
    await expect(count).toBeVisible()
    const text = await count.textContent()
    const num = parseInt(text ?? '0')
    expect(num).toBeGreaterThan(10)
  })

  test('search filters providers', async ({ page }) => {
    await page.goto('/')
    const searchInput = page.getByPlaceholder('Search providers...')
    await searchInput.fill('openai')
    await expect(page.getByText('OpenAI')).toBeVisible()
  })

  test('category tabs filter providers', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Chinese/i }).click()
    await expect(page.getByTestId('provider-grid')).toBeVisible()
    // DeepSeek should appear in Chinese category
    await expect(page.getByText('DeepSeek')).toBeVisible()
  })

  test('clicking a provider card expands the key form', async ({ page }) => {
    await page.goto('/')
    // Click OpenAI card
    const openaiCard = page.getByText('OpenAI').first()
    await openaiCard.click()
    // API key input should appear
    await expect(page.getByLabel(/API Key/i).first()).toBeVisible()
    // Check Key button should appear
    await expect(page.getByRole('button', { name: /Check Key/i }).first()).toBeVisible()
  })

  test('submitting empty form shows validation', async ({ page }) => {
    await page.goto('/')
    await page.getByText('OpenAI').first().click()
    await page.getByRole('button', { name: /Check Key/i }).first().click()
    // Should not submit (required field validation)
    await expect(page.getByRole('button', { name: /Check Key/i }).first()).toBeVisible()
  })

  test('invalid key returns error result', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Groq').first().click()
    await page.getByLabel('API Key').first().fill('invalid-test-key-12345')
    await page.getByRole('button', { name: /Check Key/i }).first().click()
    // Wait for result (network call)
    await expect(
      page.locator('[class*="red"]').first()
    ).toBeVisible({ timeout: 15000 })
  })
})
