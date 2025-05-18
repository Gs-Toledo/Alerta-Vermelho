export default {
    test: {
        globals: true,
        coverage: {
            include: [
                './src/**/*',
            ],
            reporter: ['text', 'html'],
            thresholds: {
                lines: 75,
                functions: 75,
                branches: 75,
                statements: 75,
            }
        },
    },
}