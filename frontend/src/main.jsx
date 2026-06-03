import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import useAuthStore from './stores/authStore';
import './index.css';

if (localStorage.getItem('refresh_token') || sessionStorage.getItem('access_token') || localStorage.getItem('token')) {
  useAuthStore.getState().fetchMe().catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
