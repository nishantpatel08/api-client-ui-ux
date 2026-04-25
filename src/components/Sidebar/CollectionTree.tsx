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
import { findNode, flattenVisible } from '../../utils/tree';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addFolder,
  addRequest,
  deleteNode,
  moveNode,
  renameNode,
  selectNode,
  toggleExpanded,
} from '../../store/slices/collectionsSlice';
import { TREE_INDENT_PX } from '../../data/constants';
import { useTreeShortcuts } from '../../hooks/useKeyboardShortcuts';
import { CollectionNode } from './CollectionNode';
import { getDropProjection, type DropProjection } from './treeProjection';
import { ConfirmDialog } from '../ui/confirm-dialog';
import './CollectionTree.css';

interface DeleteTarget {
  id: string;
  name: string;
}

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
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

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

  const handleStartRename = useCallback(
    (id: string) => {
      setRenamingId(id);
      dispatch(selectNode(id));
    },
    [dispatch],
  );

  const handleCommitRename = useCallback(
    (id: string, name: string) => {
      dispatch(renameNode({ id, name }));
      setRenamingId(null);
    },
    [dispatch],
  );

  const handleCancelRename = useCallback(() => {
    setRenamingId(null);
  }, []);

  const handleAddRequest = useCallback(
    (parentId: string) => {
      dispatch(addRequest({ parentId, method: 'GET' }));
    },
    [dispatch],
  );

  const handleAddFolder = useCallback(
    (parentId: string) => {
      dispatch(addFolder({ parentId }));
    },
    [dispatch],
  );

  const handleRequestDelete = useCallback(
    (id: string) => {
      const target = findNode(tree, id);
      if (!target) return;
      setDeleteTarget({ id, name: target.name });
    },
    [tree],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    dispatch(deleteNode(deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget, dispatch]);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  useTreeShortcuts({
    onRename: selectedId
      ? () => {
          setRenamingId(selectedId);
        }
      : undefined,
    onDelete: selectedId
      ? () => {
          const target = findNode(tree, selectedId);
          if (target) setDeleteTarget({ id: selectedId, name: target.name });
        }
      : undefined,
  });

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
                  renaming={renamingId === item.id}
                  overlayDepth={overlayDepth}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                  onStartRename={handleStartRename}
                  onCommitRename={handleCommitRename}
                  onCancelRename={handleCancelRename}
                  onAddRequest={handleAddRequest}
                  onAddFolder={handleAddFolder}
                  onRequestDelete={handleRequestDelete}
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : ''}
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteDialogOpenChange}
      />
    </div>
  );
}

export const CollectionTree = memo(CollectionTreeComponent);
