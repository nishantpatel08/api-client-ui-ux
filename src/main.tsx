import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import './styles/global.css';
import App from './App';
import { createAppStore } from './store';
import { getSeedCollectionsState, loadCollections } from './store/persistence';

async function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('Root element #root not found');

  const storedCollections = await loadCollections();
  const store = createAppStore({
    collections: storedCollections ?? getSeedCollectionsState(),
  });

  createRoot(rootEl).render(
    <StrictMode>
      <App store={store} />
    </StrictMode>,
  );
}

void bootstrap();
