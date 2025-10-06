import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx executing');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);

  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
  } else {
    console.log('Creating React root and rendering App');
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('React app rendered successfully');
  }
} catch (error) {
  console.error('Fatal error in main.tsx:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Fatal Error: ${error}</div>`;
}
