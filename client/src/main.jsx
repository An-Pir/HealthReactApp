import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { WindowSizeProvider } from './context/WindowSizeContext.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WindowSizeProvider>
      <AuthProvider>
        <Toaster position='top-center' />
        <App />
      </AuthProvider>
    </WindowSizeProvider>
  </StrictMode>
);
