import { expect, test } from '@playwright/test';

test('title and auth screens fit a tablet without horizontal scroll', async ({ page }) => {
  for (const path of ['/', '/login', '/register']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }
  await page.goto('/');
  await expect(page.getByRole('button', { name: /login/i }).first()).toBeVisible();
});
