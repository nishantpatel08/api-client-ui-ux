import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@vscode/codicons/dist/codicon.css';
import './styles/tailwind.css';
import './styles/global.css';
import App from './App';
import { createAppStore } from './store';
import {
  getSeedCollectionsState,
  getSeedRequestTabsState,
  loadCollections,
  loadRequestTabs,
} from './store/persistence';

async function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('Root element #root not found');
  document.documentElement.classList.add('dark');

  const [storedCollections, storedRequestTabs] = await Promise.all([
    loadCollections(),
    loadRequestTabs(),
  ]);
  const store = createAppStore({
    collections: storedCollections ?? getSeedCollectionsState(),
    requestTabs: storedRequestTabs ?? getSeedRequestTabsState(),
  });

  createRoot(rootEl).render(
    <StrictMode>
      <App store={store} />
    </StrictMode>,
  );
}

void bootstrap();
