import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer, {
  type CollectionsState,
} from './slices/collectionsSlice';
import workspaceReducer, {
  INITIAL_WORKSPACE_STATE,
} from './slices/workspaceSlice';
import { saveCollections } from './persistence';
import type { WorkspaceState } from '@/types/workspace';

export interface PreloadedStoreState {
  collections: CollectionsState;
  workspace?: WorkspaceState;
}

export function createAppStore(preloadedState: PreloadedStoreState) {
  const store = configureStore({
    reducer: {
      collections: collectionsReducer,
      workspace: workspaceReducer,
    },
    preloadedState: {
      ...preloadedState,
      workspace: preloadedState.workspace ?? INITIAL_WORKSPACE_STATE,
    },
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
