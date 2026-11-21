import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/michroma/400.css';
import '@fontsource-variable/figtree';
import '@fontsource/martian-mono/400.css';
import '@fontsource/martian-mono/600.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<App />
  </StrictMode>,
);
