import { expect, test, type Page } from '@playwright/test';

/** Unique credentials per run (local test values only). */
const run = Date.now().toString(36).slice(-6);
const user = { email: `e2e_${run}@whiteknight.test`, username: `E2E_${run}`, password: `Wk${run}e2e9` };

interface EngineHandle {
  status: string;
  elapsed: number;
  commanders: Array<{ fighterId: number; routed: boolean }>;
  world: { fighters: Array<{ id: number; team: number; hp: number; isCommander: boolean; action: string; x: number }>; player: { x: number; invulnT: number } };
}

async function register(page: Page) {
  await page.goto('/register');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByLabel(/confirm password/i).fill(user.password);
  await page.getByRole('button', { name: /take the oath/i }).click();
  await expect(page).toHaveURL(/\/menu/);
}

test.describe.serial('campaign flow', () => {
  test('register → play Mission 1 → score → leaderboard', async ({ page }) => {
    await register(page);

    // Main menu → Continue → briefing.
    await page.getByRole('button', { name: /continue/i }).first().click();
    await expect(page).toHaveURL(/\/campaign\/m01/);
    await page.getByRole('button', { name: /begin/i }).click();
    await expect(page).toHaveURL(/\/play\/m01/);

    // Loading → ready → play.
    await page.getByRole('button', { name: /to battle/i }).click({ timeout: 60_000 });
    await expect(page.getByText(/enemy commanders/i)).toBeVisible();

    // Fight for a while with real input, keeping the commander alive.
    // Raw mouse events: the canvas animates every frame, so element "stability" waits never settle.
    const strike = async (button: 'left' | 'right' = 'left') => {
      await page.mouse.move(700, 450);
      await page.mouse.down({ button });
      await page.mouse.up({ button });
    };
    await page.keyboard.down('KeyD');
    for (let i = 0; i < 20; i++) {
      await strike(i % 3 === 2 ? 'right' : 'left');
      await page.evaluate(() => {
        const e = (window as unknown as { __wkEngine: EngineHandle }).__wkEngine;
        e.world.player.invulnT = 5;
      });
      await page.waitForTimeout(400);
    }
    await page.keyboard.up('KeyD');

    // Respect the server's plausibility floor (30 s for open-field battles), then finish the battle.
    await page.waitForFunction(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.elapsed > 32, null, { timeout: 420_000 });
    // Weaken the enemy host and bring it to the player's lines; the army and the player finish it.
    await page.evaluate(() => {
      const e = (window as unknown as { __wkEngine: EngineHandle }).__wkEngine;
      for (const f of e.world.fighters) if (f.team === 1 && f.action !== 'dead') {
        f.hp = 1;
        f.x = e.world.player.x + 1.2 + (f.id % 4) * 0.4;
      }
    });
    for (let i = 0; i < 60; i++) {
      const done = await page.evaluate(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status !== 'playing');
      if (done) break;
      await strike();
      await page.waitForTimeout(500);
    }
    await page.waitForFunction(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status !== 'playing', null, { timeout: 60_000 });
    const status = await page.evaluate(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status);
    if (status === 'victory') {
      // The outro may already be on its last line (Skip all hidden) — advance with whichever is shown.
      await page.getByRole('button', { name: /skip all|see results/i }).first().click();
      await expect(page.getByText('Victory')).toBeVisible();
      await expect(page.getByText(/^Score$/)).toBeVisible({ timeout: 20_000 });
      await expect(page.getByRole('button', { name: /next mission/i })).toBeVisible();
    } else {
      await expect(page.getByText('Defeat')).toBeVisible();
    }

    // Leaderboard shows the player.
    await page.goto('/leaderboard');
    await expect(page.getByText(user.username).first()).toBeVisible();
  });

  test('locked missions cannot be started', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email or username/i).fill(user.username);
    await page.getByLabel('Password', { exact: true }).fill(user.password);
    await page.getByRole('button', { name: /enter the realm/i }).click();
    await expect(page).toHaveURL(/\/menu/);
    await page.goto('/play/m15');
    await expect(page).toHaveURL(/\/campaign/);
  });
});
