# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: campaign.spec.ts >> campaign flow >> register → play Mission 1 → score → leaderboard
- Location: e2e\campaign.spec.ts:25:3

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('[role=application]')
    - locator resolved to <div role="application" aria-label="Game view" class="absolute inset-0 touch-none">…</div>
  - attempting click action
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic:
    - link "Skip to content" [ref=e2] [cursor=pointer]:
      - /url: "#main"
    - generic [ref=e3]:
      - application "Game view" [ref=e4]
      - generic:
        - generic:
          - generic: E2E_9sxm5c
          - generic:
            - progressbar "E2E_9sxm5c health"
          - generic:
            - generic:
              - generic:
                - generic: Enemies
                - generic: "24"
        - generic:
          - generic:
            - generic:
              - generic: Kills
              - generic: "13"
          - generic: "Enemy commanders: 2/3"
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e11]: Mission 1 · Open Field Battle
            - generic [ref=e12]: Open Field
            - generic [ref=e13]: Level 1
          - button "Pause" [ref=e14]
        - generic: Defeat or rout every enemy commander
        - generic:
          - generic "Your companies":
            - generic:
              - generic: 8/8
              - generic: Shield Wall
              - generic: Follow
            - generic:
              - generic: 6/6
              - generic: Pikemen
              - generic: Follow
            - generic:
              - generic: 6/6
              - generic: Longbows
              - generic: Follow
            - generic:
              - generic: 2/4
              - generic: Knights
              - generic: Follow
            - generic: "Tab: select company"
        - generic:
          - generic "Battlefield minimap"
  - list "Notifications"
```

# Test source

```ts
  1  | import { expect, test, type Page } from '@playwright/test';
  2  | 
  3  | /** Unique credentials per run (local test values only). */
  4  | const run = Date.now().toString(36).slice(-6);
  5  | const user = { email: `e2e_${run}@whiteknight.test`, username: `E2E_${run}`, password: `Wk${run}e2e9` };
  6  | 
  7  | interface EngineHandle {
  8  |   status: string;
  9  |   elapsed: number;
  10 |   commanders: Array<{ fighterId: number; routed: boolean }>;
  11 |   world: { fighters: Array<{ id: number; team: number; hp: number; isCommander: boolean; action: string; x: number }>; player: { x: number; invulnT: number } };
  12 | }
  13 | 
  14 | async function register(page: Page) {
  15 |   await page.goto('/register');
  16 |   await page.getByLabel('Email').fill(user.email);
  17 |   await page.getByLabel('Username').fill(user.username);
  18 |   await page.getByLabel('Password', { exact: true }).fill(user.password);
  19 |   await page.getByLabel(/confirm password/i).fill(user.password);
  20 |   await page.getByRole('button', { name: /take the oath/i }).click();
  21 |   await expect(page).toHaveURL(/\/menu/);
  22 | }
  23 | 
  24 | test.describe.serial('campaign flow', () => {
  25 |   test('register → play Mission 1 → score → leaderboard', async ({ page }) => {
  26 |     await register(page);
  27 | 
  28 |     // Main menu → Continue → briefing.
  29 |     await page.getByRole('button', { name: /continue/i }).first().click();
  30 |     await expect(page).toHaveURL(/\/campaign\/m01/);
  31 |     await page.getByRole('button', { name: /begin/i }).click();
  32 |     await expect(page).toHaveURL(/\/play\/m01/);
  33 | 
  34 |     // Loading → ready → play.
  35 |     await page.getByRole('button', { name: /to battle/i }).click({ timeout: 60_000 });
  36 |     await expect(page.getByText(/enemy commanders/i)).toBeVisible();
  37 | 
  38 |     // Fight for a while with real input, keeping the commander alive.
  39 |     const canvas = page.locator('[role=application]');
  40 |     await page.keyboard.down('KeyD');
  41 |     for (let i = 0; i < 20; i++) {
> 42 |       await canvas.click({ button: i % 3 === 2 ? 'right' : 'left', position: { x: 700, y: 400 } });
     |                    ^ Error: locator.click: Test timeout of 180000ms exceeded.
  43 |       await page.evaluate(() => {
  44 |         const e = (window as unknown as { __wkEngine: EngineHandle }).__wkEngine;
  45 |         e.world.player.invulnT = 5;
  46 |       });
  47 |       await page.waitForTimeout(400);
  48 |     }
  49 |     await page.keyboard.up('KeyD');
  50 | 
  51 |     // Respect the server's plausibility floor (30 s for open-field battles), then finish the battle.
  52 |     await page.waitForFunction(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.elapsed > 32, null, { timeout: 90_000 });
  53 |     // Weaken the enemy host and bring it to the player's lines; the army and the player finish it.
  54 |     await page.evaluate(() => {
  55 |       const e = (window as unknown as { __wkEngine: EngineHandle }).__wkEngine;
  56 |       for (const f of e.world.fighters) if (f.team === 1 && f.action !== 'dead') {
  57 |         f.hp = 1;
  58 |         f.x = e.world.player.x + 1.2 + (f.id % 4) * 0.4;
  59 |       }
  60 |     });
  61 |     for (let i = 0; i < 60; i++) {
  62 |       const done = await page.evaluate(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status !== 'playing');
  63 |       if (done) break;
  64 |       await canvas.click({ position: { x: 700, y: 400 } });
  65 |       await page.waitForTimeout(500);
  66 |     }
  67 |     await page.waitForFunction(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status !== 'playing', null, { timeout: 60_000 });
  68 |     const status = await page.evaluate(() => (window as unknown as { __wkEngine: EngineHandle }).__wkEngine.status);
  69 |     if (status === 'victory') {
  70 |       await page.getByRole('button', { name: /skip all/i }).click();
  71 |       await expect(page.getByText('Victory')).toBeVisible();
  72 |       await expect(page.getByText(/^Score$/)).toBeVisible({ timeout: 20_000 });
  73 |       await expect(page.getByRole('button', { name: /next mission/i })).toBeVisible();
  74 |     } else {
  75 |       await expect(page.getByText('Defeat')).toBeVisible();
  76 |     }
  77 | 
  78 |     // Leaderboard shows the player.
  79 |     await page.goto('/leaderboard');
  80 |     await expect(page.getByText(user.username).first()).toBeVisible();
  81 |   });
  82 | 
  83 |   test('locked missions cannot be started', async ({ page }) => {
  84 |     await page.goto('/login');
  85 |     await page.getByLabel(/email or username/i).fill(user.username);
  86 |     await page.getByLabel('Password', { exact: true }).fill(user.password);
  87 |     await page.getByRole('button', { name: /enter the realm/i }).click();
  88 |     await expect(page).toHaveURL(/\/menu/);
  89 |     await page.goto('/play/m15');
  90 |     await expect(page).toHaveURL(/\/campaign/);
  91 |   });
  92 | });
  93 | 
```