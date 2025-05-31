import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@alerta-vermelho/core': path.resolve(__dirname, '../core'),
        },
    },
})
