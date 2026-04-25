import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import type { HttpMethod } from '@/types';
import type { PanelOrientation, RequestTabDraft, WorkspaceState } from '@/types/workspace';

function createDefaultDraft(
  requestId: string,
  name: string,
  method: HttpMethod,
): RequestTabDraft {
  return {
    requestId,
    name,
    method,
    url: 'http://localhost:8000/api',
    body: '',
    response: '',
  };
}

export const INITIAL_WORKSPACE_STATE: WorkspaceState = {
  tabs: [],
  activeTabId: null,
  orientation: 'column',
  draftsByRequestId: {},
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: INITIAL_WORKSPACE_STATE,
  reducers: {
    openRequestTab(
      state,
      action: PayloadAction<{ requestId: string; name: string; method: HttpMethod }>,
    ) {
      const { requestId, name, method } = action.payload;
      const existingTab = state.tabs.find((tab) => tab.requestId === requestId);
      if (existingTab) {
        state.activeTabId = existingTab.id;
      } else {
        const newTab = { id: `tab-${nanoid(8)}`, requestId };
        state.tabs.push(newTab);
        state.activeTabId = newTab.id;
      }

      const existingDraft = state.draftsByRequestId[requestId];
      if (!existingDraft) {
        state.draftsByRequestId[requestId] = createDefaultDraft(requestId, name, method);
      } else {
        existingDraft.name = name;
        existingDraft.method = method;
      }
    },
    activateTab(state, action: PayloadAction<{ tabId: string }>) {
      const tab = state.tabs.find((item) => item.id === action.payload.tabId);
      if (!tab) return;
      state.activeTabId = tab.id;
    },
    closeTab(state, action: PayloadAction<{ tabId: string }>) {
      const tabIndex = state.tabs.findIndex((item) => item.id === action.payload.tabId);
      if (tabIndex < 0) return;
      const wasActive = state.activeTabId === action.payload.tabId;
      state.tabs.splice(tabIndex, 1);
      if (!wasActive) return;
      if (state.tabs.length === 0) {
        state.activeTabId = null;
        return;
      }
      const nextIndex = Math.max(0, tabIndex - 1);
      state.activeTabId = state.tabs[nextIndex]?.id ?? null;
    },
    setOrientation(state, action: PayloadAction<PanelOrientation>) {
      state.orientation = action.payload;
    },
    updateRequestName(
      state,
      action: PayloadAction<{ requestId: string; name: string }>,
    ) {
      const draft = state.draftsByRequestId[action.payload.requestId];
      if (!draft) return;
      draft.name = action.payload.name;
    },
    updateRequestMethod(
      state,
      action: PayloadAction<{ requestId: string; method: HttpMethod }>,
    ) {
      const draft = state.draftsByRequestId[action.payload.requestId];
      if (!draft) return;
      draft.method = action.payload.method;
    },
    updateRequestUrl(
      state,
      action: PayloadAction<{ requestId: string; url: string }>,
    ) {
      const draft = state.draftsByRequestId[action.payload.requestId];
      if (!draft) return;
      draft.url = action.payload.url;
    },
    updateRequestBody(
      state,
      action: PayloadAction<{ requestId: string; body: string }>,
    ) {
      const draft = state.draftsByRequestId[action.payload.requestId];
      if (!draft) return;
      draft.body = action.payload.body;
    },
    setResponsePreview(
      state,
      action: PayloadAction<{ requestId: string; response: string }>,
    ) {
      const draft = state.draftsByRequestId[action.payload.requestId];
      if (!draft) return;
      draft.response = action.payload.response;
    },
  },
});

export const {
  openRequestTab,
  activateTab,
  closeTab,
  setOrientation,
  updateRequestName,
  updateRequestMethod,
  updateRequestUrl,
  updateRequestBody,
  setResponsePreview,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
