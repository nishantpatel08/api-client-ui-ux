import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  INITIAL_STATE,
  SIDEBAR_HIDDEN_STORAGE_KEY,
  SIDEBAR_WIDTH_STORAGE_KEY,
  workbenchReducer,
} from './workbenchReducer';
import { WorkbenchContext } from './workbenchContextObject';

interface WorkbenchProviderProps {
  children: ReactNode;
}

export function WorkbenchProvider({ children }: WorkbenchProviderProps) {
  const [state, dispatch] = useReducer(workbenchReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        SIDEBAR_WIDTH_STORAGE_KEY,
        String(state.sidebarWidth),
      );
    } catch {
      // ignore quota / access errors
    }
  }, [state.sidebarWidth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        SIDEBAR_HIDDEN_STORAGE_KEY,
        state.sidebarHidden ? 'true' : 'false',
      );
    } catch {
      // ignore quota / access errors
    }
  }, [state.sidebarHidden]);

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}
