import { defineConfig } from 'vite';
import macrosPlugin from "vite-plugin-babel-macros";
import path from "path"
import react from '@vitejs/plugin-react-swc';
// import react from '@vitejs/plugin-react'

export default defineConfig({
    define: {
        'process.env': {
            REACT_APP_DEV_SERVER_URL: 'http://localhost:3000/api',
            REACT_APP_PRODUCTION_SERVER_URL: '',
            REACT_APP_DEV_USER_NAME: 'email@keepEmailsUnique.org',
            REACT_APP_DEV_PASSSWORD: 'testpassword',
            REACT_APP_DEV_TOKEN: 'alsdfjmlasdasdjlfkjsdfklsdjfsss'
        }
    },
    plugins: [ macrosPlugin(), react() ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/tests/setup.js' // assuming the test folder is in the root of our project
    },
    resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
    }
});
