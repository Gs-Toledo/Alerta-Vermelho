import { test, expect } from '@playwright/test';

async function goToStartScreen (page) {
    await page.goto('/');
}

async function startGame (page) {
    await goToStartScreen(page);

    const startButton = page.getByRole('button', {
        name: 'Iniciar'
    });

    await startButton.click();
}

async function exitGame (page) {
    await startGame(page);

    const exitButton = page.getByRole('button', {
        name: 'Sair'
    });

    await exitButton.click();
}

async function expectFloraIsFull (page) {
    const flora = page.getByText(/Flora/);

    await expect(flora).toBeVisible();
    await expect(flora).toContainText('100%');
}

test('can start the game', async ({ page }) => {
    await startGame(page);
});

test('can exit the game', async ({ page }) => {
    await exitGame(page);
});

test('game is started with full flora', async ({ page }) => {
    await startGame(page);
    await expectFloraIsFull(page);
});

test('game must have region names', async ({ page }) => {
    const regionNames = [
        'Norte',
        'Sul',
        'Nordeste',
        'Sudeste',
        'Centro-Oeste',
    ];

    await startGame(page);

    for (const regionName of regionNames) {
        const region = page.getByText(regionName);

        await expect(region).toBeVisible();
    }
});