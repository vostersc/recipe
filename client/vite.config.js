import { defineConfig } from 'vite';
import macrosPlugin from "vite-plugin-babel-macros";
import react from '@vitejs/plugin-react-swc';

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
    plugins: [ macrosPlugin(), react() ]
})