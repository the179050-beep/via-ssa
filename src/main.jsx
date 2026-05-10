import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Global error handler to suppress Base44 404 errors (non-critical)
const originalError = console.error;
console.error = function(...args) {
  const message = args[0]?.toString?.() || '';
  // Suppress Base44 404 errors as they're expected in dev without proper config
  if (message.includes('Base44Error') && message.includes('404')) {
    console.warn('[v0] Base44 API not available (expected in dev mode)');
    return;
  }
  // Call original error handler for all other errors
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
