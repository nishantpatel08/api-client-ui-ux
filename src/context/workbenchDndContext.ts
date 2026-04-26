import { createContext } from 'react';
import type { FlatCollectionNode } from '../types';
import type { DropProjection } from '../components/Sidebar/treeProjection';

export interface WorkbenchDndState {
  activeFlat: FlatCollectionNode | null;
  projection: DropProjection | null;
}

export const WorkbenchDndContext = createContext<WorkbenchDndState>({
  activeFlat: null,
  projection: null,
});
