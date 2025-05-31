export default {
    test: {
        globals: true,
        coverage: {
            include: [
                'src/**/*.{ts,js,tsx,jsx}'
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