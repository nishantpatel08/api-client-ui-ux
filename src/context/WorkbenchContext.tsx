import { useMemo, useReducer, type ReactNode } from 'react';
import {
  INITIAL_STATE,
  workbenchReducer,
} from './workbenchReducer';
import { WorkbenchContext } from './workbenchContextObject';

interface WorkbenchProviderProps {
  children: ReactNode;
}

export function WorkbenchProvider({ children }: WorkbenchProviderProps) {
  const [state, dispatch] = useReducer(workbenchReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}
