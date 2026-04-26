import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { FlatCollectionNode } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { moveNode } from '../../store/slices/collectionsSlice';
import { openRequestTab } from '../../store/slices/requestTabsSlice';
import { flattenVisible } from '../../utils/tree';
import {
  DRAG_TAB_TARGET_ID,
  TREE_INDENT_PX,
} from '../../data/constants';
import { WorkbenchDndContext } from '../../context/workbenchDndContext';
import {
  getDropProjection,
  type DropProjection,
} from '../Sidebar/treeProjection';

interface WorkbenchDndProviderProps {
  children: ReactNode;
}

function WorkbenchDndProviderComponent({ children }: WorkbenchDndProviderProps) {
  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.collections.tree);
  const expandedIds = useAppSelector((state) => state.collections.expandedIds);

  const flat = useMemo(
    () => flattenVisible(tree, expandedIds),
    [tree, expandedIds],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [projection, setProjection] = useState<DropProjection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const activeFlat: FlatCollectionNode | null = useMemo(
    () => (activeId ? flat.find((n) => n.id === activeId) ?? null : null),
    [activeId, flat],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setProjection(null);
  }, []);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!activeId) return;
      const overId = event.over?.id;
      if (!overId || overId === DRAG_TAB_TARGET_ID) {
        setProjection(null);
        return;
      }
      const next = getDropProjection({
        flat,
        activeId,
        overId: overId as string,
        offsetX: event.delta.x,
        indentPx: TREE_INDENT_PX,
      });
      setProjection(next);
    },
    [activeId, flat],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const sourceId = event.active.id as string;
      const overId = event.over?.id as string | undefined;
      const finalProjection = projection;
      setActiveId(null);
      setProjection(null);

      if (!overId) return;

      if (overId === DRAG_TAB_TARGET_ID) {
        const source = flat.find((n) => n.id === sourceId);
        if (!source || source.node.type !== 'request') return;
        dispatch(
          openRequestTab({
            requestId: source.node.id,
            name: source.node.name,
            method: source.node.method,
          }),
        );
        return;
      }

      if (!finalProjection) return;

      dispatch(
        moveNode({
          sourceId,
          targetParentId: finalProjection.parentId,
          targetIndex: finalProjection.targetIndex,
        }),
      );
    },
    [dispatch, flat, projection],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setProjection(null);
  }, []);

  const dndValue = useMemo(
    () => ({ activeFlat, projection }),
    [activeFlat, projection],
  );

  return (
    <WorkbenchDndContext.Provider value={dndValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}
      </DndContext>
    </WorkbenchDndContext.Provider>
  );
}

export const WorkbenchDndProvider = memo(WorkbenchDndProviderComponent);
