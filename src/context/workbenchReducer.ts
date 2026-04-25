import type { EditorPane, TabItem } from '../types';
import {
  ACTIVITY_COLLECTIONS,
  SIDEBAR_DEFAULT,
} from '../data/constants';

export interface WorkbenchState {
  activeActivity: string;
  sidebarWidth: number;
  sidebarHidden: boolean;
  lastOpenSidebarWidth: number;
  panes: EditorPane[];
  hiddenPaneIds: string[];
  focusedPaneId: string;
}

export type WorkbenchAction =
  | { type: 'SET_ACTIVITY'; id: string }
  | { type: 'SET_SIDEBAR_WIDTH'; width: number }
  | { type: 'SET_SIDEBAR_HIDDEN'; hidden: boolean; width?: number }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PANE_SIZES'; sizes: Record<string, number> }
  | { type: 'FOCUS_PANE'; paneId: string }
  | { type: 'SET_ACTIVE_TAB'; paneId: string; tabId: string }
  | { type: 'CLOSE_TAB'; paneId: string; tabId: string }
  | { type: 'CLOSE_PANE'; paneId: string }
  | { type: 'REOPEN_PANE'; paneId: string };

const DEFAULT_PANE_1_TABS: TabItem[] = [
  { id: 'tab-p1-workbench', fileId: 'workbench' },
  { id: 'tab-p1-layout', fileId: 'layout' },
  { id: 'tab-p1-parts', fileId: 'parts' },
];

const DEFAULT_PANE_2_TABS: TabItem[] = [
  { id: 'tab-p2-layout', fileId: 'layout' },
  { id: 'tab-p2-readme', fileId: 'readme' },
];

export const INITIAL_STATE: WorkbenchState = {
  activeActivity: ACTIVITY_COLLECTIONS,
  sidebarWidth: SIDEBAR_DEFAULT,
  sidebarHidden: false,
  lastOpenSidebarWidth: SIDEBAR_DEFAULT,
  panes: [
    {
      id: 'pane-1',
      tabs: DEFAULT_PANE_1_TABS,
      activeTabId: DEFAULT_PANE_1_TABS[0].id,
      size: 1,
    },
    {
      id: 'pane-2',
      tabs: DEFAULT_PANE_2_TABS,
      activeTabId: DEFAULT_PANE_2_TABS[0].id,
      size: 1,
    },
  ],
  hiddenPaneIds: [],
  focusedPaneId: 'pane-1',
};

export function workbenchReducer(
  state: WorkbenchState,
  action: WorkbenchAction,
): WorkbenchState {
  switch (action.type) {
    case 'SET_ACTIVITY':
      return { ...state, activeActivity: action.id };

    case 'SET_SIDEBAR_WIDTH':
      return {
        ...state,
        sidebarWidth: action.width,
        sidebarHidden: false,
      };

    case 'SET_SIDEBAR_HIDDEN':
      return {
        ...state,
        sidebarHidden: action.hidden,
        sidebarWidth: action.width ?? state.sidebarWidth,
        lastOpenSidebarWidth: action.hidden
          ? state.sidebarWidth
          : state.lastOpenSidebarWidth,
      };

    case 'TOGGLE_SIDEBAR': {
      const nextHidden = !state.sidebarHidden;
      return {
        ...state,
        sidebarHidden: nextHidden,
        lastOpenSidebarWidth: nextHidden
          ? state.sidebarWidth
          : state.lastOpenSidebarWidth,
      };
    }

    case 'SET_PANE_SIZES':
      return {
        ...state,
        panes: state.panes.map((pane) =>
          action.sizes[pane.id] !== undefined
            ? { ...pane, size: action.sizes[pane.id] }
            : pane,
        ),
      };

    case 'FOCUS_PANE':
      return { ...state, focusedPaneId: action.paneId };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        focusedPaneId: action.paneId,
        panes: state.panes.map((pane) =>
          pane.id === action.paneId
            ? { ...pane, activeTabId: action.tabId }
            : pane,
        ),
      };

    case 'CLOSE_TAB': {
      return {
        ...state,
        panes: state.panes.map((pane) => {
          if (pane.id !== action.paneId) return pane;
          const nextTabs = pane.tabs.filter((tab) => tab.id !== action.tabId);
          if (nextTabs.length === 0) return { ...pane, tabs: [] };
          const nextActive =
            pane.activeTabId === action.tabId
              ? nextTabs[0].id
              : pane.activeTabId;
          return { ...pane, tabs: nextTabs, activeTabId: nextActive };
        }),
      };
    }

    case 'CLOSE_PANE': {
      if (state.hiddenPaneIds.includes(action.paneId)) return state;
      const remainingVisible = state.panes.filter(
        (pane) =>
          pane.id !== action.paneId &&
          !state.hiddenPaneIds.includes(pane.id),
      );
      const nextFocus =
        state.focusedPaneId === action.paneId && remainingVisible.length > 0
          ? remainingVisible[0].id
          : state.focusedPaneId;
      return {
        ...state,
        hiddenPaneIds: [...state.hiddenPaneIds, action.paneId],
        focusedPaneId: nextFocus,
      };
    }

    case 'REOPEN_PANE': {
      return {
        ...state,
        hiddenPaneIds: state.hiddenPaneIds.filter(
          (id) => id !== action.paneId,
        ),
        panes: state.panes.map((pane) => ({ ...pane, size: 1 })),
      };
    }

    default:
      return state;
  }
}
