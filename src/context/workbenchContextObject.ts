import { createContext, type Dispatch } from 'react';
import type {
  WorkbenchAction,
  WorkbenchState,
} from './workbenchReducer';

export interface WorkbenchContextValue {
  state: WorkbenchState;
  dispatch: Dispatch<WorkbenchAction>;
}

export const WorkbenchContext = createContext<WorkbenchContextValue | null>(
  null,
);
