import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle("Alerta Vermelho");
});

test('has game title', async ({ page }) => {
    await page.goto('/');

    const gameTitle = page.getByRole('heading', {
        name: 'Alerta Vermelho'
    });

    await expect(gameTitle).toBeVisible();
});

test('has start button', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', {
        name: 'Start'
    });

    await expect(startButton).toBeVisible();
});

test('can redirect to game page by clicking in the start button', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', {
        name: 'Start'
    });

    await startButton.click();

    await page.waitForURL('/game');
});