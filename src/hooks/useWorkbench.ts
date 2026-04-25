import { useContext } from 'react';
import {
  WorkbenchContext,
  type WorkbenchContextValue,
} from '../context/workbenchContextObject';

export function useWorkbench(): WorkbenchContextValue {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) {
    throw new Error('useWorkbench must be used within a WorkbenchProvider');
  }
  return ctx;
}
