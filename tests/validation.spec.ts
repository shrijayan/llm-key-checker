import { test, expect } from '@playwright/test'

test.describe('LLM Key Checker', () => {
  // Navigate once per test here (instead of repeating it in every test body).
  // `networkidle` matters more than usual on this page: motion, cmdk, and
  // Lenis all load as separate chunks, and interacting before they've
  // hydrated would silently no-op on a controlled input.
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('page loads with hero heading and key console', async ({ page }) => {
    await expect(page).toHaveTitle(/LLM Key Checker/)
    await expect(page.getByRole('heading', { name: /Does your API key/i })).toBeVisible()
    // Popular provider pills are visible immediately inside the console — no click required.
    // Scoped to #console because the provider marquee further down repeats these names.
    await expect(page.locator('#console').getByRole('button', { name: 'OpenAI' })).toBeVisible()
  })

  test('trust badge is visible', async ({ page }) => {
    await expect(page.getByText(/no storage/i).first()).toBeVisible()
  })

  test('search filters providers inline', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search \d+ providers/i)
    await searchInput.fill('deepseek')
    await expect(
      page.locator('#console').getByRole('button', { name: /DeepSeek/i }).first()
    ).toBeVisible()
  })

  test('selecting a popular provider shows the key form immediately', async ({ page }) => {
    await page.locator('#console').getByRole('button', { name: 'OpenAI' }).click()
    // Form should appear inline, in the same viewport, no scrolling/navigation needed
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /run check/i })).toBeVisible()
    // Request preview shows the real endpoint being hit — appears both in the
    // title bar and the request preview, so just confirm at least one is visible
    await expect(page.getByText(/api\.openai\.com/i).first()).toBeVisible()
  })

  test('selecting a provider via search shows the key form', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search \d+ providers/i)
    await searchInput.fill('groq')
    await page.locator('#console').getByRole('button', { name: /Groq/i }).first().click()
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
  })

  test('"change" link returns to provider picker', async ({ page }) => {
    await page.locator('#console').getByRole('button', { name: 'OpenAI' }).click()
    await expect(page.getByLabel(/API Key/i)).toBeVisible()
    await page.getByRole('button', { name: 'change' }).click()
    await expect(page.locator('#console').getByRole('button', { name: 'OpenAI' })).toBeVisible()
  })

  test('submitting empty form does not proceed', async ({ page }) => {
    await page.locator('#console').getByRole('button', { name: 'OpenAI' }).click()
    await page.getByRole('button', { name: /run check/i }).click()
    // Required field validation prevents submission; button still present
    await expect(page.getByRole('button', { name: /run check/i })).toBeVisible()
  })

  test('invalid key returns an error result', async ({ page }) => {
    await page.locator('#console').getByRole('button', { name: 'Groq' }).click()
    await page.getByLabel(/API Key/i).fill('invalid-test-key-12345')
    await page.getByRole('button', { name: /run check/i }).click()
    await expect(page.getByText(/result: invalid/i)).toBeVisible({ timeout: 15000 })
  })

  test('pasting a recognizable key auto-detects the provider and pre-fills it', async ({
    page,
  }) => {
    const smartInput = page.getByPlaceholder(/search \d+ providers/i)
    await smartInput.fill('sk-ant-abcdefghijklmnopqrstuvwxyz0123456789')
    await expect(page.getByText(/auto-detected/i)).toBeVisible()
    await expect(page.getByLabel(/API Key/i)).toHaveValue(
      'sk-ant-abcdefghijklmnopqrstuvwxyz0123456789'
    )
    // The correct provider-specific auth mechanism shows immediately, not a generic bearer header.
    await expect(page.getByText(/x-api-key/i)).toBeVisible()
  })

  test('pasting an unrecognized key falls back to manual pick with a helpful hint', async ({
    page,
  }) => {
    const smartInput = page.getByPlaceholder(/search \d+ providers/i)
    await smartInput.fill('this-is-not-a-recognized-key-format-zzzzz')
    await expect(page.getByText(/couldn.t recognize this key/i)).toBeVisible()
  })

  test('command palette opens with Ctrl+K and jumps to a section', async ({ page }) => {
    await page.keyboard.press('Control+k')
    const paletteInput = page.getByPlaceholder(/jump to a section/i)
    await expect(paletteInput).toBeVisible()

    await paletteInput.fill('security')
    await page.getByRole('option', { name: /security/i }).click()

    await expect(page.getByRole('heading', { name: /Built to be trusted/i })).toBeInViewport()
  })

  test('FAQ entries expand on click', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded()
    const firstEntry = page.locator('#faq details').first()
    await firstEntry.locator('summary').click()
    await expect(firstEntry).toHaveAttribute('open', '')
  })
})
