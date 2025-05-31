import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle("Alerta Vermelho");
});

test('has heading', async ({ page }) => {
    await page.goto('/');

    const gameTitle = page.getByRole('heading', {
        name: 'Alerta Vermelho'
    });

    await expect(gameTitle).toBeVisible();
});

test('has start button', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', {
        name: 'Iniciar'
    });

    await expect(startButton).toBeVisible();
});

test('has help button', async ({ page }) => {
    await page.goto('/');

    const helpButton = page.getByRole('button', {
        name: 'Ajuda'
    });

    await expect(helpButton).toBeVisible();
});

test('has exit button', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', {
        name: 'Iniciar'
    });

    await startButton.click();

    const exitButton = page.getByRole('button', {
        name: 'Sair'
    });

    await expect(exitButton).toBeVisible();
});