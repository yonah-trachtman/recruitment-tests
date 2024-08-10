import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { UserType } from '@offisito-shared';
import { AppContextProvider, loadFonts, registerSW } from '@base-frontend';

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', loadFonts);
} else {
  // `DOMContentLoaded` has already fired
  loadFonts();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

registerSW();

root.render(
  <React.StrictMode>
    <AppContextProvider app={UserType.admin}>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
);
