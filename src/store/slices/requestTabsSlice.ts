import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type {
  HttpMethod,
  RequestBodyMode,
  RequestDraftTab,
  ResponseState,
  RequestTab,
  ResponseViewTab,
} from '../../types';

export interface RequestTabsState {
  tabs: RequestTab[];
  activeTabId: string | null;
}

const INITIAL_STATE: RequestTabsState = {
  tabs: [],
  activeTabId: null,
};

function createDraftTab(overrides?: Partial<RequestTab>): RequestTab {
  return {
    id: `tab-${nanoid(8)}`,
    requestId: null,
    name: 'Untitled Request',
    method: 'GET',
    url: '',
    bodyMode: 'none',
    body: '',
    headers: [],
    queryParams: [],
    activeDraftTab: 'body',
    activeResponseTab: 'preview',
    response: null,
    dirty: false,
    ...overrides,
  };
}

interface OpenRequestTabPayload {
  requestId: string;
  name: string;
  method: HttpMethod;
  url?: string;
}

const requestTabsSlice = createSlice({
  name: 'requestTabs',
  initialState: INITIAL_STATE,
  reducers: {
    /** Open (or focus, if already open) a tab for a collection request. */
    openRequestTab(state, action: PayloadAction<OpenRequestTabPayload>) {
      const { requestId, name, method, url = '' } = action.payload;
      const existing = state.tabs.find((tab) => tab.requestId === requestId);
      if (existing) {
        state.activeTabId = existing.id;
        existing.name = name;
        return;
      }
      const tab = createDraftTab({
        id: requestId,
        requestId,
        name,
        method,
        url,
      });
      state.tabs.push(tab);
      state.activeTabId = tab.id;
    },
    /** Create a brand-new empty draft tab (the + button). */
    createDraftTab(state) {
      const tab = createDraftTab();
      state.tabs.push(tab);
      state.activeTabId = tab.id;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTabId = action.payload;
    },
    closeTab(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.tabs.findIndex((tab) => tab.id === id);
      if (index === -1) return;
      state.tabs.splice(index, 1);
      if (state.activeTabId === id) {
        const next = state.tabs[index] ?? state.tabs[index - 1];
        state.activeTabId = next ? next.id : null;
      }
    },
    reorderTabs(
      state,
      action: PayloadAction<{ sourceId: string; targetId: string }>,
    ) {
      const { sourceId, targetId } = action.payload;
      if (sourceId === targetId) return;
      const sourceIndex = state.tabs.findIndex((tab) => tab.id === sourceId);
      const targetIndex = state.tabs.findIndex((tab) => tab.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return;
      const [moved] = state.tabs.splice(sourceIndex, 1);
      state.tabs.splice(targetIndex, 0, moved);
    },
    renameTab(
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.name = action.payload.name;
    },
    setTabMethod(
      state,
      action: PayloadAction<{ id: string; method: HttpMethod }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.method = action.payload.method;
      tab.dirty = true;
    },
    setTabUrl(
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.url = action.payload.url;
      tab.dirty = true;
    },
    setTabBody(
      state,
      action: PayloadAction<{ id: string; body: string }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.body = action.payload.body;
      tab.dirty = true;
    },
    setTabBodyMode(
      state,
      action: PayloadAction<{ id: string; bodyMode: RequestBodyMode }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.bodyMode = action.payload.bodyMode;
      tab.dirty = true;
    },
    setTabDraftTab(
      state,
      action: PayloadAction<{ id: string; draftTab: RequestDraftTab }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.activeDraftTab = action.payload.draftTab;
    },
    setTabResponseTab(
      state,
      action: PayloadAction<{ id: string; responseTab: ResponseViewTab }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.activeResponseTab = action.payload.responseTab;
    },
    setTabResponse(
      state,
      action: PayloadAction<{ id: string; response: ResponseState | null }>,
    ) {
      const tab = state.tabs.find((t) => t.id === action.payload.id);
      if (!tab) return;
      tab.response = action.payload.response;
    },
    /** Keep the tab name in sync when the collection node is renamed. */
    syncRequestName(
      state,
      action: PayloadAction<{ requestId: string; name: string }>,
    ) {
      const tab = state.tabs.find(
        (t) => t.requestId === action.payload.requestId,
      );
      if (!tab) return;
      tab.name = action.payload.name;
    },
    /** Close tabs referencing a deleted collection request. */
    closeTabForRequest(state, action: PayloadAction<string>) {
      const index = state.tabs.findIndex(
        (tab) => tab.requestId === action.payload,
      );
      if (index === -1) return;
      state.tabs.splice(index, 1);
      if (state.activeTabId === action.payload) {
        const next = state.tabs[index] ?? state.tabs[index - 1];
        state.activeTabId = next ? next.id : null;
      }
    },
  },
});

export const {
  openRequestTab,
  createDraftTab: createDraftTabAction,
  setActiveTab,
  closeTab,
  reorderTabs,
  renameTab,
  setTabMethod,
  setTabUrl,
  setTabBody,
  setTabBodyMode,
  setTabDraftTab,
  setTabResponseTab,
  setTabResponse,
  syncRequestName,
  closeTabForRequest,
} = requestTabsSlice.actions;

export default requestTabsSlice.reducer;
