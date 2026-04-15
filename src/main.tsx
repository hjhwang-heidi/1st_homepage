import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Render Error</h1><pre>${error instanceof Error ? error.stack : String(error)}</pre></div>`;
}
