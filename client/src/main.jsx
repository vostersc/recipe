import './index.css'

import App from './App.jsx'
import { AppError } from './components/AppError';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Provider store={ store }>
            <AppError>
                <App />
            </AppError>
        </Provider> 
    </BrowserRouter> 
  </React.StrictMode>,
)
