export default {
    test: {
        include: [
            './src/**/*.{test,spec}.{js,ts,jsx,tsx}',
        ],
        globals: true,
        environment: 'jsdom',
        coverage: {
            include: [
                './src/**/*',
            ],
            reporter: ['text', 'html'],
/*             thresholds: {
                lines: 75,
                functions: 75,
                branches: 75,
                statements: 75,
            } */
        },
    },
};
