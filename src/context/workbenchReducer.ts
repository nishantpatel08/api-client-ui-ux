import type { PanelLayout } from '../types';
import {
  ACTIVITY_COLLECTIONS,
  SIDEBAR_DEFAULT,
  SIDEBAR_MAX,
  SIDEBAR_MIN,
} from '../data/constants';

export const SIDEBAR_WIDTH_STORAGE_KEY = 'workbench:sidebarWidth';
export const SIDEBAR_HIDDEN_STORAGE_KEY = 'workbench:sidebarHidden';
export const PANEL_LAYOUT_STORAGE_KEY = 'workbench:panelLayout';

function readStoredSidebarWidth(): number {
  if (typeof window === 'undefined') return SIDEBAR_DEFAULT;
  try {
    const raw = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (!raw) return SIDEBAR_DEFAULT;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return SIDEBAR_DEFAULT;
    return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, parsed));
  } catch {
    return SIDEBAR_DEFAULT;
  }
}

function readStoredSidebarHidden(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SIDEBAR_HIDDEN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function readStoredPanelLayout(): PanelLayout {
  if (typeof window === 'undefined') return 'columns';
  try {
    const raw = window.localStorage.getItem(PANEL_LAYOUT_STORAGE_KEY);
    return raw === 'rows' ? 'rows' : 'columns';
  } catch {
    return 'columns';
  }
}

export interface WorkbenchState {
  activeActivity: string;
  sidebarWidth: number;
  sidebarHidden: boolean;
  lastOpenSidebarWidth: number;
  panelLayout: PanelLayout;
}

export type WorkbenchAction =
  | { type: 'SET_ACTIVITY'; id: string }
  | { type: 'SET_SIDEBAR_WIDTH'; width: number }
  | { type: 'SET_SIDEBAR_HIDDEN'; hidden: boolean; width?: number }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PANEL_LAYOUT'; layout: PanelLayout }
  | { type: 'TOGGLE_PANEL_LAYOUT' };

const STORED_SIDEBAR_WIDTH = readStoredSidebarWidth();
const STORED_SIDEBAR_HIDDEN = readStoredSidebarHidden();
const STORED_PANEL_LAYOUT = readStoredPanelLayout();

export const INITIAL_STATE: WorkbenchState = {
  activeActivity: ACTIVITY_COLLECTIONS,
  sidebarWidth: STORED_SIDEBAR_WIDTH,
  sidebarHidden: STORED_SIDEBAR_HIDDEN,
  lastOpenSidebarWidth: STORED_SIDEBAR_WIDTH,
  panelLayout: STORED_PANEL_LAYOUT,
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

    case 'SET_PANEL_LAYOUT':
      return { ...state, panelLayout: action.layout };

    case 'TOGGLE_PANEL_LAYOUT':
      return {
        ...state,
        panelLayout: state.panelLayout === 'columns' ? 'rows' : 'columns',
      };

    default:
      return state;
  }
}
