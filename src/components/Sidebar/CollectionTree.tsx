import { memo, useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { FlatCollectionNode } from '../../types';
import { flattenVisible } from '../../utils/tree';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  moveNode,
  selectNode,
  toggleExpanded,
} from '../../store/slices/collectionsSlice';
import { TREE_INDENT_PX } from '../../data/constants';
import { CollectionNode } from './CollectionNode';
import { getDropProjection, type DropProjection } from './treeProjection';
import './CollectionTree.css';

function CollectionTreeComponent() {
  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.collections.tree);
  const expandedIds = useAppSelector((state) => state.collections.expandedIds);
  const selectedId = useAppSelector((state) => state.collections.selectedId);

  const flat = useMemo(
    () => flattenVisible(tree, expandedIds),
    [tree, expandedIds],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [projection, setProjection] = useState<DropProjection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const ids = useMemo(() => flat.map((n) => n.id), [flat]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setProjection(null);
  }, []);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!activeId || !event.over) return;
      const next = getDropProjection({
        flat,
        activeId,
        overId: event.over.id as string,
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
      const finalProjection = projection;
      setActiveId(null);
      setProjection(null);

      if (!event.over || !finalProjection) return;
      if (sourceId === event.over.id && !finalProjection) return;

      dispatch(
        moveNode({
          sourceId,
          targetParentId: finalProjection.parentId,
          targetIndex: finalProjection.targetIndex,
        }),
      );
    },
    [dispatch, projection],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setProjection(null);
  }, []);

  const handleToggle = useCallback(
    (id: string) => dispatch(toggleExpanded(id)),
    [dispatch],
  );

  const handleSelect = useCallback(
    (id: string) => dispatch(selectNode(id)),
    [dispatch],
  );

  const activeFlat: FlatCollectionNode | undefined = useMemo(
    () => (activeId ? flat.find((n) => n.id === activeId) : undefined),
    [activeId, flat],
  );

  return (
    <div className="tree" role="tree" aria-label="Collections">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="tree__rows">
            {flat.map((item) => {
              const isActive = activeId === item.id;
              const overlayDepth =
                isActive && projection ? projection.depth : undefined;
              return (
                <CollectionNode
                  key={item.id}
                  flat={item}
                  expanded={Boolean(expandedIds[item.id])}
                  selected={selectedId === item.id}
                  overlayDepth={overlayDepth}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeFlat ? (
            <CollectionNode
              flat={activeFlat}
              expanded={Boolean(expandedIds[activeFlat.id])}
              selected
              overlayDepth={projection?.depth ?? activeFlat.depth}
              onToggle={() => undefined}
              onSelect={() => undefined}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export const CollectionTree = memo(CollectionTreeComponent);
