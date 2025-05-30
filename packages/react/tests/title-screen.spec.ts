import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle("Alerta Vermelho");
});

test('can start the game', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', {
        name: 'Start'
    });

    await startButton.click();

    await page.waitForURL('/game');
});