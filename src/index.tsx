import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './pages';

import './index.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter basename='/features'>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
