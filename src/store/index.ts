import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer, {
  type CollectionsState,
} from './slices/collectionsSlice';
import { saveCollections } from './persistence';

export interface PreloadedStoreState {
  collections: CollectionsState;
}

export function createAppStore(preloadedState: PreloadedStoreState) {
  const store = configureStore({
    reducer: {
      collections: collectionsReducer,
    },
    preloadedState,
  });

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let previousCollections = store.getState().collections;

  store.subscribe(() => {
    const nextCollections = store.getState().collections;
    if (nextCollections === previousCollections) return;
    previousCollections = nextCollections;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveCollections(nextCollections);
    }, 250);
  });

  return store;
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
