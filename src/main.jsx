import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Silence Trusted Types violations from third-party scripts (like Turnstile)
if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (s) => s,
      createScript: (s) => s,
      createScriptURL: (s) => s,
    });
  } catch (e) {
    console.warn('Trusted Types policy could not be initialized');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
