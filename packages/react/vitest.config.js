export default {
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            all: true,
            reporter: 'html',
            thresholds: {
                lines: 75,
                functions: 75,
                branches: 75,
                statements: 75,
            }
        },
    },
};