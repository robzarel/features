import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import getStore from './redux/store';

import App from './pages';

import './index.css';
import './components/theme/themes.css';

const renderApp = async () => {
  const root = document.getElementById('root') as HTMLElement;
  const queryClient = new QueryClient();

  // makes initial app setup
  const store = getStore();

  // mount and render app
  ReactDOM.createRoot(root).render(
    <Provider store={store}>
      <BrowserRouter basename='/features'>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  );
};

if (document.readyState !== 'complete') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
