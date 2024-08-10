import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

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

registerSW();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <AppContextProvider app={UserType.host}>
      <App />
    </AppContextProvider>
  </StrictMode>,
);
