// votearun/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Assuming App.js is now App.jsx or adjust import
import { BrowserRouter } from 'react-router-dom';
// If you had App.css, import it here: import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);