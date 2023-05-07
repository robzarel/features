import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Localization from './components/localization-provider';
import store from './redux/store';

const queryClient = new QueryClient();

import App from './pages';

import './index.css';
import './components/theme-toggler/themes.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <BrowserRouter basename='/features'>
      <QueryClientProvider client={queryClient}>
        <Localization>
          <App />
        </Localization>
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);
