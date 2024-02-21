import { defineConfig } from 'vite';
import macrosPlugin from "vite-plugin-babel-macros";
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    define: {
        'process.env': {},
    },
    plugins: [
        macrosPlugin(),
        react()
    ]
})