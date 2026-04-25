import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CollectionFolder,
  CollectionNode,
  CollectionRequest,
  HttpMethod,
} from '../../types';
import {
  INITIAL_COLLECTIONS,
  INITIAL_EXPANDED_IDS,
} from '../../data/initialCollections';
import {
  findNode,
  insertNode,
  isDescendant,
  isFolder,
  removeNode,
  updateNode,
} from '../../utils/tree';

export interface CollectionsState {
  tree: CollectionNode[];
  expandedIds: Record<string, boolean>;
  selectedId: string | null;
}

const INITIAL_STATE: CollectionsState = {
  tree: INITIAL_COLLECTIONS,
  expandedIds: INITIAL_EXPANDED_IDS,
  selectedId: null,
};

interface MovePayload {
  sourceId: string;
  targetParentId: string | null;
  targetIndex: number;
}

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: INITIAL_STATE,
  reducers: {
    toggleExpanded(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.expandedIds[id] = !state.expandedIds[id];
    },
    collapseAll(state) {
      state.expandedIds = {};
    },
    setExpanded(
      state,
      action: PayloadAction<{ id: string; expanded: boolean }>,
    ) {
      const { id, expanded } = action.payload;
      if (expanded) state.expandedIds[id] = true;
      else delete state.expandedIds[id];
    },
    selectNode(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    addFolder: {
      reducer(
        state,
        action: PayloadAction<{ parentId: string | null; folder: CollectionFolder }>,
      ) {
        const { parentId, folder } = action.payload;
        state.tree = insertNode(
          state.tree,
          parentId,
          Number.MAX_SAFE_INTEGER,
          folder,
        );
        if (parentId) state.expandedIds[parentId] = true;
        state.expandedIds[folder.id] = true;
      },
      prepare(payload: { parentId?: string | null; name?: string }) {
        const folder: CollectionFolder = {
          id: `col-${nanoid(8)}`,
          type: 'folder',
          name: payload.name ?? 'New Folder',
          children: [],
        };
        return {
          payload: { parentId: payload.parentId ?? null, folder },
        };
      },
    },
    addRequest: {
      reducer(
        state,
        action: PayloadAction<{
          parentId: string | null;
          request: CollectionRequest;
        }>,
      ) {
        const { parentId, request } = action.payload;
        state.tree = insertNode(
          state.tree,
          parentId,
          Number.MAX_SAFE_INTEGER,
          request,
        );
        if (parentId) state.expandedIds[parentId] = true;
      },
      prepare(payload: {
        parentId?: string | null;
        method?: HttpMethod;
        name?: string;
      }) {
        const request: CollectionRequest = {
          id: `req-${nanoid(8)}`,
          type: 'request',
          name: payload.name ?? 'New Request',
          method: payload.method ?? 'GET',
        };
        return {
          payload: { parentId: payload.parentId ?? null, request },
        };
      },
    },
    renameNode(
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) {
      const { id, name } = action.payload;
      state.tree = updateNode(state.tree, id, (node) => ({ ...node, name }));
    },
    deleteNode(state, action: PayloadAction<string>) {
      const { next } = removeNode(state.tree, action.payload);
      state.tree = next;
      if (state.selectedId === action.payload) state.selectedId = null;
      delete state.expandedIds[action.payload];
    },
    moveNode(state, action: PayloadAction<MovePayload>) {
      const { sourceId, targetParentId, targetIndex } = action.payload;
      if (sourceId === targetParentId) return;

      const source = findNode(state.tree, sourceId);
      if (!source) return;

      if (
        isFolder(source) &&
        targetParentId &&
        isDescendant(state.tree, sourceId, targetParentId)
      ) {
        return;
      }

      if (targetParentId) {
        const target = findNode(state.tree, targetParentId);
        if (!target || !isFolder(target)) return;
      }

      const { next: withoutSource, removed } = removeNode(state.tree, sourceId);
      if (!removed) return;

      state.tree = insertNode(
        withoutSource,
        targetParentId,
        targetIndex,
        removed,
      );

      if (targetParentId) state.expandedIds[targetParentId] = true;
    },
  },
});

export const {
  toggleExpanded,
  collapseAll,
  setExpanded,
  selectNode,
  addFolder,
  addRequest,
  renameNode,
  deleteNode,
  moveNode,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
