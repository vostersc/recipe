import { defineConfig } from 'vite';
import macrosPlugin from "vite-plugin-babel-macros";
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    define: { 'process.env': {
        REACT_APP_DEV_SERVER_URL: '',
        REACT_APP_PRODUCTION_SERVER_URL: '',
        REACT_APP_USERNAME: '',
        REACT_APP_PASSWORD: '9'
    } },
    plugins: [ macrosPlugin(), react() ]
})