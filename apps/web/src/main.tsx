import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './app.css';

// import posthog from 'posthog-js';
// posthog.init('phc_VlI1NVz75X7jNWjYCOLjbprR2TBkVa6UOsT6omlu5io', {
// 	api_host: 'https://us.i.posthog.com',
// 	defaults: '2025-05-24'
// });

const meticulousScript = document.createElement('script');
meticulousScript.src = 'https://snippet.meticulous.ai/v1/meticulous.js';
meticulousScript.dataset.recordingToken = 'I5tra8TunhqlEtk3JLUasCKouZUbB9gSlEBPSmiw';
meticulousScript.dataset.isProductionEnvironment = String(import.meta.env.PROD);
document.head.appendChild(meticulousScript);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
