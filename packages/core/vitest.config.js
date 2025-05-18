export default {
    test: {
        globals: true,
        coverage: {
            all: true,
            reporter: [],
            thresholds: {
                lines: 75,
                functions: 75,
                branches: 75,
                statements: 75,
            }
        },
    },
}