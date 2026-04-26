import { useContext } from 'react';
import {
  WorkbenchDndContext,
  type WorkbenchDndState,
} from '../context/workbenchDndContext';

export function useWorkbenchDnd(): WorkbenchDndState {
  return useContext(WorkbenchDndContext);
}
