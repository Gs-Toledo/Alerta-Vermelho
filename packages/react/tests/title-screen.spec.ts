import { test } from '@playwright/test';

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

test('can start the game', async ({ page }) => {
    await startGame(page);
});

test('can exit the game', async ({ page }) => {
    await exitGame(page);
});