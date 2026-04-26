import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer, {
  type CollectionsState,
} from './slices/collectionsSlice';
import requestTabsReducer, {
  type RequestTabsState,
} from './slices/requestTabsSlice';
import { saveCollections, saveRequestTabs } from './persistence';

export interface PreloadedStoreState {
  collections: CollectionsState;
  requestTabs: RequestTabsState;
}

export function createAppStore(preloadedState: PreloadedStoreState) {
  const store = configureStore({
    reducer: {
      collections: collectionsReducer,
      requestTabs: requestTabsReducer,
    },
    preloadedState,
  });

  const debounce = <Fn extends (...args: never[]) => void>(fn: Fn, ms: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<Fn>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const debouncedSaveCollections = debounce(saveCollections, 250);
  const debouncedSaveRequestTabs = debounce(saveRequestTabs, 250);

  let prevCollections = store.getState().collections;
  let prevRequestTabs = store.getState().requestTabs;

  store.subscribe(() => {
    const state = store.getState();
    if (state.collections !== prevCollections) {
      prevCollections = state.collections;
      debouncedSaveCollections(state.collections);
    }
    if (state.requestTabs !== prevRequestTabs) {
      prevRequestTabs = state.requestTabs;
      debouncedSaveRequestTabs(state.requestTabs);
    }
  });

  return store;
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
