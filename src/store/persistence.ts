import { createStore, get, set } from 'idb-keyval';
import type { CollectionsState } from './slices/collectionsSlice';
import {
  INITIAL_COLLECTIONS,
  INITIAL_EXPANDED_IDS,
} from '../data/initialCollections';

const DB_NAME = 'vscode-ui-db';
const STORE_NAME = 'vscode-ui-store';
const COLLECTIONS_KEY = 'collections:v1';

const idbStore =
  typeof indexedDB !== 'undefined' ? createStore(DB_NAME, STORE_NAME) : undefined;

export async function loadCollections(): Promise<CollectionsState | undefined> {
  if (!idbStore) return undefined;
  try {
    const stored = await get<CollectionsState>(COLLECTIONS_KEY, idbStore);
    if (!stored || !Array.isArray(stored.tree)) return undefined;
    return {
      tree: stored.tree,
      expandedIds: stored.expandedIds ?? {},
      selectedId: stored.selectedId ?? null,
    };
  } catch {
    return undefined;
  }
}

export async function saveCollections(state: CollectionsState): Promise<void> {
  if (!idbStore) return;
  try {
    await set(COLLECTIONS_KEY, state, idbStore);
  } catch {
    // swallow storage failures to keep the UI responsive
  }
}

export function getSeedCollectionsState(): CollectionsState {
  return {
    tree: INITIAL_COLLECTIONS,
    expandedIds: INITIAL_EXPANDED_IDS,
    selectedId: null,
  };
}
