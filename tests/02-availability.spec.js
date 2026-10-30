const { test, expect } = require('@playwright/test');

test('BUG-101: available-only filter excludes zero-bike stations', async ({ page }) => {
  await page.goto('/');

  const cards = page.getByTestId('station-card');
  await expect(cards).toHaveCount(4);

  await page.getByRole('checkbox', { name: 'Available bikes only' }).check();

  await expect(cards).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Riverside Park' })).toHaveCount(0);
});